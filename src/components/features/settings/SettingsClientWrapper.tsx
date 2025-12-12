"use client";

import { useState } from "react";
import { SecuritySettings } from "@/components/features/settings/SecuritySettings";
import { ProfileSettings } from "./ProfileSettings";
import { User } from "@/lib/types";

interface SettingsClientWrapperProps {
  user: User;
}

export default function SettingsClientWrapper({
  user,
}: SettingsClientWrapperProps) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white shadow-md p-6 rounded-xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="flex gap-6 border-b border-gray-200 mb-6">
          {["profile", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md" />
              )}
            </button>
          ))}
        </div>

        <div className="max-w-2xl">
          {activeTab === "profile" && <ProfileSettings user={user} />}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}
