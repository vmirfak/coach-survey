import { useState, useEffect } from "react";
import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { ChevronDown, ChevronUp } from "lucide-react";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface SurveyResponse {
    id: number;
    answers: Record<string, string | string[]>;
    createdAt: string;
}

const SurveyResultsPage = () => {
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCharts, setExpandedCharts] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/surveys");
                if (!response.ok) {
                    throw new Error("Failed to fetch survey responses");
                }
                const data = await response.json();
                setResponses(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchResponses();
    }, []);

    const toggleChart = (question: string) => {
        setExpandedCharts(prev => ({
            ...prev,
            [question]: !prev[question]
        }));
    };

    // Helper function to count responses for a question
    const countResponses = (question: string) => {
        const counts: Record<string, number> = {};

        responses.forEach(response => {
            const answer = response.answers[question];

            if (Array.isArray(answer)) {
                answer.forEach(item => {
                    counts[item] = (counts[item] || 0) + 1;
                });
            } else if (answer !== undefined) {
                counts[answer] = (counts[answer] || 0) + 1;
            }
        });

        return counts;
    };

    // Get all unique questions from the responses
    const allQuestions = Array.from(
        new Set(
            responses.flatMap(response => Object.keys(response.answers))
        )
    );

    // Group questions by type (single answer vs multi-select)
    const singleAnswerQuestions = allQuestions.filter(question => {
        const firstResponse = responses.find(r => r.answers[question]);
        return firstResponse && !Array.isArray(firstResponse.answers[question]);
    });

    const multiSelectQuestions = allQuestions.filter(question => {
        const firstResponse = responses.find(r => r.answers[question]);
        return firstResponse && Array.isArray(firstResponse.answers[question]);
    });

    // Create chart data for a question
    const createChartData = (question: string) => {
        const responseCounts = countResponses(question);
        const labels = Object.keys(responseCounts);
        const data = Object.values(responseCounts);

        const backgroundColors = [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)',
        ];

        return {
            labels,
            datasets: [
                {
                    label: `Responses for "${question}"`,
                    data,
                    backgroundColor: backgroundColors.slice(0, labels.length),
                    borderColor: backgroundColors.map(c => c.replace('0.7', '1')),
                    borderWidth: 1,
                },
            ],
        };
    };

    // Options for charts
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        maintainAspectRatio: false,
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold">Loading survey results...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (responses.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold">No survey responses found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Survey Results Dashboard</h1>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-blue-800">Total Responses</h3>
                            <p className="text-3xl font-bold text-blue-600">{responses.length}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-green-800">First Response</h3>
                            <p className="text-xl font-bold text-green-600">
                                {new Date(responses[responses.length - 1].createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-purple-800">Latest Response</h3>
                            <p className="text-xl font-bold text-purple-600">
                                {new Date(responses[0].createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Single Answer Questions</h2>
                    <div className="space-y-6">
                        {singleAnswerQuestions.map(question => (
                            <div key={question} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <button
                                    onClick={() => toggleChart(question)}
                                    className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    <h3 className="text-lg font-medium">{question}</h3>
                                    {expandedCharts[question] ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                {expandedCharts[question] && (
                                    <div className="p-4">
                                        <div className="h-64">
                                            <Bar data={createChartData(question)} options={chartOptions} />
                                        </div>
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="h-64">
                                                <Pie data={createChartData(question)} options={chartOptions} />
                                            </div>
                                            <div className="h-64">
                                                <Doughnut data={createChartData(question)} options={chartOptions} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Multi-Select Questions</h2>
                    <div className="space-y-6">
                        {multiSelectQuestions.map(question => (
                            <div key={question} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <button
                                    onClick={() => toggleChart(question)}
                                    className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    <h3 className="text-lg font-medium">{question}</h3>
                                    {expandedCharts[question] ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                {expandedCharts[question] && (
                                    <div className="p-4">
                                        <div className="h-96">
                                            <Bar
                                                data={createChartData(question)}
                                                options={{
                                                    ...chartOptions,
                                                    indexAxis: 'y' as const,
                                                }}
                                            />
                                        </div>
                                        <div className="mt-4 h-64">
                                            <Line
                                                data={createChartData(question)}
                                                options={chartOptions}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Raw Response Data</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions Answered</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {responses.map(response => (
                                    <tr key={response.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{response.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(response.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {Object.keys(response.answers).length} questions
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyResultsPage;