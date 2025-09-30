'use client';

const steps = [
  { icon: '📍', title: 'Input Location & Date' },
  { icon: '🛰️', title: 'NASA Data Analysis' },
  { icon: '📊🤖', title: 'Get Insights + Dashboard + AI Chat' },
];

export default function HowItWorksSection() {
  return (
    <section id="workflow" className="bg-gradient-to-br from-[#0B1E3F] to-[#102347] py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="font-exo text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5F5F5] mb-12">
          How It Works
        </h2>

        {/* Steps */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full md:w-64 hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <p className="font-lexend text-[#F5F5F5]">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
