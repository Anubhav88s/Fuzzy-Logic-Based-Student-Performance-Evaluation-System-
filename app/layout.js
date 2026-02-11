import "./globals.css";

export const metadata = {
  title: "NeuroEval | Fuzzy Logic Student Evaluation",
  description: "AI-powered student performance evaluation using Mamdani Fuzzy Inference System. Analyze attendance, assignments, exams, and participation with intelligent fuzzy logic.",
  keywords: "fuzzy logic, student evaluation, performance analysis, Mamdani inference, education technology",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
