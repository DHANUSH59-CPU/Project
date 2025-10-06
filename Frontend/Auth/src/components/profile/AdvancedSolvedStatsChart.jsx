import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
  PolarAngleAxis,
  Label,
} from "recharts";

const ProgressBar = ({ label, solved, total }) => {
  const percentage = total > 0 ? (solved / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-base-content">{label}</span>
        <span className="text-sm font-medium text-base-content/70">
          {solved} / {total}
        </span>
      </div>
      <div className="w-full bg-base-300 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={solved}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${label} progress`}
        ></div>
      </div>
    </div>
  );
};

const AdvancedSolvedStatsChart = ({ solvedStats }) => {
  const {
    Easy = 0,
    Medium = 0,
    Hard = 0,
    totalSolved = 0,
    totalProblems = 0,
  } = solvedStats || {};

  const chartData = [
    {
      name: "Hard",
      uv: Hard,
      pv: 100,
      fill: "#F44336",
      displayName: `Hard: ${Hard}`,
    },
    {
      name: "Medium",
      uv: Medium,
      pv: 100,
      fill: "#FFC107",
      displayName: `Medium: ${Medium}`,
    },
    {
      name: "Easy",
      uv: Easy,
      pv: 100,
      fill: "#4CAF50",
      displayName: `Easy: ${Easy}`,
    },
  ];

  const overallPercentage =
    totalProblems > 0
      ? ((totalSolved / totalProblems) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="35%"
            outerRadius="90%"
            barSize={15}
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar dataKey="uv" angleAxisId={0} background />
            <Label
              content={({ viewBox }) => {
                if (
                  viewBox &&
                  "cx" in viewBox &&
                  "cy" in viewBox &&
                  viewBox.cx != null &&
                  viewBox.cy != null
                ) {
                  const { cx, cy } = viewBox;
                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={cx}
                        dy="-0.4em"
                        className="text-2xl sm:text-3xl font-bold text-base-content"
                      >
                        {overallPercentage}%
                      </tspan>
                      <tspan
                        x={cx}
                        dy="1.5em"
                        className="text-xs sm:text-sm text-base-content/70"
                      >
                        {totalSolved} / {totalProblems} Solved
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
            <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: "12px", marginTop: "10px" }}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>
                  {entry?.payload?.displayName ?? value}
                </span>
              )}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                color: "#334155",
                border: "1px solid #E2E8F0",
                borderRadius: "0.375rem",
              }}
              formatter={(value, name) => [`${value}`, name]}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-4 border-t border-base-300">
        <div className="max-w-sm mx-auto">
          <h4 className="text-md font-semibold mb-3 text-center text-base-content">
            Overall Progress
          </h4>
          <ProgressBar
            label="Total Solved"
            solved={totalSolved}
            total={totalProblems}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedSolvedStatsChart;
