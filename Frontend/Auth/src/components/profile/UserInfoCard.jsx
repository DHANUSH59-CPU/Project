import { Trophy, Star, Flame, Calendar } from "lucide-react";
import AdvancedSolvedStatsChart from "./AdvancedSolvedStatsChart";

const UserInfoCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="bg-base-100 shadow-lg rounded-lg p-6 space-y-6">
      {/* User Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-4 sm:space-y-0">
        {/* Avatar */}
        <div className="flex-shrink-0 flex justify-center sm:justify-start relative">
          <img
            src={
              user.profileImageUrl ||
              `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
            }
            alt={user.firstName}
            className="w-28 h-28 rounded-full border-2 border-primary shadow-md object-cover"
          />
          {/* Divider */}
          <div className="hidden sm:block absolute top-0 -right-4 h-full w-px bg-base-300"></div>
        </div>

        {/* User Details */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
          {/* Main Name Info */}
          <div>
            <h2 className="text-3xl font-bold text-base-content break-all">
              {user.firstName} {user.lastName}
            </h2>
            {user.emailId && (
              <h3 className="text-lg font-medium text-base-content/70 break-all">
                {user.emailId}
              </h3>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex flex-col items-center sm:items-start bg-base-200 rounded-md px-3 py-2 space-y-1 w-fit">
            <div className="flex items-center text-sm text-base-content/70">
              <span className="font-medium mr-1">📧</span>
              <span className="break-all">{user.emailId}</span>
            </div>
            <div className="flex items-center text-sm text-base-content/70">
              <Calendar className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>
                Joined on {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ranking & Points */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-base-content">
          Ranking, Points & Connections
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <div className="bg-base-200 p-3 rounded-md text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start mb-0.5">
              <Trophy className="w-4 h-4 mr-1.5 text-warning" />
              <p className="text-sm text-base-content/70">Rank</p>
            </div>
            <p className="font-semibold text-xl text-primary">
              #{user.rank || "N/A"}
            </p>
          </div>
          <div className="bg-base-200 p-3 rounded-md text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start mb-0.5">
              <Star className="w-4 h-4 mr-1.5 text-warning" />
              <p className="text-sm text-base-content/70">Coding Points</p>
            </div>
            <p className="font-semibold text-xl text-primary">
              {user.points?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Streaks */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-base-content">
          Streaks
        </h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-base-200 p-3 rounded-md">
            <div className="flex items-center justify-center text-primary">
              <Flame className="w-6 h-6 mr-2" />
              <p className="text-2xl font-bold">{user.streaks?.current || 0}</p>
            </div>
            <p className="text-xs text-base-content/70">Current Streak</p>
          </div>
          <div className="bg-base-200 p-3 rounded-md">
            <div className="flex items-center justify-center text-primary">
              <Flame className="w-6 h-6 mr-2" />
              <p className="text-2xl font-bold">{user.streaks?.longest || 0}</p>
            </div>
            <p className="text-xs text-base-content/70">Longest Streak</p>
          </div>
        </div>
      </div>

      {/* Problems Solved */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-base-content">
          Problems Solved
        </h3>
        <AdvancedSolvedStatsChart solvedStats={user.statistics} />
      </div>

      {/* Achievements */}
      {user.streaks?.longest > 10 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-base-content">
            Achievements
          </h3>
          <div className="space-y-3">
            <div className="flex items-center bg-base-200 p-3 rounded-md shadow-sm">
              <Trophy
                size={20}
                className="w-8 h-8 text-warning mr-3 flex-shrink-0"
              />
              <div>
                <h4 className="font-semibold text-sm text-base-content">
                  Streak Breaker
                </h4>
                <p className="text-xs text-base-content/70">{`${user.streaks.longest} days of consistent efforts`}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfoCard;
