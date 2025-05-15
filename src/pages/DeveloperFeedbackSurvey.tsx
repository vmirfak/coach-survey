import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2, Check } from "lucide-react";
import { Question, Responses } from "../types/types";
import { ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils";
import { surveyQuestions } from "../data/surveyData";

interface DeveloperFeedbackSurveyProps {
  setSurveyResponses: (responses: Responses) => void;
}

const DeveloperFeedbackSurvey = ({ setSurveyResponses }: DeveloperFeedbackSurveyProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [responses, setResponses] = useState<Responses>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResponse = (questionText: string, value: string) => {
    const question = surveyQuestions
      .flatMap((cat) => cat.questions)
      .find((q) => q.text === questionText);

    if (question?.type === "multiSelect") {
      setResponses((prev) => {
        const prevValues = prev[questionText] as string[] | undefined;
        const updatedValues = prevValues?.includes(value)
          ? prevValues.filter((v) => v !== value)
          : [...(prevValues || []), value];

        return {
          ...prev,
          [questionText]: updatedValues,
        };
      });
    } else {
      setResponses((prev) => ({
        ...prev,
        [questionText]: value,
      }));
    }
  };

  const renderQuestion = (question: Question) => {
    const currentResponse = responses[question.text];

    return (
      <div
        key={question.text}
        className="bg-white p-6 rounded-xl shadow-lg mb-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {question.text}
        </h3>
        <div
          className={`grid ${{
            rating: "grid-cols-1 sm:grid-cols-3 md:grid-cols-5",
            multiSelect: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
          }[question.type]
            } gap-3`}
        >
          {question.options?.map((option: string, index: number) => {
            const isSelected =
              question.type === "multiSelect"
                ? (currentResponse as string[])?.includes(option)
                : currentResponse === option;
            const ratingColorClasses = [
              "bg-red-400 border-red-600",
              "bg-orange-400 border-orange-500",
              "bg-yellow-400 border-yellow-500",
              "bg-lime-500 border-lime-500",
              "bg-green-500 border-green-600",
            ];
            const selectedColorClass = ratingColorClasses[index] || "bg-blue-500 border-blue-600";

            return (
              <button
                key={option}
                onClick={() => handleResponse(question.text, option)}
                className={`
                flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer border-2
                ${question.type === "rating"
                    ? isSelected
                      ? `${selectedColorClass} text-white transform scale-[1.02] shadow-md`
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-blue-300"
                    : isSelected
                      ? "bg-green-600 text-white border-green-600 transform scale-[1.02] shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-blue-300"
                  }
                ${question.type === "rating" ? "text-center justify-center h-14" : ""}
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
              `}
                aria-pressed={isSelected}
              >
                <span className="font-small">{option}</span>
                {isSelected && question.type === "multiSelect" && <Check className="ml-2 w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleNext = () => {
    if (currentStep < surveyQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {


      setSurveyResponses(responses);

      // Send to backend
      const response = await fetch('http://localhost:3001/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      });
      setIsSubmitted(true);
      showSuccessToast("Survey submitted!")

      if (!response.ok) {
        throw new Error('Submission failed');
      }

    } catch (error) {
      showErrorToast("Submission failed ☹️");
      console.error("Submission error:", error);
    }
  };

  const isLastStep = currentStep === surveyQuestions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ToastContainer />
      {isSubmitted ? (
        <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-xl w-full animate-fadeIn">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You! 🎉</h2>
          <p className="text-gray-700">We appreciate your feedback. Have a great day!</p>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
            {/* Progress Bar */}
            <div className="bg-blue-600 text-white p-6">
              <h2 className="text-2xl font-bold">
                {surveyQuestions[currentStep].category} Feedback
              </h2>
              <p className="text-sm mt-1">
                Step {currentStep + 1} of {surveyQuestions.length}
              </p>
            </div>
            <div className="w-full bg-gray-100 h-2">
              <div
                className="bg-blue-600 h-2 transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / surveyQuestions.length) * 100}%`,
                }}
              />
            </div>
            <div className="p-6">
              {surveyQuestions[currentStep].questions.map(renderQuestion)}
            </div>

            <div className="flex justify-between items-center p-6 bg-gray-100">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`
              flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer
              ${currentStep === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50"
                  }
            `}
              >
                <ChevronLeft /> Previous
              </button>

              {isLastStep ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                >
                  Submit Survey <CheckCircle2 />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Next <ChevronRight />
                </button>
              )}
            </div>
          </div>

        </div>
      )}
      <ToastContainer />
    </div>
  );


};

export default DeveloperFeedbackSurvey;