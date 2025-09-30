// Test file to verify all profile components are working
import React from "react";
import UserInfoCard from "./UserInfoCard";
import AdvancedSolvedStatsChart from "./AdvancedSolvedStatsChart";
import DailySubmissionsChart from "./DailySubmissionsChart";
import MonthlySubmissionsLineChart from "./MonthlySubmissionsLineChart";
import YearlyActivityHeatMap from "./YearlyActivityHeatMap";

// Mock data for testing
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  emailId: "john.doe@example.com",
  profileImageUrl:
    "https://ui-avatars.com/api/?name=John+Doe&background=random",
  createdAt: "2024-01-15T10:00:00Z",
  points: 1250,
  rank: 42,
  streaks: {
    current: 7,
    longest: 15,
  },
  statistics: {
    Easy: 25,
    Medium: 15,
    Hard: 5,
    totalSolved: 45,
    totalProblems: 100,
  },
};

const mockActivityData = [
  { date: "2024-01-01", easyCount: 2, mediumCount: 1, hardCount: 0 },
  { date: "2024-01-02", easyCount: 1, mediumCount: 2, hardCount: 1 },
  { date: "2024-01-03", easyCount: 3, mediumCount: 0, hardCount: 0 },
];

const mockTrendData = [
  { date: "2024-01-01", acceptedCount: 3, totalCount: 5 },
  { date: "2024-01-02", acceptedCount: 4, totalCount: 6 },
  { date: "2024-01-03", acceptedCount: 3, totalCount: 4 },
];

const mockHeatmapData = [
  { date: "2024-01-01", count: 3 },
  { date: "2024-01-02", count: 5 },
  { date: "2024-01-03", count: 2 },
];

// Test component
const ProfileComponentsTest = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Profile Components Test
      </h1>

      {/* UserInfoCard Test */}
      <div className="bg-base-200 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">UserInfoCard Component</h2>
        <UserInfoCard user={mockUser} />
      </div>

      {/* Charts Test */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Daily Submissions Chart
          </h2>
          <DailySubmissionsChart activity={mockActivityData} />
        </div>

        <div className="bg-base-200 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Monthly Submissions Line Chart
          </h2>
          <MonthlySubmissionsLineChart activity={mockTrendData} />
        </div>
      </div>

      {/* Heatmap Test */}
      <div className="bg-base-200 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Yearly Activity Heatmap</h2>
        <YearlyActivityHeatMap
          year={2024}
          activityData={mockHeatmapData}
          onYearChange={(year) => console.log("Year changed:", year)}
          availableYears={[2024, 2023]}
        />
      </div>
    </div>
  );
};

export default ProfileComponentsTest;
