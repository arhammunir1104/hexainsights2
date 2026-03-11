import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HomepageHero = ({ data }) => { 
  if (!data) return null;

  const { title, description, image, Cta } = data;

  return ( 
    <section className="relative w-full min-h-[85vh] lg:min-h-screen flex items-center overflow-hidden bg-white">
      {/* 1. Background Layer System */}
        {/* FIXED GRADIENT: Reduced size and opacity */}
    
      <div className="absolute inset-0 z-0">
        <img
          src={image?.url || "/home-hero.png"} 
          alt={title || "Hero Image"}
          className="w-full h-full object-cover object-right lg:object-center opacity-95"
          onError={(e) => { e.target.src = "/home-hero.png"; }}
        />

        {/* LIGHTER GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fbcfe8]/10 via-transparent to-transparent" />

        {/* REFINED AMBIENT BLOBS */}
        <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[40%] bg-[#f472b6]/10 blur-[50px] rounded-full mix-blend-multiply pointer-events-none" />
        <div className="absolute top-[5%] left-[8%] w-[30%] h-[35%] bg-[#60a5fa]/10 blur-[40px] rounded-full mix-blend-screen pointer-events-none" />

        {/* Content Area Light Leak - Adjusted for better readability with smaller text */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/50 to-transparent lg:from-white/95 lg:via-white/30 lg:to-transparent" />
      </div>

      {/* 2. Content Container - Reduced top padding */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full">
        <div className="max-w-xl">
          {/* Hero Heading - Scaled down from 7xl/6xl to 5xl/4xl */}
          <h1 className="text-3xl lg:text-5xl  font-bold text-[#002b80] leading-[1.1] mb-5 tracking-tight whitespace-pre-line">
            {title || "Your Project, \nDelivered Smarter"}
          </h1>

          {/* Hero Description - Scaled to text-base/lg */}
          <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed max-w-md font-medium">
            {description || "Fast turnaround, premium design, and transparent pricing — all in one place."}
          </p>

          {/* Call to Action Button - Scaled down padding and text */}
          <div className="flex flex-wrap gap-4">
             {Cta && (
            <a 
              href={Cta?.link || "#"}
              className="group flex items-center gap-2.5 px-8 py-3.5 text-white text-sm font-bold rounded-lg 
                        bg-gradient-to-r from-[#002b80] to-[#005eff] 
                        shadow-lg shadow-blue-500/20 
                        hover:shadow-blue-500/40 hover:-translate-y-0.5 
                        transition-all duration-300 active:scale-95"
            >
              {Cta?.text || "Get Estimate"}
              
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth="3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Transition Fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

export default HomepageHero;