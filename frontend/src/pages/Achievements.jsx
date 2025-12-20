import { useState } from "react";
import { achievements } from "../data/achievements";
import AchievementCard from "../components/AchievementCard";
import AchievementDetails from "../components/AchievementDetails";

export default function Achievements() {
  const [active, setActive] = useState(null);

  return (
    <section className="px-8 md:px-16 py-20 text-white relative">
      {/* Heading */}
      <h1 className="text-4xl font-bold">Our Achievements</h1>
      <div className="w-16 h-1 bg-[#0078D4] mt-3 mb-6" />
      <p className="text-gray-300 mb-16">
        A timeline of our milestones and accomplishments
      </p>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-[#50C8DC]/40" />

        <div className="space-y-24">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`flex ${
                item.side === "left" ? "justify-start" : "justify-end"
              }`}
            >
              <div className="w-[45%]">
                <AchievementCard
                  item={item}
                  isActive={active?.id === item.id}
                  onClick={() =>
                    setActive(active?.id === item.id ? null : item)
                  }
                />

                {/* DETAILS POP */}
                {active?.id === item.id && (
                  <div className="mt-6">
                    <AchievementDetails item={item} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
