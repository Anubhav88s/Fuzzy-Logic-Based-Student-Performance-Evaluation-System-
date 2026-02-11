
/**
 * Fuzzy Logic System for Student Evaluation
 * 
 * Implements Mamdani Fuzzy Inference System
 * - Fuzzification: Triangular & Trapezoidal MFs
 * - Inference: Min-Max
 * - Defuzzification: Centroid
 */

// ==========================================
// 1. Membership Functions (Fuzzification)
// ==========================================

/**
 * Triangular Membership Function
 * @param {number} x - Input value
 * @param {number} a - Left point
 * @param {number} b - Peak point
 * @param {number} c - Right point
 * @returns {number} Membership degree (0-1)
 */
export const trimf = (x, a, b, c) => {
  // Guard against division by zero if points overlap
  const term1 = (b === a) ? (x === a ? 1 : 0) : (x - a) / (b - a);
  const term2 = (c === b) ? (x === b ? 1 : 0) : (c - x) / (c - b);
  return Math.max(0, Math.min(term1, term2));
};

/**
 * Trapezoidal Membership Function
 * @param {number} x - Input value
 * @param {number} a - Left lower point
 * @param {number} b - Left upper point
 * @param {number} c - Right upper point
 * @param {number} d - Right lower point
 * @returns {number} Membership degree (0-1)
 */
export const trapmf = (x, a, b, c, d) => {
  // If b=a, we treat the left slope as vertical (immediate rise)
  // If we assume valid input x, and standard trap shape:
  // We want to avoid 0/0.
  // Standard logic: max(min((x-a)/(b-a), 1, (d-x)/(d-c)), 0)
  
  let term1 = 0;
  if (b > a) {
    term1 = (x - a) / (b - a);
  } else {
    // b === a. If x >= a, it's effectively 1 (or controlled by other terms)
    term1 = x >= a ? 1 : 0;
  }
  
  let term2 = 1; // Middle plateau
  
  let term3 = 0;
  if (d > c) {
    term3 = (d - x) / (d - c);
  } else {
    // d === c. If x <= d, it's effectively 1.
    term3 = x <= d ? 1 : 0;
  }
  
  return Math.max(0, Math.min(term1, term2, term3));
};

// Fuzzy Sets Definitions with [a, b, c] or [a, b, c, d] parameters
export const FUZZY_SETS = {
  attendance: {
    poor: [0, 0, 50, 70], // Trapezoidal: consistently poor until 50
    average: [50, 70, 85], // Triangular: peaks at 70
    good: [70, 85, 100, 100], // Trapezoidal: consistently good after 85
  },
  assignment: {
    low: [0, 0, 40, 60],
    medium: [40, 60, 80],
    high: [60, 80, 100, 100],
  },
  exam: {
    low: [0, 0, 40, 60],
    medium: [40, 60, 80],
    high: [60, 80, 100, 100],
  },
  participation: {
    low: [0, 0, 40, 60],
    medium: [40, 60, 80],
    high: [60, 80, 100, 100],
  },
  performance: {
    poor: [0, 0, 30, 50],
    average: [30, 50, 70],
    good: [50, 70, 90],
    excellent: [70, 90, 100, 100],
  },
};

/**
 * Fuzzify Inputs
 * Calculates membership degrees for all inputs against their respective sets
 * @param {Object} inputs - { attendance, assignment, exam, participation }
 * @returns {Object} - Fuzzified values
 */
export const fuzzify = (inputs) => {
  const { attendance, assignment, exam, participation } = inputs;

  return {
    attendance: {
      poor: trapmf(attendance, ...FUZZY_SETS.attendance.poor),
      average: trimf(attendance, ...FUZZY_SETS.attendance.average),
      good: trapmf(attendance, ...FUZZY_SETS.attendance.good),
    },
    assignment: {
      low: trapmf(assignment, ...FUZZY_SETS.assignment.low),
      medium: trimf(assignment, ...FUZZY_SETS.assignment.medium),
      high: trapmf(assignment, ...FUZZY_SETS.assignment.high),
    },
    exam: {
      low: trapmf(exam, ...FUZZY_SETS.exam.low),
      medium: trimf(exam, ...FUZZY_SETS.exam.medium),
      high: trapmf(exam, ...FUZZY_SETS.exam.high),
    },
    participation: {
      low: trapmf(participation, ...FUZZY_SETS.participation.low),
      medium: trimf(participation, ...FUZZY_SETS.participation.medium),
      high: trapmf(participation, ...FUZZY_SETS.participation.high),
    },
  };
};

// ==========================================
// 2. Rule Evaluation (Inference Engine)
// ==========================================

/**
 * Evaluates fuzzy rules using Min-Max inference
 * @param {Object} f - Fuzzified inputs
 * @returns {Object} - Aggregated output fuzzy set strengths
 */
export const evaluateRules = (f) => {
  const rules = [];

  // Rule 1: IF Attendance is Good AND Exam is High THEN Performance is Excellent
  rules.push({
    strength: Math.min(f.attendance.good, f.exam.high),
    output: 'excellent',
  });

  // Rule 2: IF Attendance is Poor AND Exam is Low THEN Performance is Poor
  rules.push({
    strength: Math.min(f.attendance.poor, f.exam.low),
    output: 'poor',
  });

   // Rule 3: IF Assignment is Medium AND Participation is High THEN Performance is Good
   rules.push({
    strength: Math.min(f.assignment.medium, f.participation.high),
    output: 'good',
  });

  // Rule 4: IF Assignment is High AND Exam is High THEN Performance is Excellent
  rules.push({
    strength: Math.min(f.assignment.high, f.exam.high),
    output: 'excellent',
  });

    // Rule 5: IF Attendance is Average AND Participation is Low THEN Performance is Average
  rules.push({
    strength: Math.min(f.attendance.average, f.participation.low),
    output: 'average',
  });

  // Rule 6: IF Exam is Medium AND Assignment is Low THEN Performance is Poor
  rules.push({
    strength: Math.min(f.exam.medium, f.assignment.low),
    output: 'poor',
  });

  // Rule 7: IF Participation is Medium AND Attendance is Good THEN Performance is Good
  rules.push({
    strength: Math.min(f.participation.medium, f.attendance.good),
    output: 'good',
  });
  
  // Rule 8: IF Exam is Low AND Participation is High THEN Performance is Average (redemption via participation)
  rules.push({
    strength: Math.min(f.exam.low, f.participation.high),
    output: 'average',
  });

  // Aggregation (Max) - Combining rule outputs
  const aggregated = {
    poor: 0,
    average: 0,
    good: 0,
    excellent: 0,
  };

  rules.forEach((rule) => {
    // For each output linguistic variable, take the Maximum strength from all applicable rules
    aggregated[rule.output] = Math.max(aggregated[rule.output], rule.strength);
  });

  return { aggregated, rules }; // Returning rules for visualization if needed
};

// ==========================================
// 3. Defuzzification (Centroid Method)
// ==========================================

/**
 * Calculates the Center of Gravity (Centroid) of the aggregated fuzzy set
 * @param {Object} aggregated - Aggregated strengths (poor, average, good, excellent)
 * @returns {number} - Crisp score (0-100)
 */
export const defuzzify = (aggregated) => {
  let numerator = 0;
  let denominator = 0;
  
  // Numerical integration over the output universe of discourse [0, 100]
  // We use a step size of 1 for sufficient precision
  for (let x = 0; x <= 100; x += 1) {
    // Determine the membership degree of x in each output fuzzy set
    const muPoorTerm = trapmf(x, ...FUZZY_SETS.performance.poor);
    const muAverageTerm = trimf(x, ...FUZZY_SETS.performance.average);
    const muGoodTerm = trimf(x, ...FUZZY_SETS.performance.good);
    const muExcellentTerm = trapmf(x, ...FUZZY_SETS.performance.excellent);

    // Cut (clip) the membership function by the rule strength (Min operator implication)
    const muPoor = Math.min(aggregated.poor, muPoorTerm);
    const muAverage = Math.min(aggregated.average, muAverageTerm);
    const muGood = Math.min(aggregated.good, muGoodTerm);
    const muExcellent = Math.min(aggregated.excellent, muExcellentTerm);
    
    // Aggregation of all rules using Max operator
    const mu = Math.max(muPoor, muAverage, muGood, muExcellent);
    
    // Centroid formula components: Sum(x * mu) / Sum(mu)
    numerator += x * mu;
    denominator += mu;
  }

  // Prevent division by zero if no rules fired
  if (denominator === 0) return 0;
  
  return numerator / denominator;
};

// ==========================================
// Main Evaluation Function
// ==========================================

export const evaluateStudent = (inputs) => {
  // 1. Fuzzification
  const fuzzyInputs = fuzzify(inputs);
  
  // 2. Inference
  const { aggregated, rules } = evaluateRules(fuzzyInputs);
  
  // 3. Defuzzification
  const score = defuzzify(aggregated);
  
  // Determine category based on crisp score (simple logic for display, separate from fuzzy)
  let category = 'Poor';
  if (score >= 80) category = 'Excellent';
  else if (score >= 60) category = 'Good';
  else if (score >= 40) category = 'Average';

  return {
    score,
    category,
    fuzzyInputs,
    aggregated,
    rules
  };
};
