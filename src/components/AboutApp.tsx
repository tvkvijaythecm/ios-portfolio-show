import { useState } from "react";
import { Star, MapPin, MessageCircle, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import aboutIcon from "@/assets/about-icon.png";

const AboutApp = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "reviews">("profile");

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-background rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Profile Header */}
        <div className="pt-12 pb-6 px-6 text-center bg-gradient-to-b from-muted/30 to-background">
          <div className="relative inline-block">
            <img
              src={aboutIcon}
              alt="Profile"
              className="w-32 h-32 rounded-3xl object-cover mx-auto shadow-lg"
            />
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-6 mb-2 text-foreground">
            Suresh Kumar
          </h2>

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-semibold text-foreground">4.8</span>
            <span className="text-sm">(617)</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-6 mt-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 rounded-full font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 py-3 rounded-full font-semibold transition-all ${
              activeTab === "reviews"
                ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            Reviews
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {activeTab === "profile" ? (
            <div className="space-y-6">
              {/* About Section */}
              <div className="bg-muted/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-foreground">About</h3>
                <div className="relative">
                  <span className="text-5xl text-muted-foreground/20 absolute -top-2 -left-1">"</span>
                  <p className="text-muted-foreground leading-relaxed pl-6">
                    I love to travel, am from Transylvania (sort of), I really like peanut butter, I spend most of my time producing movies.
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lives in</p>
                    <p className="font-semibold text-foreground">NY, USA</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Speaks</p>
                    <p className="font-semibold text-foreground">Deutsch, English, Italiano</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Work</p>
                    <p className="font-semibold text-foreground">United Nations, HBO</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground py-8">
                No reviews yet
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutApp;
