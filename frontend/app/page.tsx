  'use client';

  import React from 'react';
  import { DotLottieReact } from '@lottiefiles/dotlottie-react';
  import Header from '@/components/Header';
  import { Button } from '@/components/ui/button';
  import { AboutSection } from '@/components/AboutSection'; 
  import HowItWorksSection from '@/components/HowItWorksSection';
  import Footer from '@/components/Footer';
  import { FeaturesSection } from '@/components/FeaturesSection';
  import { InputFlowSection } from '@/components/InputFlowSection';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import Link from 'next/link';

  const LottieAnimation = () => {
    return (
      <div className="flex justify-center items-center w-full">
        <div
          className="
            w-[110%] h-[110%]
            sm:w-[120%] sm:h-[120%] 
          "
        >
          <DotLottieReact
            src="https://lottie.host/84ce8bb0-7ce5-45f8-9ee3-e2a3ce995aca/YRf0ADz7Fs.lottie"
            loop
            autoplay
          />
        </div>
      </div>
    );
  };

const hero_paragraph = `
Plan outdoor events with confidence using NASA Earth observation data. Get historical weather probabilities for any location and date—from extreme heat and rainfall to wind conditions and air quality—months in advance.
`;

  // 🔹 Home Page
  export default function Home() {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <Header />
        
        {/* Hero Section */}
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 px-4 pt-20 sm:pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-12">
          {/* Left Content */}
          <div className="relative z-10 space-y-8">
            <div className="space-y-6">
              <h1 className="font-exo text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-blue-800 to-green-600 bg-clip-text text-transparent">
                     Plan Smarter
                </span>
                <br />
                <span className="text-gray-900">
                      With Weather Data
                </span>
              </h1>
              
               <TextGenerateEffect words={hero_paragraph} /> 
            </div>

            <div className="flex font-lexend flex-col sm:flex-row gap-4">
              <Button className='py-6 px-6'>
                Check Weather Probabilities
              </Button>
              <Button variant={'outline'} className="py-6 px-6">
                <Link href={'#workflow'}>
                Learn How It Works
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Lottie Animation */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="w-full max-w-2xl lg:max-w-6xl xl:max-w-7xl">
              <LottieAnimation />
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute top-1/4 left-4 w-20 h-20 bg-gradient-to-br from-blue-200/40 to-green-200/40 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/3 right-8 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-gradient-to-br from-green-200/35 to-blue-200/35 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
    </section>


        {/* Features Preview */}
        <AboutSection />
        {/* Global Weather Monitoring Section */}
        <FeaturesSection />

        <InputFlowSection />
        {/* <div className="mt-20 mb-20"> */}

        {/* </div> */}
        {/* <HowItWorksSection /> */}
        <Footer />
      </div>
    );
  }
