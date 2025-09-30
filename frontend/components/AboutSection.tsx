"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

type CardType = {
  title: string;
  description: string;
  src: string;
};

const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: CardType;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-lg relative overflow-hidden w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 transition-all duration-300 cursor-pointer",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )}
    >
      <img
        src={card.src}
        alt={card.title}
        className="object-cover w-full h-full absolute inset-0"
      />
      <div
        className={cn(
          "absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col justify-center items-center text-center p-3 sm:p-4 lg:p-6 transition-all duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white mb-1 sm:mb-2 lg:mb-3">{card.title}</h3>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed">{card.description}</p>
      </div>
    </div>
  )
);

Card.displayName = "Card";

export function AboutSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  const cards: CardType[] = [
    {
      title: "Extreme Temperature",
      description: "See probabilities for very hot or very cold conditions using NASA historical data.",
      src: "https://plus.unsplash.com/premium_photo-1681488438358-2f7872440e18?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Precipitation Patterns",
      description: "Understand rainfall chances for your outdoor events months in advance.",
      src: "https://images.unsplash.com/photo-1696570352412-32e6e9e626ce?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Wind & Weather",
      description: "Get insights on wind speed and weather extremes at your chosen location.",
      src: "https://images.unsplash.com/photo-1705077689363-76d4424a13c7?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Sun & Cloud Cover",
      description: "Visualize sunlight and cloud cover trends to plan safe and enjoyable outdoor activities.",
      src: "https://plus.unsplash.com/premium_photo-1681488273126-034082703c2f?w=600&auto=format&fit=crop&q=60"
    },
    {
      title: "Data Downloads",
      description: "Download CSV or JSON files to analyze weather patterns for your own projects.",
      src: "https://plus.unsplash.com/premium_photo-1683141114059-aaeaf635dc05?w=600&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <>
    <section
      id="about"
      className="relative bg-[#0B1E3F] text-[#F5F5F5] py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col items-center justify-center"
    >
      <div className="max-w-4xl text-center mb-8 sm:mb-10 lg:mb-12 xl:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-exo font-bold mb-3 sm:mb-4 lg:mb-6">
          About NASA Weather Probability App
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-lexend leading-relaxed px-2 sm:px-4 lg:px-0">
          Plan your outdoor events with probability-based weather insights using NASA historical data. Hover over each feature below to learn more!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl w-full">
        {cards.map((card, index) => (
          <Card
            key={card.title}
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
      </div>

    </section>
   </>
  );
}
