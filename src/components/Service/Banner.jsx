import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HomepageHero = ({ data }) => { 
  if (!data) return null;

  const { title, description, image, Cta } = data;

  return (
    /* Changed min-h-screen to a fixed large height for better "slim" vertical flow */
    <section className="relative w-full min-h-[70vh] lg:h-[85vh] flex items-center overflow-hidden bg-white">
      {/* 1. Background Layer System */}
      <div className="absolute inset-0 z-0">
        <img
          src={image?.url || "/home-hero.png"} 
          alt={title || "Hero Image"}
          className="w-full h-full object-cover object-right lg:object-center opacity-95"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-[#fbcfe8]/10 via-transparent to-transparent" />

        {/* Refined Ambient Blobs - Scaled down blur for a cleaner look */}
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[40%] bg-[#f472b6]/10 blur-[50px] rounded-full mix-blend-multiply pointer-events-none" />
        <div className="absolute top-[5%] left-[5%] w-[25%] h-[35%] bg-[#60a5fa]/10 blur-[40px] rounded-full mix-blend-screen pointer-events-none" />

        {/* Content Area Light Leak */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/50 to-transparent lg:from-white/95 lg:via-white/30 lg:to-transparent" />
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-12 w-full">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Heading - Scaled down from 7xl to 5xl/4xl */}
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-[#002b80] leading-[1.1] mb-5 tracking-tight whitespace-pre-line">
            {title || "Your Project, \nDelivered Smarter"}
          </h1>

          {/* Description - Scaled down from text-xl to text-base/lg */}
          <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed max-w-md font-medium">
            {description || "Fast turnaround, premium design, and transparent pricing — all in one place."}
          </p>

          {/* Call to Action Button - Scaled down padding and text */}
          <div className="flex flex-wrap gap-4">
            <NavLink to={Cta?.link || "/pricing"}>
              <button className="group flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-[#003eb3] via-[#004edb] to-[#0072ff] text-white text-sm md:text-base font-bold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-none hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer">
                {Cta?.text || "Get Estimate"} 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* 3. Bottom Transition Fade - Shorter height */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

export default HomepageHero;