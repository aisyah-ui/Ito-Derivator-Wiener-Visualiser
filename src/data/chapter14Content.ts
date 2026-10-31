import { QuizQuestion, PuzzleTerm, ItoDerivationStep } from '../types';

export const K4_THEORY = {
  title: 'Element K4 — The Wiener Process',
  subtitle: 'Continuous-Time Markov Stochastic Process Foundation',
  definition: {
    latex: '\\Delta z = \\epsilon \\sqrt{\\Delta t}, \\quad \\epsilon \\sim \\phi(0, 1)',
    explanation:
      'A Wiener process (also called standard Brownian motion) is a continuous-time stochastic process z(t) where the infinitesimal change over a tiny interval Δt is driven by a standard normal shock ε scaled by the square root of time.',
  },
  properties: [
    {
      id: 'p1',
      title: 'Property 1: Mean Change & Variance Rate',
      latex: 'E[\\Delta z] = 0, \\quad \\text{Var Rate} = 1.0 \\text{ per year}',
      description:
        'The expected drift of a pure Wiener process is zero. Over one full year (Δt = 1.0), the variance of change is exactly 1.0, and the standard deviation is 1.0.',
    },
    {
      id: 'p2',
      title: 'Property 2: Behavior Over Small Time Interval Δt',
      latex: 'E[\\Delta z] = 0, \\quad \\text{Var}(\\Delta z) = \\Delta t, \\quad \\text{SD}(\\Delta z) = \\sqrt{\\Delta t}',
      description:
        'Because standard deviation is of order √Δt and Δt < 1 in small intervals, √Δt is vastly larger than Δt (e.g. if Δt = 0.01, √Δt = 0.1, which is 10 times larger). Stochastic shocks dominate deterministic drift over short horizons.',
    },
    {
      id: 'p3',
      title: 'Property 3: Long-Horizon Distribution Over Time T',
      latex: 'z(T) - z(0) = \\sum_{i=1}^N \\epsilon_i \\sqrt{\\Delta t} \\sim \\phi(0, T)',
      description:
        'By summing N = T/Δt independent normal increments, the sum of variances equals N × Δt = T. Thus the change over interval T is normally distributed with Mean = 0, Variance = T, and Standard Deviation = √T.',
    },
    {
      id: 'p4',
      title: 'Property 4: Independent Increments (Markov Property)',
      latex: '\\text{Cov}(\\Delta z_{t_1}, \\Delta z_{t_2}) = 0 \\quad (t_1 \\cap t_2 = \\emptyset)',
      description:
        'Increments over non-overlapping intervals are mutually independent. The future path depends strictly on the current value z(t), not on the historical route taken to get there.',
    },
  ],
};

export const K9_THEORY = {
  title: "Element K9 — Itô's Lemma",
  subtitle: 'The Fundamental Theorem of Stochastic Calculus',
  definition: {
    generalIto: 'dx = a(x,t)dt + b(x,t)dz',
    lemmaResult:
      'dG = \\left( \\dfrac{\\partial G}{\\partial x} a + \\dfrac{\\partial G}{\\partial t} + \\dfrac{1}{2} \\, \\dfrac{\\partial^2 G}{\\partial x^2} b^2 \\right) dt + \\dfrac{\\partial G}{\\partial x} b \\, dz',
    summary:
      "Unlike ordinary calculus where (dx)² = 0, in stochastic calculus (dz)² = dt. This gives rise to the crucial second-order Taylor term (1/2)(∂²G/∂x²)b² dt, known as Itô's correction or the convexity adjustment.",
  },
  multiplicationTable: [
    { rule: 'dt \\times dt = 0', order: 'O(dt^2)', note: 'Higher order; vanishes in the continuous limit' },
    { rule: 'dt \\times dz = 0', order: 'O(dt^{3/2})', note: 'Higher order; product of deterministic and stochastic increments vanishes' },
    { rule: 'dz \\times dz = dt', order: 'O(dt)', note: 'Crucial! (ε√dt)² = ε² dt. Because E[ε²] = 1, in the limit (dz)² converges to dt deterministically' },
  ],
  gbmApplication: {
    processLatex: 'dS = \\mu S \\, dt + \\sigma S \\, dz',
    aAndB: 'a(S,t) = \\mu S, \\quad b(S,t) = \\sigma S',
    expansionLatex:
      'dG = \\left( \\dfrac{\\partial G}{\\partial S} \\mu S + \\dfrac{\\partial G}{\\partial t} + \\dfrac{1}{2} \\, \\dfrac{\\partial^2 G}{\\partial S^2} \\sigma^2 S^2 \\right) dt + \\dfrac{\\partial G}{\\partial S} \\sigma S \\, dz',
  },
  lnDerivation: {
    func: 'G(S, t) = \\ln S',
    derivatives: [
      { name: 'First derivative with respect to S', latex: '\\dfrac{\\partial G}{\\partial S} = \\dfrac{1}{S}' },
      { name: 'Second derivative with respect to S', latex: '\\dfrac{\\partial^2 G}{\\partial S^2} = -\\, \\dfrac{1}{S^2}' },
      { name: 'Partial derivative with respect to t', latex: '\\dfrac{\\partial G}{\\partial t} = 0' },
    ],
    substitution:
      'd(\\ln S) = \\left[ \\left(\\dfrac{1}{S}\\right)\\mu S + 0 + \\dfrac{1}{2}\\left(-\\, \\dfrac{1}{S^2}\\right)\\sigma^2 S^2 \\right] dt + \\left(\\dfrac{1}{S}\\right)\\sigma S \\, dz',
    simplified: 'd(\\ln S) = \\left( \\mu - \\dfrac{\\sigma^2}{2} \\right) dt + \\sigma \\, dz',
    implication:
      'This proves that the continuous compounding return ln(S_T/S_0) is normally distributed with mean (μ - σ²/2)T and variance σ²T, establishing the celebrated lognormal property of stock prices.',
  },
};

export const K4_QUIZ: QuizQuestion[] = [
  {
    id: 'k4-q1',
    topic: 'K4',
    difficulty: 'Foundation',
    question: 'Over a very small time increment Δt = 0.04 years, what are the expected value and standard deviation of the Wiener increment Δz?',
    mathPrompt: '\\Delta z = \\epsilon \\sqrt{\\Delta t}, \\quad \\Delta t = 0.04',
    options: [
      {
        id: 'a',
        text: 'Mean = 0.04, SD = 0.04',
        isCorrect: false,
        explanation: 'Incorrect. The Wiener process has zero expected change (E[Δz] = 0). A mean of 0.04 confuses Δt with the shock.',
      },
      {
        id: 'b',
        text: 'Mean = 0, SD = 0.20',
        isCorrect: true,
        explanation: 'Correct! E[Δz] = 0 because E[ε] = 0. The standard deviation is √Δt = √0.04 = 0.20 (which is 5 times larger than Δt itself!).',
      },
      {
        id: 'c',
        text: 'Mean = 0, SD = 0.04',
        isCorrect: false,
        explanation: 'Incorrect. The variance is Δt = 0.04, but the standard deviation is the square root of variance: √0.04 = 0.20.',
      },
      {
        id: 'd',
        text: 'Mean = 0.20, SD = 0.20',
        isCorrect: false,
        explanation: 'Incorrect. The mean of standard Wiener increment is strictly 0. 0.20 is solely the standard deviation.',
      },
    ],
    commonMisconception: 'Students frequently confuse Variance (Var = Δt) with Standard Deviation (SD = √Δt), or forget that a standard Wiener process has zero mean drift.',
  },
  {
    id: 'k4-q2',
    topic: 'K4',
    difficulty: 'Intermediate',
    question: 'Why does the standard deviation of a Wiener process scale with √T rather than T over a longer period T?',
    mathPrompt: 'z(T) - z(0) = \\sum_{i=1}^{N} \\Delta z_i',
    options: [
      {
        id: 'a',
        text: 'Because independent variances add linearly: Var(Sum) = N × Δt = T, making SD = √T.',
        isCorrect: true,
        explanation: 'Correct! Due to the Markov property and independent increments, variances add directly: Var(∑ Δz_i) = ∑ Var(Δz_i) = N(Δt) = T. The standard deviation is therefore the square root of the variance, √T.',
      },
      {
        id: 'b',
        text: 'Because standard deviations add directly for independent normal variables.',
        isCorrect: false,
        explanation: 'Incorrect. Standard deviations never add directly for independent variables. Only variances are additive under independence.',
      },
      {
        id: 'c',
        text: 'Because time itself slows down under continuous compounding.',
        isCorrect: false,
        explanation: 'Incorrect. Time flow is constant; the square root behavior stems purely from the addition of uncorrelated variance components.',
      },
      {
        id: 'd',
        text: 'Because the drift term cancels out the variance.',
        isCorrect: false,
        explanation: 'Incorrect. A standard Wiener process has no drift term at all (drift = 0); variance accumulation is an intrinsic property.',
      },
    ],
    commonMisconception: 'Assuming that uncertainty accumulates linearly like deterministic velocity, rather than diffusively like random walk variance.',
  },
  {
    id: 'k4-q3',
    topic: 'K4',
    difficulty: 'Advanced',
    question: 'Which of the following statements rigorously captures the Markov property of the Wiener process?',
    mathPrompt: 'P(z_{t+s} \\le x \\mid z_u, 0 \\le u \\le t) = P(z_{t+s} \\le x \\mid z_t)',
    options: [
      {
        id: 'a',
        text: 'Past price history allows forecasting the exact direction of the next increment.',
        isCorrect: false,
        explanation: 'Incorrect. The Markov property means memorylessness; past trajectory provides zero additional predictive power over the current state.',
      },
      {
        id: 'b',
        text: 'The probability distribution of future states depends only on the current state and not on the past trajectory.',
        isCorrect: true,
        explanation: 'Correct! The Markov property states that conditional on the present value z(t), the future evolution is conditionally independent of all past values z(u) for u < t.',
      },
      {
        id: 'c',
        text: 'Increments across overlapping intervals are always perfectly correlated.',
        isCorrect: false,
        explanation: 'Incorrect. Overlapping intervals share common sub-intervals so they are correlated, but this is not the definition of the Markov property.',
      },
      {
        id: 'd',
        text: 'The variance rate changes randomly depending on market volatility.',
        isCorrect: false,
        explanation: 'Incorrect. For a standard Wiener process, the variance rate is constant at 1.0 per unit time.',
      },
    ],
    commonMisconception: 'Believing that past "momentum" or "support levels" exist in a pure Wiener process.',
  },
];

export const K9_QUIZ: QuizQuestion[] = [
  {
    id: 'k9-q1',
    topic: 'K9',
    difficulty: 'Foundation',
    question: "In Itô's calculus multiplication table, what does (dz)² equal in the continuous limit Δt → 0, and why?",
    mathPrompt: '(dz)^2 = (\\epsilon \\sqrt{dt})^2 = \\epsilon^2 dt',
    options: [
      {
        id: 'a',
        text: '0, because any squared differential is second-order negligible.',
        isCorrect: false,
        explanation: 'Incorrect. In standard calculus (dx)² = 0 because dx ~ dt, making (dx)² ~ dt². But for stochastic processes, dz is of order √dt, so (dz)² is of order dt!',
      },
      {
        id: 'b',
        text: 'dt, because E[ε²] = 1 and the variance of (dz)² shrinks to zero as dt → 0.',
        isCorrect: true,
        explanation: 'Correct! Since ε ~ N(0,1), E[ε²] = 1. As dt → 0, by the Law of Large Numbers (dz)² converges with probability 1 to its mean, dt. Thus (dz)² = dt deterministically!',
      },
      {
        id: 'c',
        text: 'dz, because stochastic increments are idempotent.',
        isCorrect: false,
        explanation: 'Incorrect. (dz)² has dimensions of time (seconds or years), not a stochastic differential.',
      },
      {
        id: 'd',
        text: 'dt², because squaring an increment always doubles the power.',
        isCorrect: false,
        explanation: 'Incorrect. (√dt)² = dt¹, not dt².',
      },
    ],
    commonMisconception: 'Treating dz as of order dt and blindly dropping its square, which destroys the entire convexity adjustment of option pricing.',
  },
  {
    id: 'k9-q2',
    topic: 'K9',
    difficulty: 'Intermediate',
    question: 'When deriving the process for G(S) = ln S where dS = μS dt + σS dz, why does the drift term become (μ - σ²/2) instead of simply μ?',
    mathPrompt: 'd(\\ln S) = \\left[ \\frac{1}{S}(\\mu S) + \\frac{1}{2}\\left(-\\frac{1}{S^2}\\right)(\\sigma^2 S^2) \\right] dt + \\dots',
    options: [
      {
        id: 'a',
        text: 'Due to the second-order Itô convexity correction (1/2)(∂²G/∂S²)σ²S², where ∂²(ln S)/∂S² = -1/S².',
        isCorrect: true,
        explanation: 'Correct! By Jensen\'s inequality and Itô\'s Lemma, ln(S) is a concave function (∂²G/∂S² = -1/S² < 0). Evaluating (1/2)(-1/S²)(σ²S²) yields exactly -σ²/2 dt, reducing the drift.',
      },
      {
        id: 'b',
        text: 'Because dividends reduce the continuous return by σ²/2.',
        isCorrect: false,
        explanation: 'Incorrect. The model assumes no dividends; the -σ²/2 term arises purely from the non-linear curvature of the logarithm and volatility.',
      },
      {
        id: 'c',
        text: 'Because the stock price drift μ already includes inflation adjustments.',
        isCorrect: false,
        explanation: 'Incorrect. Inflation is not a factor here; this is purely mathematical stochastic calculus.',
      },
      {
        id: 'd',
        text: 'Because the variance rate of the logarithm is double the variance rate of S.',
        isCorrect: false,
        explanation: 'Incorrect. The diffusion term is σ dz; its variance rate is σ², which is identical in magnitude.',
      },
    ],
    commonMisconception: 'Applying ordinary chain rule d(ln S) = (1/S)dS = μ dt + σ dz, missing the Jensen\'s inequality correction term -σ²/2 dt.',
  },
  {
    id: 'k9-q3',
    topic: 'K9',
    difficulty: 'Advanced',
    question: "If a stock follows dS = 0.15S dt + 0.30S dz, what is the expected annualized continuously compounded rate of return E[d(ln S)/dt]?",
    mathPrompt: '\\mu = 0.15, \\quad \\sigma = 0.30',
    options: [
      {
        id: 'a',
        text: '15.0% per year',
        isCorrect: false,
        explanation: 'Incorrect. 15.0% is μ, the expected rate of arithmetic return E[dS/S], not the continuous geometric compounding rate.',
      },
      {
        id: 'b',
        text: '10.5% per year',
        isCorrect: true,
        explanation: 'Correct! According to Itô\'s Lemma, drift = μ - σ²/2 = 0.15 - (0.30)²/2 = 0.15 - 0.09/2 = 0.15 - 0.045 = 0.105, or 10.5% per year.',
      },
      {
        id: 'c',
        text: '6.0% per year',
        isCorrect: false,
        explanation: 'Incorrect. This subtracts σ² rather than (1/2)σ².',
      },
      {
        id: 'd',
        text: '19.5% per year',
        isCorrect: false,
        explanation: 'Incorrect. This incorrectly adds (1/2)σ² instead of subtracting it.',
      },
    ],
    commonMisconception: 'Confusing arithmetic expected return μ with geometric expected growth rate μ - σ²/2.',
  },
];

export const PUZZLE_TERMS: PuzzleTerm[] = [
  {
    id: 'term-first-deriv',
    name: 'First Derivative (Spatial Velocity)',
    latex: '\\dfrac{\\partial G}{\\partial x} \\, a(x,t)',
    description: 'Measures how G changes due to the underlying state variable drift rate a(x,t).',
    category: 'first_deriv',
  },
  {
    id: 'term-time-decay',
    name: 'Time Derivative (Theta/Decay)',
    latex: '\\dfrac{\\partial G}{\\partial t}',
    description: 'Captures direct sensitivity of function G to the passage of calendar time t.',
    category: 'time_deriv',
  },
  {
    id: 'term-ito-correction',
    name: "Itô's Convexity Correction",
    latex: '\\dfrac{1}{2} \\, \\dfrac{\\partial^2 G}{\\partial x^2} \\, b^2(x,t)',
    description: "The hallmark of stochastic calculus! Derived from (dx)² = b² dt. Reflects curvature/convexity.",
    category: 'second_deriv',
  },
  {
    id: 'term-stochastic-shock',
    name: 'Stochastic Diffusion Term',
    latex: '\\dfrac{\\partial G}{\\partial x} \\, b(x,t)',
    description: 'Scales the Wiener shock dz by the first derivative and volatility parameter b.',
    category: 'diffusion',
  },
];

export const LN_S_DERIVATION_STEPS: ItoDerivationStep[] = [
  {
    stepNumber: 1,
    title: 'Calculate Spatial First Derivative ∂G/∂S',
    prompt: 'Given G(S, t) = ln S, what is the first derivative with respect to stock price S?',
    latexExpression: 'G(S,t) = \\ln S \\implies \\dfrac{\\partial G}{\\partial S} = ?',
    userSelectionOptions: [
      {
        id: 'opt-1-a',
        label: '1 / S',
        latex: '\\dfrac{1}{S}',
        isCorrect: true,
        feedback: 'Excellent! The derivative of the natural logarithm ln(S) with respect to S is 1/S.',
      },
      {
        id: 'opt-1-b',
        label: 'S',
        latex: 'S',
        isCorrect: false,
        feedback: 'Incorrect. The derivative of ln(S) is 1/S, not S.',
      },
      {
        id: 'opt-1-c',
        label: 'ln(S) / S',
        latex: '\\dfrac{\\ln S}{S}',
        isCorrect: false,
        feedback: 'Incorrect. By basic calculus, d/dx[ln(x)] = 1/x.',
      },
    ],
  },
  {
    stepNumber: 2,
    title: 'Calculate Spatial Second Derivative ∂²G/∂S²',
    prompt: 'Differentiating ∂G/∂S = 1/S with respect to S again, what is the curvature ∂²G/∂S²?',
    latexExpression: '\\dfrac{\\partial^2 G}{\\partial S^2} = \\dfrac{\\partial}{\\partial S}\\left(\\dfrac{1}{S}\\right) = ?',
    userSelectionOptions: [
      {
        id: 'opt-2-a',
        label: '-1 / S²',
        latex: '-\\, \\dfrac{1}{S^2}',
        isCorrect: true,
        feedback: 'Correct! d/dS[S⁻¹] = -1 · S⁻² = -1/S². Because this is negative, ln(S) is concave down.',
      },
      {
        id: 'opt-2-b',
        label: '1 / S²',
        latex: '\\dfrac{1}{S^2}',
        isCorrect: false,
        feedback: 'Incorrect. Remember the power rule: d/dS(S⁻¹) = -1 · S⁻², introducing a negative sign.',
      },
      {
        id: 'opt-2-c',
        label: '0',
        latex: '0',
        isCorrect: false,
        feedback: 'Incorrect. 1/S is not constant with respect to S, so its derivative cannot be zero.',
      },
    ],
  },
  {
    stepNumber: 3,
    title: 'Calculate Calendar Time Derivative ∂G/∂t',
    prompt: 'Since G(S, t) = ln S has no explicit calendar time variable t, what is ∂G/∂t?',
    latexExpression: '\\dfrac{\\partial G}{\\partial t} = ?',
    userSelectionOptions: [
      {
        id: 'opt-3-a',
        label: '0',
        latex: '0',
        isCorrect: true,
        feedback: 'Spot on! Because G does not explicitly contain t, its partial time derivative is zero.',
      },
      {
        id: 'opt-3-b',
        label: '1 / t',
        latex: '\\dfrac{1}{t}',
        isCorrect: false,
        feedback: 'Incorrect. t is not present in the formula G = ln S.',
      },
      {
        id: 'opt-3-c',
        label: 'μ',
        latex: '\\mu',
        isCorrect: false,
        feedback: 'Incorrect. μ is the drift parameter of the process S, not a partial derivative of G.',
      },
    ],
  },
  {
    stepNumber: 4,
    title: 'Substitute Derivatives into Itô Formula & Simplify',
    prompt: 'Substitute ∂G/∂S = 1/S, ∂²G/∂S² = -1/S², and ∂G/∂t = 0 into Itô\'s equation for GBM:',
    latexExpression: 'dG = \\left[ \\left(\\dfrac{1}{S}\\right)\\mu S + 0 + \\dfrac{1}{2}\\left(-\\, \\dfrac{1}{S^2}\\right)\\sigma^2 S^2 \\right] dt + \\left(\\dfrac{1}{S}\\right)\\sigma S \\, dz',
    userSelectionOptions: [
      {
        id: 'opt-4-a',
        label: '(μ - σ²/2) dt + σ dz',
        latex: '\\left(\\mu - \\dfrac{\\sigma^2}{2}\\right) dt + \\sigma \\, dz',
        isCorrect: true,
        feedback: 'Brilliant! Notice how (1/S)·μS = μ, and (1/2)(-1/S²)(σ²S²) = -σ²/2 because S² cancels out! The resulting process d(ln S) has constant drift and diffusion!',
      },
      {
        id: 'opt-4-b',
        label: '(μ + σ²/2) dt + σ dz',
        latex: '\\left(\\mu + \\dfrac{\\sigma^2}{2}\\right) dt + \\sigma \\, dz',
        isCorrect: false,
        feedback: 'Incorrect. The second derivative ∂²G/∂S² has a negative sign (-1/S²), so the volatility correction is subtracted (-σ²/2), not added.',
      },
      {
        id: 'opt-4-c',
        label: 'μ dt + σ dz',
        latex: '\\mu \\, dt + \\sigma \\, dz',
        isCorrect: false,
        feedback: 'Incorrect! This misses the Itô correction term completely. Ordinary calculus fails here; in stochastic calculus (dz)² = dt contributes -σ²/2 dt!',
      },
    ],
  },
];
