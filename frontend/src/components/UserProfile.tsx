import { useState } from "react";
import { User, Crown, Palette, LogOut } from "lucide-react";

export function UserProfile({ onLogout }: { onLogout: () => void }) {
  const [userType] = useState<"student" | "lecturer">("student");
  const [theme, setTheme] = useState("dark-gold");

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">User Profile</h2>
          <p className="text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-6 py-3 bg-[#1f2236] border border-[#ffc800] text-[#ffc800] rounded-lg hover:bg-[#ffc800] hover:text-[#23273d] transition-all font-semibold cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 bg-[#ffc800]/10 rounded-full flex items-center justify-center border-2 border-[#ffc800]">
                <User className="w-12 h-12 text-[#ffc800]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Jane Doe</h3>
                <p className="text-sm text-gray-400">jane.doe@example.com</p>
              </div>
              <div className="inline-block px-4 py-2 bg-[#ffc800]/10 border border-[#ffc800]/30 rounded-full">
                <span className="text-xs text-[#ffc800] uppercase tracking-wider font-semibold">
                  {userType === "student" ? "Student" : "Lecturer"}
                </span>
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-[#1f2236] border border-[#ffc800] text-[#ffc800] rounded-lg hover:bg-[#ffc800] hover:text-[#23273d] transition-all font-semibold cursor-pointer">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-[#ffc800]" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Jane Doe"
                  className="w-full px-4 py-3 bg-[#23273d] border border-[#ffc800]/50 rounded-lg text-white focus:border-[#ffc800] focus:ring-2 focus:ring-[#ffc800]/30 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="jane.doe@example.com"
                  className="w-full px-4 py-3 bg-[#23273d] border border-[#ffc800]/50 rounded-lg text-white focus:border-[#ffc800] focus:ring-2 focus:ring-[#ffc800]/30 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  Phone
                </label>
                <input
                  type="tel"
                  defaultValue="+1 234 567 8900"
                  className="w-full px-4 py-3 bg-[#23273d] border border-[#ffc800]/50 rounded-lg text-white focus:border-[#ffc800] focus:ring-2 focus:ring-[#ffc800]/30 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  University
                </label>
                <input
                  type="text"
                  defaultValue="ABC University"
                  className="w-full px-4 py-3 bg-[#23273d] border border-[#ffc800]/50 rounded-lg text-white focus:border-[#ffc800] focus:ring-2 focus:ring-[#ffc800]/30 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Plan Information */}
          <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#ffc800]" />
              Subscription Plan
            </h3>
            <div className="flex items-center justify-between p-4 bg-[#23273d] border border-[#ffc800]/30 rounded-lg">
              <div>
                <p className="font-semibold text-white">Pro Plan</p>
                <p className="text-sm text-gray-400">
                  Unlimited simulations & AI assistance
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#ffc800]">$9.99</p>
                <p className="text-xs text-gray-400">per month</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#23273d] rounded-lg">
                <p className="text-xs text-gray-400">Valid Until</p>
                <p className="text-white font-semibold">June 5, 2026</p>
              </div>
              <div className="p-3 bg-[#23273d] rounded-lg">
                <p className="text-xs text-gray-400">Simulations Used</p>
                <p className="text-white font-semibold">247 / Unlimited</p>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-[#ffc800] text-[#23273d] rounded-lg font-semibold hover:bg-[#ffc800]/90 transition-all cursor-pointer">
              Upgrade Plan
            </button>
          </div>

          {/* Personalization */}
          <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#ffc800]" />
              Personalization
            </h3>
            <div className="space-y-3">
              <label className="text-sm text-gray-400">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme("dark-gold")}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    theme === "dark-gold"
                      ? "border-[#ffc800] bg-[#ffc800]/10"
                      : "border-[#ffc800]/30 bg-[#23273d]"
                  }`}
                >
                  <div className="flex gap-2 justify-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-[#23273d]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#ffc800]"></div>
                  </div>
                  <p className="text-xs text-white">Dark Gold</p>
                </button>
                <button
                  onClick={() => setTheme("dark-blue")}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    theme === "dark-blue"
                      ? "border-[#ffc800] bg-[#ffc800]/10"
                      : "border-[#ffc800]/30 bg-[#23273d]"
                  }`}
                >
                  <div className="flex gap-2 justify-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-[#23273d]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#598bff]"></div>
                  </div>
                  <p className="text-xs text-white">Dark Blue</p>
                </button>
                <button
                  onClick={() => setTheme("dark-purple")}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    theme === "dark-purple"
                      ? "border-[#ffc800] bg-[#ffc800]/10"
                      : "border-[#ffc800]/30 bg-[#23273d]"
                  }`}
                >
                  <div className="flex gap-2 justify-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-[#23273d]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#a855f7]"></div>
                  </div>
                  <p className="text-xs text-white">Dark Purple</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
