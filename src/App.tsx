// App.tsx
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import DeveloperFeedbackSurvey from "./pages/DeveloperFeedbackSurvey";
import { Responses } from "./types/types";
import SurveyResultsPage from "./pages/SurveyResultsPage";
import EmployeeSurveyDashboard from "./pages/EmployeeSurveyDashboard";

export default function App() {
  const [, setSurveyResponses] = useState<Responses>({});

  return (
    <div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/dashboardv2"
              className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Dashboard V2.0
            </Link>
            <Link
              to="/dashboardv3"
              className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Dashboard V3.0
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <DeveloperFeedbackSurvey
              setSurveyResponses={setSurveyResponses}
            />
          }
        />
        <Route
          path="/dashboardv1"
          element={
            <SurveyResultsPage
            />
          }
        />
        <Route
          path="/dashboardv2"
          element={
            <SurveyResultsPage
            />
          }
        />
        <Route
          path="/dashboardv3"
          element={
            <EmployeeSurveyDashboard
            />
          }
        />
      </Routes>
    </div>
  );
}