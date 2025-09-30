"use client";

import React from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function InputFlowSection() {
  return (
    <section id="workflow" className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700">
              📝 User Input
            </div>

            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Location & Time
              </span>
              <br />
              Weather Dashboard Flow
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Users first provide the city, then choose the date and time. The system then processes the input and displays a personalized probability-based weather result on the dashboard.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">City Input</h4>
                  <p className="text-gray-600">Enter the desired city to get accurate weather predictions.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Date & Time Selection</h4>
                  <p className="text-gray-600">Specify the exact date and time for which you want the weather forecast.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Dashboard Results</h4>
                  <p className="text-gray-600">View probability-based weather data with visualizations and actionable insights.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Animation */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-lg lg:max-w-xl">
              <DotLottieReact
                src="https://lottie.host/fe127d23-1fac-4fb1-bb65-95ce3ca35043/gLw5iBNrQa.lottie"
                loop
                autoplay
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
