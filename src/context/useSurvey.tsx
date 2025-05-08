// src/context/SurveyContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { SurveyCategory, Responses } from '../types/types';

type SurveyContextType = {
    currentStep: number;
    setCurrentStep: (step: number) => void;
    responses: Responses;
    setResponses: (responses: Responses) => void;
    surveyQuestions: SurveyCategory[];
    handleResponse: (questionText: string, value: string) => void;
    handleNext: () => void;
    handlePrevious: () => void;
    handleSubmit: () => Promise<void>;
};

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

type SurveyProviderProps = {
    children: ReactNode;
    surveyQuestions: SurveyCategory[];
};

export function SurveyProvider({ children, surveyQuestions }: SurveyProviderProps) {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [responses, setResponses] = useState<Responses>({});

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
        try {
            const response = await fetch('http://localhost:3001/api/surveys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ responses }),
            });

            if (!response.ok) {
                throw new Error('Submission failed');
            }

            return await response.json();
        } catch (error) {
            console.error("Submission error:", error);
            throw error;
        }
    };

    return (
        <SurveyContext.Provider
            value={{
                currentStep,
                setCurrentStep,
                responses,
                setResponses,
                surveyQuestions,
                handleResponse,
                handleNext,
                handlePrevious,
                handleSubmit,
            }}
        >
            {children}
        </SurveyContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSurvey() {
    const context = useContext(SurveyContext);
    if (context === undefined) {
        throw new Error('useSurvey must be used within a SurveyProvider');
    }
    return context;
}