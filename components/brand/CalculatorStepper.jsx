"use client";
export default function CalculatorStepper({
  currentStep,
  steps,
  onStepClick,
  allowFuture = false,
}) {
  return (
    <nav className="bh-stepper" aria-label="Calculator progress">
      <ol>
        {steps.map((step, index) => (
          <li key={step.title}>
            <button
              type="button"
              aria-current={index === currentStep ? "step" : undefined}
              disabled={!allowFuture && index > currentStep}
              onClick={() => onStepClick?.(index)}
            >
              <span className="bh-step-number" aria-hidden="true">
                {index < currentStep ? "✓" : index + 1}
              </span>
              <span>
                {step.title}
                <small>{step.description}</small>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
