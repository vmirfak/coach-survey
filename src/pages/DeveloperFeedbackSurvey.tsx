import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle2, Check } from "lucide-react";

type QuestionType = "rating" | "multiSelect";

interface Question {
  text: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
}

interface SurveyCategory {
  category: string;
  questions: Question[];
}

type Responses = {
  [questionText: string]: string | string[] | undefined;
};

const DeveloperFeedbackSurvey = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [responses, setResponses] = useState<Responses>({});

  const surveyQuestions: SurveyCategory[] = [
    {
      category: "Technical Workflows",
      questions: [
        {
          text: "How efficient are your current development workflows?",
          type: "rating",
          options: [
            "Extremely inefficient",
            "Somewhat inefficient",
            "Neutral",
            "Somewhat efficient",
            "Extremely efficient",
          ],
        },
        {
          text: "Which areas slow down your development process the most?",
          type: "multiSelect",
          options: [
            "Code Review Bottlenecks",
            "Unclear Requirements",
            "Outdated Documentation",
            "Inefficient Testing",
            "Deployment Complexity",
            "Legacy Code Maintenance",
            "Lack of Automation",
            "Limited Access to Resources",
            "Inadequate Version Control Practices",
          ],
        },
        {
          text: "How efficient are our current development workflows?",
          type: "rating",
          options: [
            "Very inefficient",
            "Somewhat inefficient",
            "Neutral",
            "Somewhat efficient",
            "Very efficient"
          ]
        },
        {
          text: "Select top 3 technical pain points:",
          type: "multiSelect",
          options: [
            "Slow CI/CD pipelines",
            "Flaky tests",
            "Poor documentation",
            "Complex deployments",
            "Legacy code challenges",
            "Environment inconsistencies",
            "Tooling limitations",
            "Code review bottlenecks"
          ]
        },
      ],
    },
    {
      category: "Professional Growth",
      questions: [
        {
          text: "What skills would you most like to develop?",
          type: "multiSelect",
          options: [
            "Advanced Backend Techniques",
            "Frontend Framework Mastery",
            "Cloud Architecture",
            "DevOps Practices",
            "System Design",
            "Machine Learning Integration",
            "Data Engineering",
            "Blockchain Technologies",
            "Security Best Practices",
          ],
        },
        {
          text: "How supported do you feel in your professional development?",
          type: "rating",
          options: [
            "Not supported at all",
            "Slightly supported",
            "Moderately supported",
            "Very supported",
            "Extremely supported",
          ],
        },
        {
          text: "How satisfied are you with current growth opportunities?",
          type: "rating",
          options: [
            "Very dissatisfied",
            "Somewhat dissatisfied",
            "Neutral",
            "Somewhat satisfied",
            "Very satisfied"
          ]
        },
        {
          text: "Which skills do you want to develop?",
          type: "multiSelect",
          options: [
            "Cloud architecture",
            "System design",
            "DevOps practices",
            "Performance optimization",
            "Security engineering",
            "Technical leadership",
            "Data engineering",
            "AI/ML applications"
          ]
        },
        {
          text: "What type of training would benefit you most?",
          type: "multiSelect",
          options: [
            "Hands-on workshops",
            "Conference attendance",
            "Certification programs",
            "Mentorship pairings",
            "Brown bag sessions",
            "Online courses",
            "Project rotations"
          ]
        }
      ],
    },
    {
      category: "Team Dynamics",
      questions: [
        {
          text: "How would you rate team communication?",
          type: "rating",
          options: ["Very Poor", "Poor", "Average", "Good", "Excellent"],
        },
        {
          text: "What communication channels need improvement?",
          type: "multiSelect",
          options: [
            "Daily Stand-ups",
            "Slack/Messaging",
            "Email",
            "Documentation",
            "Sprint Planning",
            "Retrospectives",
            "One-on-one Meetings",
            "Team-building Activities",
          ],
        },
        {
          text: "How effective is team communication?",
          type: "rating",
          options: [
            "Very ineffective",
            "Somewhat ineffective",
            "Neutral",
            "Somewhat effective",
            "Very effective"
          ]
        },
        {
          text: "Which collaboration aspects need improvement?",
          type: "multiSelect",
          options: [
            "Daily stand-ups",
            "Sprint planning",
            "Retrospectives",
            "Knowledge sharing",
            "Cross-team coordination",
            "Documentation practices",
            "Decision transparency"
          ]
        }
      ],
    },
    {
      category: "Leadership Feedback",
      questions: [
        {
          text: "How effective is leadership communication?",
          type: "rating",
          options: [
            "Very ineffective",
            "Somewhat ineffective",
            "Neutral",
            "Somewhat effective",
            "Very effective"
          ]
        },
        {
          text: "What leadership qualities should we develop?",
          type: "multiSelect",
          options: [
            "Technical vision",
            "Decision speed",
            "Transparency",
            "Mentorship",
            "Stakeholder management",
            "Removing blockers",
            "Recognizing contributions"
          ]
        }
      ]
    },
    {
      category: "Work-Life Balance",
      questions: [
        {
          text: "How would you rate your current work-life balance?",
          type: "rating",
          options: [
            "Extremely Poor",
            "Poor",
            "Neutral",
            "Good",
            "Extremely Good",
          ],
        },
        {
          text: "What contributes most to your stress at work?",
          type: "multiSelect",
          options: [
            "Tight Deadlines",
            "Excessive Meetings",
            "Unclear Expectations",
            "Lack of Autonomy",
            "Technical Debt",
            "Constant Context Switching",
            "Inadequate Resources",
            "Poor Management",
          ],
        },
      ],
    },
    {
      category: "Tools and Infrastructure",
      questions: [
        {
          text: "How satisfied are you with your current development tools?",
          type: "rating",
          options: [
            "Very Dissatisfied",
            "Dissatisfied",
            "Neutral",
            "Satisfied",
            "Very Satisfied",
          ],
        },
        {
          text: "Which tools would you like to see improved or introduced?",
          type: "multiSelect",
          options: [
            "IDE",
            "Version Control",
            "Continuous Integration",
            "Deployment Tools",
            "Monitoring Systems",
            "Collaboration Platforms",
            "Code Quality Tools",
            "Project Management Software",
          ],
        },
        {
          text: "How satisfied are you with our development tools?",
          type: "rating",
          options: [
            "Very dissatisfied",
            "Somewhat dissatisfied",
            "Neutral",
            "Somewhat satisfied",
            "Very satisfied"
          ]
        },
        {
          text: "Which tools need immediate attention?",
          type: "multiSelect",
          options: [
            "IDEs/editors",
            "Version control",
            "CI/CD systems",
            "Testing frameworks",
            "Monitoring tools",
            "Debugging utilities",
            "Documentation systems",
            "Project management"
          ]
        }
      ],
    },
    {
      category: "Career Aspirations",
      questions: [
        {
          text: "What is your primary career goal in the next 2-3 years?",
          type: "multiSelect",
          options: [
            "Technical Leadership",
            "Become a Specialist",
            "Move to Management",
            "Start a Startup",
            "Transition to a Different Tech Domain",
            "Improve Technical Skills",
            "Work on Cutting-edge Technologies",
          ],
        },
        {
          text: "How clear is your career path here?",
          type: "rating",
          options: [
            "Very unclear",
            "Somewhat unclear",
            "Neutral",
            "Somewhat clear",
            "Very clear"
          ]
        },
        {
          text: "What career aspects matter most?",
          type: "multiSelect",
          options: [
            "Technical challenges",
            "Leadership opportunities",
            "Compensation growth",
            "Work-life balance",
            "Learning opportunities",
            "Project impact",
            "Company stability"
          ]
        }
      ],
    },
    {
      category: "Final Thoughts",
      questions: [
        {
          text: "Overall, how satisfied are you with your current role?",
          type: "rating",
          options: [
            "Extremely Dissatisfied",
            "Dissatisfied",
            "Neutral",
            "Satisfied",
            "Extremely Satisfied",
          ],
        },
        {
          text: "How likely are you to recommend working here?",
          type: "rating",
          options: [
            "Not likely at all",
            "Slightly unlikely",
            "Neutral",
            "Somewhat likely",
            "Extremely likely"
          ]
        },
      ],
    },
  ];

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

  const handleSubmit = () => {
    console.log("Survey Responses:", responses);
    alert("Survey submitted! Thank you for your feedback.");
  };

  const isLastStep = currentStep === surveyQuestions.length - 1;

  return (
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
  );
};

export default DeveloperFeedbackSurvey;
