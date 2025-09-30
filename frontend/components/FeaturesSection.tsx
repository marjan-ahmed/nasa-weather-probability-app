"use client";

import React from "react";
import ElectricBorder from "./ElectricBorder"; // Adjust path accordingly

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-exo font-bold text-4xl sm:text-5xl text-center mb-6 text-sky-blue">
          Mission Capabilities
        </h2>
        <p className="font-inter text-lg sm:text-xl text-center text-slate-800 mb-20">
          Advanced features powered by NASA's Earth observation network
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1 */}
          <ElectricBorder
            color="#5793fa"
            speed={1}
            chaos={0.5}
            thickness={2}
            style={{ borderRadius: 16 }}
          >
            <div className="relative p-6 rounded-2xl min-h-[350px] sm:min-h-[380px] md:min-h-[400px] w-full sm:w-80 mx-auto shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col">
              <div className="mb-4">
                <span className="text-xs px-3 py-1 bg-[#0B1E3F]/80 inline-block rounded-full font-lexend font-extralight text-white">
                  FEATURED
                </span>
              </div>
              <h3 className="font-exo text-[#0B1E3F] font-bold text-xl sm:text-2xl mb-4">
                Personalized Dashboard
              </h3>
              <p className="font-lexend text-sm sm:text-[15px] font-light text-slate-800 leading-relaxed flex-grow">
                Interactive visualizations of weather patterns, probability forecasts,
                and historical data tailored to your location and event type.
              </p>
            </div>
          </ElectricBorder>

          {/* Feature 2 */}
          <ElectricBorder
            color="#5793fa"
            speed={1}
            chaos={0.5}
            thickness={2}
            style={{ borderRadius: 16 }}
          >
            <div className="relative p-6 rounded-2xl min-h-[350px] sm:min-h-[380px] md:min-h-[400px] w-full sm:w-80 mx-auto shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col">
              <div className="mb-4">
                <span className="text-xs px-3 py-1 bg-[#0B1E3F]/80 inline-block rounded-full font-lexend font-extralight text-white">
                  FEATURED
                </span>
              </div>
              <h3 className="font-exo text-[#0B1E3F] font-bold text-xl sm:text-2xl mb-4">
                Probability-based Insights
              </h3>
              <p className="font-lexend text-sm sm:text-[15px] font-light text-slate-800 leading-relaxed flex-grow">
                Move beyond simple yes/no forecasts. Get nuanced probability assessments
                that help you make informed risk-based decisions.
              </p>
            </div>
          </ElectricBorder>

          {/* Feature 3 */}
          <ElectricBorder
            color="#5793fa"
            speed={1}
            chaos={0.5}
            thickness={2}
            style={{ borderRadius: 16 }}
          >
            <div className="relative p-6 rounded-2xl min-h-[350px] sm:min-h-[380px] md:min-h-[400px] w-full sm:w-80 mx-auto shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col">
              <div className="mb-4">
                <span className="text-xs px-3 py-1 bg-[#0B1E3F]/80 inline-block rounded-full font-lexend font-extralight text-white">
                  FEATURED
                </span>
              </div>
              <h3 className="font-exo text-[#0B1E3F] font-bold text-xl sm:text-2xl mb-4">
                AI Chatbot Guidance
              </h3>
              <p className="font-lexend text-sm sm:text-[15px] font-light text-slate-800 leading-relaxed flex-grow">
                Conversational AI trained on NASA data to answer your specific questions
                and provide personalized event planning recommendations.
              </p>
            </div>
          </ElectricBorder>
        </div>
      </div>
    </section>
  );
}
