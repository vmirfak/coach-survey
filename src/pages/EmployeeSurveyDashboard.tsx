import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Legend
} from 'recharts';
import {
  Loader2, AlertTriangle,
  BarChart2, List,
  MessageCircle,
  Wrench,
  BarChart3Icon,
  Eye
} from 'lucide-react';

// Type definitions
type Answer = string | string[] | undefined;

interface SurveyResponse {
  id: number;
  answers: {
    [key: string]: Answer;
  };
  createdAt: string;
}

type MetricCounts = {
  [key: string]: number;
};

type TopSkillsData = {
  name: string;
  count: number;
};

type SatisfactionData = {
  name: string;
  value: number;
};

type PainPointsData = {
  name: string;
  count: number;
};

// Color constants
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

export default function EmployeeSurveyDashboard() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'overview' | 'career' | 'tools' | 'communication' | 'details'>('overview');
  const [searchTerm,] = useState<string>('');
  const [filteredResponses, setFilteredResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/surveys");
        if (!response.ok) {
          throw new Error("Failed to fetch survey responses");
        }
        const data = await response.json();
        setResponses(data);
        setFilteredResponses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResponses(responses);
    } else {
      const filtered = responses.filter(response => {
        return Object.entries(response.answers).some(([question, answer]) => {
          if (typeof answer === 'string') {
            return answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
              question.toLowerCase().includes(searchTerm.toLowerCase());
          } else if (Array.isArray(answer)) {
            return answer.some(item => item.toLowerCase().includes(searchTerm.toLowerCase())) ||
              question.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        });
      });
      setFilteredResponses(filtered);
    }
  }, [searchTerm, responses]);

  const countMetrics = (questionKey: string): MetricCounts => {
    const counts: MetricCounts = {};

    responses.forEach(response => {
      const answer = response.answers[questionKey];
      if (typeof answer === 'string') {
        counts[answer] = (counts[answer] || 0) + 1;
      }
    });

    return counts;
  };

  const countArrayResponses = (questionKey: string): MetricCounts => {
    const counts: MetricCounts = {};

    responses.forEach(response => {
      const answers = response.answers[questionKey];
      if (Array.isArray(answers)) {
        answers.forEach(answer => {
          counts[answer] = (counts[answer] || 0) + 1;
        });
      }
    });

    return counts;
  };

  const getOverallSatisfactionData = (): SatisfactionData[] => {
    const satisfactionCounts = countMetrics("Overall, how satisfied are you with your current role?");
    return Object.entries(satisfactionCounts).map(([name, value]) => ({ name, value }));
  };

  const getWorkflowEfficiencyData = (): SatisfactionData[] => {
    const counts = countMetrics("How efficient are your current development workflows?");
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getCareerPathClarityData = (): SatisfactionData[] => {
    const counts = countMetrics("How clear is your career path here?");
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getDesiredSkillsData = (): TopSkillsData[] => {
    const skillCounts = countArrayResponses("What skills would you most like to develop?");
    return Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getDevPainPointsData = (): PainPointsData[] => {
    const painPointsCounts = countArrayResponses("Which areas slow down your development process the most?");
    return Object.entries(painPointsCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getToolsNeedingAttention = (): PainPointsData[] => {
    const toolsCounts = countArrayResponses("Which tools need immediate attention?");
    return Object.entries(toolsCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getTeamCommunicationData = (): SatisfactionData[] => {
    const counts = countMetrics("How would you rate team communication?");
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getLeadershipCommunicationData = (): SatisfactionData[] => {
    const counts = countMetrics("How effective is leadership communication?");
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getCareerGoalsData = (): PainPointsData[] => {
    const goalCounts = countArrayResponses("What is your primary career goal in the next 2-3 years?");
    return Object.entries(goalCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getLeadershipQualitiesData = (): PainPointsData[] => {
    const qualitiesCounts = countArrayResponses("What leadership qualities should we develop?");
    return Object.entries(qualitiesCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getCollaborationAreasData = (): PainPointsData[] => {
    const areaCounts = countArrayResponses("Which collaboration aspects need improvement?");
    return Object.entries(areaCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getRecommendationLikelihoodData = (): SatisfactionData[] => {
    const likelihoodCounts = countMetrics("How likely are you to recommend working here?");
    return Object.entries(likelihoodCounts).map(([name, value]) => ({ name, value }));
  };

  // If loading or error
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Loading survey data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600">Error loading data</h2>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart2 className="mr-2 text-blue-600" />
            Employee Survey Dashboard
          </h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => setView('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center cursor-pointer ${view === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Eye className="mr-2 h-5 w-5" />
              Overview
            </button>
            <button
              onClick={() => setView('career')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center cursor-pointer  ${view === 'career'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <BarChart3Icon className="mr-2 h-5 w-5" />
              Career Growth
            </button>
            <button
              onClick={() => setView('tools')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center cursor-pointer  ${view === 'tools'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Wrench className="mr-2 h-5 w-5" />
              Tools & Workflows
            </button>
            <button
              onClick={() => setView('communication')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center cursor-pointer  ${view === 'communication'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Communication
            </button>
            <button
              onClick={() => setView('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center cursor-pointer  ${view === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <List className="mr-2 h-5 w-5" />
              Raw Data
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Overview Section */}
        {view === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Overall Role Satisfaction */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Overall Role Satisfaction</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getOverallSatisfactionData()}
                        cx="40%"
                        cy="50%"
                        labelLine={false}
                        label={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {getOverallSatisfactionData().map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => {
                          const total = getOverallSatisfactionData().reduce((sum, item) => sum + item.value, 0);
                          const percentage = ((Number(value) / total) * 100).toFixed(0);
                          return [`${percentage}%`, name];
                        }}
                      />
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        formatter={(value, entry) => {
                          const { payload } = entry;
                          const percentage = ((payload?.value / getOverallSatisfactionData().reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0);
                          return <span className="text-sm">{`${value}: ${percentage}%`}</span>;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Workflow Efficiency */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Development Workflow Efficiency</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getWorkflowEfficiencyData()}
                        cx="40%"
                        cy="50%"
                        labelLine={true}
                        label={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        
                        nameKey="name"
                      >
                        {getWorkflowEfficiencyData().map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => {
                          // Get all data points from the payload
                          const allData = props.payload[0]?.payload?.allData || getWorkflowEfficiencyData();
                          const total = allData.reduce((sum: number, item: { value: number }) => sum + item.value, 0);
                          const percentage = ((Number(value) / total) * 100).toFixed(0);
                          return [`${percentage}%`, name];
                        }}
                      />
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        formatter={(value, entry) => {
                          const { payload } = entry;
                          const percentage = ((payload?.value / getWorkflowEfficiencyData().reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0);
                          return <span className="text-sm">{`${value}: ${percentage}%`}</span>;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommendation Likelihood */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Likelihood to Recommend</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getRecommendationLikelihoodData()}
                        cx="40%"
                        cy="50%"
                        labelLine={false}
                        label={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {getRecommendationLikelihoodData().map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => {
                          const total = getRecommendationLikelihoodData().reduce((sum, item) => sum + item.value, 0);
                          const percentage = ((Number(value) / total) * 100).toFixed(0);
                          return [`${percentage}%`, name];
                        }}
                      />
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        formatter={(value, entry) => {
                          const { payload } = entry;
                          const percentage = ((payload?.value / getRecommendationLikelihoodData().reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0);
                          return <span className="text-sm">{`${value}: ${percentage}%`}</span>;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Rest of your component remains the same */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Career Goals */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Primary Career Goals (Next 2-3 Years)</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getCareerGoalsData()}
                      layout="vertical"
                      margin={{ top: 5, right: 5, left: 1, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        tickCount={6}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={200}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip formatter={(value) => [`${value} responses`]} />
                      <Bar
                        dataKey="count"
                        fill="#8884d8"
                        barSize={24}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pain Points */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Development Process Pain Points</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getDevPainPointsData()}
                      layout="vertical"
                      margin={{ top: 5, right: 5, left: 70, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        tickCount={6}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={140}
                        tick={{ width: 200 }}
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip formatter={(value) => [`${value} responses`]} />
                      <Bar
                        dataKey="count"
                        fill="#FF8042"
                        barSize={24}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Dashboard Summary */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Survey Response Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-3xl font-bold text-blue-600">{responses.length}</span>
                  <span className="text-sm text-gray-500 mt-1">Total Responses</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
                  <span className="text-3xl font-bold text-green-600">
                    {Object.keys(countMetrics("Overall, how satisfied are you with your current role?")).filter(key =>
                      key.includes("Satisfied") || key.includes("Extremely Satisfied")).reduce((sum, key) =>
                        sum + countMetrics("Overall, how satisfied are you with your current role?")[key], 0)}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">Satisfied Employees</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg">
                  <span className="text-3xl font-bold text-purple-600">
                    {Object.keys(countMetrics("How likely are you to recommend working here?")).filter(key =>
                      key.includes("likely") || key.includes("Extremely likely")).reduce((sum, key) =>
                        sum + countMetrics("How likely are you to recommend working here?")[key], 0)}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">Would Recommend</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Career Growth Section */}
        {view === 'career' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Career Path Clarity */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Career Path Clarity</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getCareerPathClarityData()}
                        cx="40%"
                        cy="50%"
                        labelLine={false}
                        label={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {getCareerPathClarityData().map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => {
                          const total = getCareerPathClarityData().reduce((sum, item) => sum + item.value, 0);
                          const percentage = ((Number(value) / total) * 100).toFixed(0);
                          return [`${percentage}%`, name];
                        }}
                      />
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        formatter={(value, entry) => {
                          const { payload } = entry;
                          const percentage = ((payload?.value / getCareerPathClarityData().reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0);
                          return <span className="text-sm">{`${value}: ${percentage}%`}</span>;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skills to Develop */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Top Skills Employees Want to Develop</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getDesiredSkillsData()}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 1, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={200} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Leadership Qualities */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Leadership Qualities to Develop</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getLeadershipQualitiesData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                    <Radar name="Leadership Skills" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Career Goals */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Primary Career Goals (Next 2-3 Years)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getCareerGoalsData()}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 1, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={250} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tools & Workflows Section */}
        {view === 'tools' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Workflow Efficiency */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Development Workflow Efficiency</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getWorkflowEfficiencyData()}
                        cx="40%"
                        cy="50%"
                        labelLine={true}
                        label={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {getWorkflowEfficiencyData().map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => {
                          // Get all data points from the payload
                          const allData = props.payload[0]?.payload?.allData || getWorkflowEfficiencyData();
                          const total = allData.reduce((sum: number, item: { value: number }) => sum + item.value, 0);
                          const percentage = ((Number(value) / total) * 100).toFixed(0);
                          return [`${percentage}%`, name];
                        }}
                      />
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        formatter={(value, entry) => {
                          const { payload } = entry;
                          const percentage = ((payload?.value / getWorkflowEfficiencyData().reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0);
                          return <span className="text-sm">{`${value}: ${percentage}%`}</span>;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tools Needing Attention */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Tools Needing Immediate Attention</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getToolsNeedingAttention()}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Development Process Pain Points */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Development Process Pain Points</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getDevPainPointsData()}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 1, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={220} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Communication Section */}
        {view === 'communication' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Team Communication */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Team Communication Rating</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getTeamCommunicationData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getTeamCommunicationData().map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Leadership Communication */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Leadership Communication Effectiveness</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getLeadershipCommunicationData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getLeadershipCommunicationData().map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Collaboration Areas */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Collaboration Areas Needing Improvement</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getCollaborationAreasData()}
                    layout="vertical"
                    margin={{ top: 5, right: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={220} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Communication Channels */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Communication Channels Needing Improvement</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={countArrayResponses("What communication channels need improvement?") ?
                      Object.entries(countArrayResponses("What communication channels need improvement?"))
                        .map(([name, count]) => ({ name, count: count as number }))
                        .sort((a, b) => b.count - a.count) : []}
                    layout="vertical"
                    margin={{ top: 5, right: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={220} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Raw Data Section */}
        {view === 'details' && (
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Raw Survey Responses</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Showing {filteredResponses.length} of {responses.length} total responses
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Satisfaction
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Workflow Efficiency
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Career Path Clarity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredResponses.map((response) => (
                        <tr key={response.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {response.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(response.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {response.answers["Overall, how satisfied are you with your current role?"] || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {response.answers["How efficient are your current development workflows?"] || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {response.answers["How clear is your career path here?"] || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}