/**
 * Types for Random Walk Studio - Chapter 14 Financial Mathematics
 */

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  topic: 'K4' | 'K9';
  question: string;
  mathPrompt?: string;
  options: QuizOption[];
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  commonMisconception: string;
}

export interface SimulationPoint {
  t: number;
  z: number;
  epsilon: number;
  deltaZ: number;
}

export interface PuzzleSlot {
  slotId: string;
  label: string;
  expectedTermId: string;
  filledTermId: string | null;
  hint: string;
}

export interface PuzzleTerm {
  id: string;
  latex: string;
  name: string;
  description: string;
  category: 'first_deriv' | 'second_deriv' | 'time_deriv' | 'drift' | 'diffusion';
}

export interface ItoDerivationStep {
  stepNumber: number;
  title: string;
  prompt: string;
  latexExpression: string;
  userSelectionOptions: {
    id: string;
    label: string;
    latex: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}
