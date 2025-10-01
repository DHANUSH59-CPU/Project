import { useState } from "react";
import { useParams } from "react-router-dom";
import UserSocialData from "../components/UserSocialData";
import { Heart, Bookmark } from "lucide-react";

const SocialDataPage = () => {
  const { type } = useParams();
  const [activeTab, setActiveTab] = useState(type || "liked");

  const tabs = [
    { id: "liked", label: "Liked Problems", icon: Heart },
    { id: "favorites", label: "Favorite Problems", icon: Bookmark },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            My Social Data
          </h1>
          <p className="text-base-content/70">
            Manage your liked and favorite problems
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-base-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-content shadow-sm"
                      : "text-base-content/70 hover:text-base-content hover:bg-base-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <UserSocialData type={activeTab} />
      </div>
    </div>
  );
};

export default SocialDataPage;
