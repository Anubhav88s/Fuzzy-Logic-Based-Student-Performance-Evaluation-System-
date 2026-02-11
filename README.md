# 🧠 NeuroEval: Fuzzy Logic Student Evaluation System

**NeuroEval** is a modern, AI-powered web application designed to evaluate student performance using **Fuzzy Logic**. Unlike traditional grading systems that rely on rigid thresholds, NeuroEval uses the **Mamdani Fuzzy Inference System** to mimic human reasoning, providing a more nuanced and fair assessment of student performance based on multiple vague inputs.

## 📸 Screenshots

|                  **Dashboard Overview**                   |                **Evaluation & Charts**                 |
| :-------------------------------------------------------: | :----------------------------------------------------: |
| ![Dashboard](public/Screenshot%202026-02-11%20185745.png) | ![Charts](public/Screenshot%202026-02-11%20185854.png) |

|                       **Fuzzy Sets**                       |                  **History & Dark Mode**                  |
| :--------------------------------------------------------: | :-------------------------------------------------------: |
| ![Fuzzy Sets](public/Screenshot%202026-02-11%20185932.png) | ![Dark Mode](public/Screenshot%202026-02-11%20190033.png) |

---

## 🚀 Key Features

### 1. **Fuzzy Logic Engine (from scratch)**

- **No External Libraries**: The core fuzzy logic engine is implemented entirely in pure JavaScript (`lib/fuzzy.js`) without relying on libraries like `fuzzylogic.js`.
- **Mamdani Inference**: Implements the standard fuzzification -> inference -> aggregation -> defuzzification pipeline.
- **Custom Membership Functions**:
  - **Triangular (trimf)**: For peaked values (e.g., Average).
  - **Trapezoidal (trapmf)**: For plateaued values (e.g., Poor/Excellent).
- **Complex Rule Base**: 8+ logical rules mapping inputs to outputs (e.g., _"IF Attendance is Good AND Exam is High THEN Performance is Excellent"_).

### 2. **Interactive Dashboard**

- **Real-time Evaluation**: Adjust sliders and see the evaluation update instantly (with a simulated calculation delay for UX).
- **Responsive Charts**:
  - **Radar Chart**: Visualizes the student's input profile (Attendance vs Exam vs Assignment vs Participation).
  - **Membership Function Plots**: Interactive graphs showing the degree of membership for each input variable.
  - **Defuzzification Graph**: Visualizes the aggregated fuzzy output area and the **Centroid** (Center of Gravity) calculation.

### 3. **Premium UI/UX**

- **Glassmorphism Design**: Modern, translucent cards with background blurs and consistent shadowing.
- **Dark Mode**: Fully supported dark theme with a smooth toggle animation.
- **Animated Components**:
  - Circular score gauge with stroke animation.
  - Smooth sliding entry animations for results.
  - Interactive range sliders with color-coded progress bars.

### 4. **Utility Features**

- **PDF Export**: One-click download of the evaluation report as a high-quality PDF.
- **History Tracking**: Automatically saves evaluation results to local storage, viewable in a sleek slide-out sidebar.

---

## 🛠️ Technology Stack

| Logic              | Technology                                                                                |
| :----------------- | :---------------------------------------------------------------------------------------- |
| **Framework**      | [Next.js 16](https://nextjs.org/) (App Router)                                            |
| **Styling**        | [Tailwind CSS v4](https://tailwindcss.com/) (Glassmorphism layout)                        |
| **Language**       | Modern JavaScript (ES6+)                                                                  |
| **Charting**       | [Chart.js](https://www.chartjs.org/) & [React-Chartjs-2](https://react-chartjs-2.js.org/) |
| **Icons**          | [Lucide React](https://lucide.dev/)                                                       |
| **PDF Generation** | `html2canvas` + `jspdf`                                                                   |
| **Fonts**          | Inter (Google Fonts)                                                                      |

---

## 📐 How the Fuzzy Logic Works

The system evaluates a student based on **4 Inputs**:

1. **Attendance** (0-100%)
2. **Assignment Score** (0-100)
3. **Exam Score** (0-100)
4. **Class Participation** (0-100)

### Step 1: Fuzzification

Crisp input values are converted into fuzzy linguistic terms (Sets) with degrees of membership (0 to 1).

- _Example_: An exam score of **75** might be **0.5 Medium** and **0.5 High**.

### Step 2: Rule Evaluation

The engine applies a set of **IF-THEN rules**.

- _Rule_: `IF Attendance is Good (0.8) AND Exam is High (0.5) THEN Performance is Excellent`
- _Result_: The rule fires with strength **0.5** (Min operator).

### Step 3: Aggregation

The outputs of all triggered rules are combined (Max operator) to form a single complex fuzzy shape representing the final result.

### Step 4: Defuzzification (Centroid)

The system calculates the **Center of Gravity (Centroid)** of the aggregated shape to produce a single crisp score (e.g., **82.5**).

---

## 🤖 Where is the AI?

This application uses **Fuzzy Logic**, a subfield of Artificial Intelligence (AI) that deals with approximate reasoning rather than fixed and exact reasoning.

1.  **Knowledge Representation**: The **Rules** (e.g., _IF Attendance is Good THEN..._) represent human expert knowledge encoded into the system. This is a form of **Knowledge-Based AI**.
2.  **Reasoning**: The engine uses the **Mamdani Inference Method** to reason with vague/imprecise data (like "Good", "Average", "Poor") to produce a precise conclusion, mimicking how a human teacher might subjectively grade a student.
3.  **Decision Making**: It takes complex, multi-dimensional inputs and makes a sophisticated decision (the final score) based on the rule set, handling uncertainty just like a human brain.

---

## 📂 Project Structure

```
fuzzy-logic-eval/
├── app/
│   ├── globals.css      # Global styles with Tailwind @theme
│   ├── layout.js        # Root layout with Glassmorphism bg
│   └── page.js          # Main Dashboard Page
├── components/
│   ├── StudentForm.js   # Input sliders component
│   ├── ResultDisplay.js # Score gauge & PDF export
│   ├── HistoryComponent.js # Slide-out history sidebar
│   ├── MembershipChart.js  # Visualizer for fuzzy sets
│   ├── DefuzzificationChart.js # Visualizer for centroid
│   └── ...
├── lib/
│   └── fuzzy.js         # 🧠 CORE LOGIC ENGINE
└── public/
```

## 🏃‍♂️ Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run Development Server**:

   ```bash
   npm run dev
   ```

3. **Open Browser**:
   Navigate to `http://localhost:3000`

---

_Built with ❤️ by [Your Name]_
