"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#001829" }}
    >
      {/* Blurred SVG Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg id='visual' viewBox='0 0 900 600' width='900' height='600' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'%3E%3Crect width='900' height='600' fill='%23001829'%3E%3C/rect%3E%3Cg%3E%3Cg transform='translate(869 239)'%3E%3Cpath d='M0 -147L127.3 -73.5L127.3 73.5L0 147L-127.3 73.5L-127.3 -73.5Z' fill='none' stroke='%23297EA6' stroke-width='2'%3E%3C/path%3E%3C/g%3E%3Cg transform='translate(317 262)'%3E%3Cpath d='M0 -107L92.7 -53.5L92.7 53.5L0 107L-92.7 53.5L-92.7 -53.5Z' fill='none' stroke='%23297EA6' stroke-width='2'%3E%3C/path%3E%3C/g%3E%3Cg transform='translate(402 570)'%3E%3Cpath d='M0 -127L110 -63.5L110 63.5L0 127L-110 63.5L-110 -63.5Z' fill='none' stroke='%23297EA6' stroke-width='2'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(6px)",
          zIndex: 0,
        }}
      />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/30 z-10" />
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-600/30 to-transparent z-10" />

      {/* Main Content */}
      <div className="relative z-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-blue-300 text-sm font-medium tracking-wider uppercase">
                Download Our App
              </p>
              <h2 className="text-white font-exo text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Unlock
                <br />
                <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                  the
                </span>
              </h2>
            </div>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl font-lexend">
              platform, powered by NASA Earth observation
              data, revolutionizes the way you plan and execute outdoor events.
              From venue selection to weather forecasting and carbon footprint
              tracking, we provide unparalleled insights to ensure your events
              are seamless, sustainable, and unforgettable.
            </p>

            <div className="flex items-center space-x-4">
              {/* NASA Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                  >
                    <path d="M12 2L3.09 8.26l1.41 1.41L12 4.82l7.5 4.85 1.41-1.41L12 2zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-bold text-lg">Paradox</div>
                  <div className="text-gray-400 text-sm">Powered by Explorex</div>
                </div>
              </div>
            </div>

            <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-8 py-3 text-lg font-medium rounded-lg transition-all duration-300">
              Get the App
            </Button>
          </div>

          {/* Right Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-80 h-[600px] bg-gray-100 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 py-3 bg-white">
                    <div className="text-black text-sm font-medium">9:41 AM</div>
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 bg-black rounded-sm"></div>
                      <div className="w-4 h-2 bg-black rounded-sm"></div>
                      <div className="w-4 h-2 bg-gray-300 rounded-sm"></div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="px-6 py-4 bg-white border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">
                            Weather Forecast
                          </div>
                          <div className="text-xs text-gray-500">
                            NASA Data Analysis
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="p-6 space-y-4">
                    <div className="w-full h-40 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-xs opacity-75">Current Location</div>
                        <div className="text-sm font-medium">Temperature Analysis</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">
                            Extreme Temp
                          </div>
                          <div className="text-xs text-gray-500">
                            Probability analysis for extreme conditions
                          </div>
                        </div>
                        <div className="text-xs text-blue-600 font-medium">85°F</div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">
                            Precipitation
                          </div>
                          <div className="text-xs text-gray-500">
                            Rainfall patterns based on historical data
                          </div>
                        </div>
                        <div className="text-xs text-purple-600 font-medium">23%</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-gray-300 rounded-full"></div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Effect - Right Side Bottom */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] overflow-hidden pointer-events-none z-20">
        <div className="absolute bottom-0 right-0 w-full h-full">
          <div className="absolute bottom-0 right-0 w-[500px] h-[350px] bg-gradient-to-tl from-purple-600/30 via-pink-500/25 to-blue-500/20 rounded-full blur-3xl transform rotate-12 translate-x-32 translate-y-16"></div>
          <div className="absolute bottom-10 right-20 w-[400px] h-[280px] bg-gradient-to-tr from-pink-500/25 via-purple-400/20 to-indigo-500/15 rounded-full blur-2xl transform -rotate-6 translate-x-20 translate-y-8"></div>
          <div className="absolute bottom-20 right-10 w-[350px] h-[220px] bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-400/10 rounded-full blur-xl transform rotate-3 translate-x-10"></div>
          <div className="absolute bottom-32 right-40 w-[200px] h-[150px] bg-gradient-to-tl from-purple-400/15 to-pink-300/10 rounded-full blur-lg transform rotate-45 translate-x-8 translate-y-4"></div>
          <div className="absolute bottom-24 right-32 w-[180px] h-[120px] bg-gradient-to-r from-white/5 to-blue-200/8 rounded-full blur-md transform -rotate-12"></div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-1/4 left-8 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
      <div
        className="absolute top-1/3 right-16 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-white rounded-full opacity-50 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-blue-300 rounded-full opacity-70 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>
    </section>
  );
}
