'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Dashboard() {
  return (
    <div className="min-h-screen" data-barba="container" data-barba-namespace="dashboard">
      <Header />
      <main className="relative min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-4 pt-20">
        <div className="mx-auto max-w-6xl py-12">
          <div className="text-center space-y-8">
            <h1 className="font-exo text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
              Weather Probability Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your location and event date to get detailed weather probability analysis using NASA Earth observation data.
            </p>
            
            {/* Dashboard Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Weather Analysis Tool</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input 
                    type="text" 
                    placeholder="Enter city or coordinates"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Event Date</label>
                  <input 
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300">
                Analyze Weather Probabilities
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
