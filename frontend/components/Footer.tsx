'use client';

import { FaGithub } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Left */}
        <div className="flex items-center rounded-full gap-3">
          <div className="relative w-10 h-10">
            <Image
              src="/image.png"
              alt="NASA Logo"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <p className="font-lexend text-sm">
            Team ExploreX • NASA Space Apps Karachi 2025
          </p>
        </div>

        {/* Right */}
        <div className="flex gap-4">
          <Link
            href="https://github.com/marjan-ahmed/nasa-weather-probability-app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors"
          >
            <FaGithub size={20} /> GitHub
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Team ExploreX. All rights reserved.
      </div>
    </footer>
  );
}
