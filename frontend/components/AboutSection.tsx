"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#001829" }}
    >
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
                About Our Platform
              </p>
              <h2 className="text-white font-exo text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Weather
                <br />
                <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                  Intelligence
                </span>
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl font-lexend">
                Our platform harnesses the power of NASA's POWER (Prediction of Worldwide Energy Resources) satellite data 
                to provide accurate weather probability analysis. With over 40 years of historical climate data from 1981 to 2025, 
                we help you make informed decisions for outdoor events and activities.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-2">44+ Years of Data</h3>
                  <p className="text-gray-400 text-sm">Historical weather patterns from NASA satellite observations</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-2">Global Coverage</h3>
                  <p className="text-gray-400 text-sm">Worldwide location support with precise coordinate mapping</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-2">5 Key Metrics</h3>
                  <p className="text-gray-400 text-sm">Temperature, precipitation, wind, humidity analysis</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-2">AI Insights</h3>
                  <p className="text-gray-400 text-sm">Smart recommendations for event planning</p>
                </div>
              </div>
            </div>

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
                  <div className="text-white font-bold text-lg">NASA POWER</div>
                  <div className="text-gray-400 text-sm">MERRA-2 Data</div>
                </div>
              </div>
            </div>

          <Link href={'/dashboard'}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium rounded-lg transition-all duration-300 shadow-lg">
              Start Analysis
            </Button>
          </Link>
          </div>

          {/* Right Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative transform rotate-3 hover:rotate-1 transition-all duration-500 ease-out">
              {/* Phone Frame with 3D effect */}
              <div className="w-80 h-[600px] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 rounded-[3rem] p-2 shadow-2xl relative">
                {/* 3D depth effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-white/20 rounded-[3rem]"></div>
                <div className="absolute top-1 left-1 w-full h-full bg-gradient-to-tl from-white/30 to-transparent rounded-[3rem]"></div>
                
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative shadow-inner">
                  {/* Status Bar with depth */}
                  <div className="flex justify-between items-center px-6 py-3 bg-gradient-to-b from-white to-gray-50 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                    <div className="text-black text-sm font-medium relative z-10">9:41 AM</div>
                    <div className="flex space-x-1 relative z-10">
                      <div className="w-4 h-2 bg-gradient-to-b from-gray-800 to-black rounded-sm shadow-sm"></div>
                      <div className="w-4 h-2 bg-gradient-to-b from-gray-800 to-black rounded-sm shadow-sm"></div>
                      <div className="w-4 h-2 bg-gradient-to-b from-gray-400 to-gray-300 rounded-sm shadow-sm"></div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            Weather Probability
                          </div>
                          <div className="text-xs text-white/80">
                            15 September 2025
                          </div>
                        </div>
                      </div>
                      <div className="text-white/90 text-xs font-medium">
                        New York, NY
                      </div>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="p-6 space-y-4">
                    {/* Location Card with 3D effect */}
                    <div className="w-full h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl relative overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-tl from-white/20 via-transparent to-black/10"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                      <div className="absolute top-4 left-4 text-white z-10">
                        <div className="text-xs opacity-90 drop-shadow-sm">Based on 44 years of data</div>
                        <div className="text-lg font-bold mt-1 drop-shadow-md">Weather Analysis</div>
                      </div>
                      <div className="absolute bottom-4 right-4 text-white text-right z-10">
                        <div className="text-xs opacity-90 drop-shadow-sm">Confidence Level</div>
                        <div className="text-lg font-bold drop-shadow-md">94%</div>
                      </div>
                      {/* 3D highlight */}
                      <div className="absolute top-2 left-2 w-16 h-4 bg-gradient-to-r from-white/30 to-transparent rounded-full blur-sm"></div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">Very Hot</div>
                            <div className="text-xs text-gray-500">≥35°C Temperature</div>
                          </div>
                        </div>
                        <div className="text-red-600 font-bold">12.5%</div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">Very Wet</div>
                            <div className="text-xs text-gray-500">≥20mm Precipitation</div>
                          </div>
                        </div>
                        <div className="text-blue-600 font-bold">8.7%</div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">Very Windy</div>
                            <div className="text-xs text-gray-500">≥10m/s Wind Speed</div>
                          </div>
                        </div>
                        <div className="text-gray-600 font-bold">3.2%</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-gray-300 rounded-full"></div>
                </div>
              </div>

              {/* Enhanced 3D Shadow Effects */}
              <div className="absolute top-4 left-4 w-80 h-[600px] bg-black/20 rounded-[3rem] blur-md -z-10 transform translate-x-2 translate-y-2"></div>
              <div className="absolute top-8 left-8 w-80 h-[600px] bg-black/10 rounded-[3rem] blur-lg -z-20 transform translate-x-4 translate-y-4"></div>
              
              {/* Floating Elements with 3D effect */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-bounce"></div>
              <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
              
              {/* 3D Light reflection */}
              <div className="absolute top-20 -left-4 w-2 h-40 bg-gradient-to-b from-white/40 via-white/20 to-transparent rounded-full blur-sm transform -rotate-12"></div>
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
