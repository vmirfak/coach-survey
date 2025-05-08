import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

interface SurveyAnswer {
  [key: string]: string | string[];
}

interface QuestionData {
  text: string;
  type: 'rating' | 'multiSelect';
  options: string[];
}

interface SurveyCategory {
  category: string;
  questions: QuestionData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#A4DE6C'];

interface ProcessedQuestion {
  question: string;
  data: { name: string; count: number }[];
  type: 'rating' | 'multiSelect';
}

const SurveyVisualization: React.FC<{ answers: SurveyAnswer; questions: SurveyCategory[] }> = ({
  questions,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Technical Workflows');
  const [answers, setAnswers] = useState<SurveyAnswer | null>(null);
  
  useEffect(() => {
    fetch('http://localhost:3001/api/surveys')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAnswers(data[0].answers);
        }
      })
      .catch(err => console.error('Failed to fetch surveys', err));
  }, []);

  if (!answers) {
    return <div className="p-6">Loading survey responses...</div>;
  }
  
  if(answers){
    console.log("Answers:" + answers)
  }

  const processRatingQuestion = (questionText: string): ProcessedQuestion | null => {
    const answer = answers[questionText];
    if (typeof answer !== 'string') return null;

    const question = questions.flatMap(cat => cat.questions).find(q => q.text === questionText);
    if (!question) return null;

    const data = question.options.map(option => ({
      name: option,
      count: answer === option ? 1 : 0,
    }));

    return {
      question: questionText,
      data,
      type: 'rating',
    };
  };

  const processMultiSelectQuestion = (questionText: string): ProcessedQuestion | null => {
    const answer = answers[questionText];
    if (!Array.isArray(answer)) return null;

    const question = questions.flatMap(cat => cat.questions).find(q => q.text === questionText);
    if (!question) return null;

    const data = question.options.map(option => ({
      name: option,
      count: answer.includes(option) ? 1 : 0,
    }));

    return {
      question: questionText,
      data,
      type: 'multiSelect',
    };
  };

  const getCategoryQuestions = (): ProcessedQuestion[] => {
    const category = questions.find(cat => cat.category === activeCategory);
    if (!category) return [];

    return category.questions
      .map(q =>
        q.type === 'rating'
          ? processRatingQuestion(q.text)
          : q.type === 'multiSelect'
            ? processMultiSelectQuestion(q.text)
            : null
      )
      .filter((q): q is ProcessedQuestion => q !== null);
  };

  const renderQuestionVisualization = (questionData: ProcessedQuestion) => {
    if (questionData.type === 'rating') {
      return (
        <div key={questionData.question} className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-2">{questionData.question}</h3>
          <div className="w-full h-72">
            <ResponsiveContainer>
              <BarChart
                data={questionData.data}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 1]} />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Selected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (questionData.type === 'multiSelect') {
      const chartData = {
        labels: questionData.data.map(item => item.name),
        datasets: [
          {
            data: questionData.data.map(item => item.count),
            backgroundColor: COLORS,
            borderColor: COLORS.map(color => `${color}80`),
            borderWidth: 1,
          },
        ],
      };

      return (
        <div key={questionData.question} className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-2">{questionData.question}</h3>
          <div className="w-full h-96 mb-4">
            <Doughnut
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right' as const,
                  },
                },
              }}
            />
          </div>
          <div>
            <h4 className="text-md font-medium mb-1">Selected Options:</h4>
            <ul className="list-disc list-inside text-sm">
              {questionData.data
                .filter(item => item.count > 0)
                .map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))}
            </ul>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Survey Results Visualization</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        {questions.map(category => (
          <button
            key={category.category}
            onClick={() => setActiveCategory(category.category)}
            className={`px-4 py-2 rounded ${activeCategory === category.category
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
          >
            {category.category}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">{activeCategory}</h2>

      <div className="space-y-6">
        {getCategoryQuestions().map(renderQuestionVisualization)}
      </div>
    </div>
  );
};

export default SurveyVisualization;
