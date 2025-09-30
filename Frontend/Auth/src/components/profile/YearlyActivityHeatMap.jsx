import { useMemo } from "react";

const HEATMAP_COLORS = [
  "bg-base-200",
  "bg-green-200",
  "bg-green-400",
  "bg-green-600",
  "bg-green-800",
];

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const YearlyActivityHeatMap = ({
  year,
  activityData = [],
  onYearChange,
  availableYears = [],
}) => {
  const submissionsMap = useMemo(() => {
    const map = new Map();
    activityData.forEach((item) => {
      map.set(item.date, item.count);
    });
    return map;
  }, [activityData]);

  const totalSubmissionsInYear = useMemo(() => {
    return activityData.reduce((sum, item) => sum + item.count, 0);
  }, [activityData]);

  const getColorForCount = (count) => {
    if (count === undefined || count === 0) return HEATMAP_COLORS[0];
    if (count <= 2) return HEATMAP_COLORS[1];
    if (count <= 5) return HEATMAP_COLORS[2];
    if (count <= 9) return HEATMAP_COLORS[3];
    return HEATMAP_COLORS[4];
  };

  const getMonthlyGrids = () => {
    const monthlyData = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthName = MONTH_NAMES[monthIndex];
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();

      const monthCells = [];

      for (let i = 0; i < firstDayOfMonth; i++) {
        monthCells.push(
          <div
            key={`pad-${monthIndex}-${i}`}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
          ></div>
        );
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, monthIndex, day);
        const dateStr = currentDate.toISOString().split("T")[0];
        const count = submissionsMap.get(dateStr);
        const colorClass = getColorForCount(count);
        monthCells.push(
          <div
            key={dateStr}
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${colorClass} rounded-sm border border-base-300`}
            title={`${currentDate.toLocaleDateString("en-CA")}: ${
              count || 0
            } submissions`}
          ></div>
        );
      }

      monthlyData.push({ monthName, cells: monthCells });
    }

    return monthlyData;
  };

  const monthlyGrids = getMonthlyGrids();

  return (
    <div className="bg-base-100 shadow-lg rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-base-content">
            {totalSubmissionsInYear} submissions in {year}
          </h3>
        </div>
        {availableYears.length > 0 && (
          <select
            value={year}
            onChange={(e) =>
              onYearChange && onYearChange(parseInt(e.target.value))
            }
            className="mt-2 sm:mt-0 bg-base-200 border border-base-300 text-base-content text-sm rounded-md p-1.5 focus:ring-primary focus:border-primary"
            aria-label="Select year for heatmap"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y === new Date().getFullYear() ? "Current Year" : y}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-3 sm:space-x-4">
          {monthlyGrids.map(({ monthName, cells }) => (
            <div key={monthName} className="flex-shrink-0">
              <h4 className="text-xs font-medium text-center text-base-content/70 mb-1.5 sm:mb-2">
                {monthName}
              </h4>
              <div className="grid grid-cols-7 gap-0.5 sm:gap-1">{cells}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-start items-center space-x-2 text-xs text-base-content/70">
        <span>Less</span>
        {HEATMAP_COLORS.map((color, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${color} rounded-sm border border-base-300`}
          ></div>
        ))}
        <span>More</span>
      </div>
      <div className="text-xs text-base-content/50 mt-2">
        Tip: Hover over a square to see the submission count for that day.
      </div>
    </div>
  );
};

export default YearlyActivityHeatMap;
