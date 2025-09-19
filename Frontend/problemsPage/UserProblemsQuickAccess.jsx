import React from 'react';
import { List, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router';

const UserProblemsQuickAccess = ({ userProblems }) => {
    
  return (
    <div className="bg-white dark:bg-[#232b3b] rounded-lg shadow-lg dark:shadow-xl p-6 border border-[#e2e8f0] dark:border-[#334155]">
      <h3 className="text-xl font-bold text-[#1e293b] dark:text-[#e2e8f0] mb-4 flex items-center">
        <List size={22} className="mr-3 text-[#f97316]" />
        My Problems
      </h3>
      {userProblems ? (
        <div className="space-y-2">
            <NavLink to={`/my-problems/liked`}>
                <button
                className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-[#f8fafc] dark:hover:bg-[#1a2332] group"
                >
                <div className="text-left">
                    <p className="font-semibold text-[#1e293b] dark:text-[#e2e8f0]">
                        Liked
                    </p>
                    <p className="text-sm text-[#475569] dark:text-[#94a3b8]">
                    {userProblems.liked} problems
                    </p>
                </div>
                <ChevronRight
                    size={20}
                    className="text-slate-400 group-hover:translate-x-1 transition-transform"
                />
                </button>
            </NavLink>
             <NavLink to={`/my-problems/favorited`}>
                <button
                className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-[#f8fafc] dark:hover:bg-[#1a2332] group"
                >
                <div className="text-left">
                    <p className="font-semibold text-[#1e293b] dark:text-[#e2e8f0]">
                        Favorited
                    </p>
                    <p className="text-sm text-[#475569] dark:text-[#94a3b8]">
                    {userProblems.favorited} problems
                    </p>
                </div>
                <ChevronRight
                    size={20}
                    className="text-slate-400 group-hover:translate-x-1 transition-transform"
                />
                </button>
            </NavLink>
        </div>
      ) : (
        <p className="text-sm text-center py-4 text-[#475569] dark:text-[#94a3b8]">
          You have no Problems.
        </p>
      )}
    </div>
  );
};

export default UserProblemsQuickAccess;
