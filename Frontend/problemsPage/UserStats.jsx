import { CheckCircle, Target, BarChart2, BrainCircuit, Dumbbell, Signal } from 'lucide-react';

const ProgressBarStat = ({ value, total, colorClass, title, icon, onDifficultyChange }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <button
      onClick={() => onDifficultyChange(title)}
      className="w-full text-left p-3 rounded-lg group hover:bg-[#f8fafc] hover:dark:bg-[#1a2332]"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <div className="mr-2">{icon}</div>
          <span className="font-semibold text-sm text-[#1e293b] dark:text-[#e2e8f0]">
            {title}
          </span>
        </div>
        <span className="text-xs font-mono text-[#475569] dark:text-[#94a3b8]">
          {value}/{total}
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-[#151c28] rounded-full h-2">
        <div
          className={`${colorClass} h-2 rounded-full transition-width duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </button>
  );
};

const UserStats = ({ stats, onStatusChange, onDifficultyChange }) => {

  return (
    <div className="bg-white dark:bg-[#232b3b] rounded-lg shadow-lg dark:shadow-xl p-6 border border-[#e2e8f0] dark:border-[#334155]">
      <h3 className="text-xl font-bold text-[#1e293b] dark:text-[#e2e8f0] mb-4 flex items-center">
        <BarChart2 size={22} className="mr-3 text-[#f97316]" />
        My Stats
      </h3>

      <div className="text-center mb-6">
        <p className="text-sm text-[#475569] dark:text-[#94a3b8]">Total Solved</p>
        <p className="text-5xl font-extrabold text-[#1e293b] dark:text-[#e2e8f0]">
          {stats.solved}
          <span className="text-2xl font-medium text-[#475569] dark:text-[#94a3b8]">
            /{stats.total}
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => onStatusChange('Solved')}
          className="w-full flex justify-between items-center p-3 rounded-lg bg-[#f8fafc] dark:bg-[#1a2332] group"
        >
          <div className="flex items-center">
            <CheckCircle size={20} className="mr-3 text-green-500" />
            <span className="font-semibold text-[#1e293b] dark:text-[#e2e8f0] group-hover:text-orange-500 group-hover:dark:text-orange-400">
              Solved
            </span>
          </div>
          <span className="font-bold text-[#1e293b] dark:text-[#e2e8f0] group-hover:text-orange-500 group-hover:dark:text-orange-400">
            {stats.solved}
          </span>
        </button>

        <button
          onClick={() => onStatusChange('Attempted')}
          className="w-full flex justify-between items-center p-3 rounded-lg bg-[#f8fafc] dark:bg-[#1a2332] group"
        >
          <div className="flex items-center">
            <Target size={20} className="mr-3 text-yellow-500" />
            <span className="font-semibold text-[#1e293b] dark:text-[#e2e8f0] group-hover:text-orange-500 group-hover:dark:text-orange-400">
              Attempted
            </span>
          </div>
          <span className="font-bold text-[#1e293b] dark:text-[#e2e8f0] group-hover:text-orange-500 group-hover:dark:text-orange-400">
            {stats.attempted}
          </span>
        </button>
      </div>

      <div className="my-4 border-t border-[#e2e8f0] dark:border-[#334155]"></div>

      <h4 className="font-semibold text-[#1e293b] dark:text-[#e2e8f0] mb-3">
        Difficulty Breakdown
      </h4>
      <div className="space-y-3">
        <ProgressBarStat
          title="Easy"
          icon={<Signal size={16} className="text-green-500" />}
          value={stats.solvedByDifficulty.Easy}
          total={stats.totalByDifficulty.Easy}
          onDifficultyChange={onDifficultyChange}
          colorClass="bg-green-500"
        />
        <ProgressBarStat
          title="Medium"
          icon={<Dumbbell size={16} className="text-yellow-500" />}
          value={stats.solvedByDifficulty.Medium}
          total={stats.totalByDifficulty.Medium}
          onDifficultyChange={onDifficultyChange}
          colorClass="bg-yellow-500"
        />
        <ProgressBarStat
          title="Hard"
          icon={<BrainCircuit size={16} className="text-red-500" />}
          value={stats.solvedByDifficulty.Hard}
          total={stats.totalByDifficulty.Hard}
          onDifficultyChange={onDifficultyChange}
          colorClass="bg-red-500"
        />
      </div>
    </div>
  );
};

export default UserStats;
