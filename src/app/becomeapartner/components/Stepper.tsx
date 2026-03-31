import { IoCheckmark } from "react-icons/io5";

type StepperProps = {
  currentStep: number;
  steps: string[];
};

export default function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="w-full mb-8">
      {/* ✅ Mobile only: scroll | Laptop: same centered */}
      <div className="overflow-x-auto sm:overflow-visible">
        <div className="flex items-center justify-start md:justify-center w-max md:w-full px-2 md:px-0">
          {steps.map((step, i) => {
            const stepNum = i + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={step} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center relative min-w-[64px] sm:min-w-0">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-colors duration-300
                      ${isCompleted
                        ? "bg-green-600 border-green-600 text-white"
                        : isActive
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      }
                    `}
                  >
                    {isCompleted ? <IoCheckmark className="text-xl" /> : stepNum}
                  </div>

                  {/* Label: mobile wrap, desktop same absolute */}
                  <span
                    className={`
                      mt-2 sm:mt-0
                      text-[11px] sm:text-xs font-medium
                      text-center sm:text-left
                      w-[70px] sm:w-auto
                      leading-tight sm:leading-normal
                      sm:absolute sm:top-12 sm:whitespace-nowrap
                      ${isActive || isCompleted ? "text-gray-800" : "text-gray-400"}
                    `}
                  >
                    {step}
                  </span>
                </div>

                {/* Connecting Line */}
                {i !== steps.length - 1 && (
                  <div
                    className={`
                      w-10 sm:w-12 h-1 mx-2 rounded
                      ${isCompleted ? "bg-green-600" : "bg-gray-200"}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
