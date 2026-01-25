import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HomepageHero = ({ data }) => { 
  if (!data) return null;

  const { title, description, image, Ctr } = data;
 

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-white">
      
     

{/* 1. Background Layer System */}
      <div className="absolute inset-0 z-0">
        {/* Base Image - Increased opacity for maximum clarity */}
        <img
          src={image || "/home-hero.png"} 
          alt={title || "Hero Image"}
          className="w-full h-full object-cover object-right lg:object-center opacity-95"
        />

        {/* LIGHTER GRADIENT OVERLAY - Subtle tint, not a heavy wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fbcfe8]/20 via-transparent to-transparent" />

        {/* REFINED AMBIENT BLOBS - Reduced blur and opacity for a sharper photo */}
        {/* Pink Glow - Sharper focus */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-[#f472b6]/15 blur-[60px] rounded-full mix-blend-multiply pointer-events-none" />
        
        {/* Blue Glow - Sharper focus */}
        <div className="absolute top-[5%] left-[10%] w-[35%] h-[45%] bg-[#60a5fa]/10 blur-[50px] rounded-full mix-blend-screen pointer-events-none" />

        {/* Content Area "Light Leak" - Reduced opacity to show more image detail behind text */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent lg:from-white/95 lg:via-white/20 lg:to-transparent" />
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20 w-full">
        
      
        <div className="max-w-2xl">
          {/* Hero Heading */}
          <h1 className="text-md font-[Raleway] md:text-xl lg:text-xl  text-[#002b80] leading-[1.05] mb-6 tracking-tight whitespace-pre-line">
            {title || "Your Project, \nDelivered Smarter"}
          </h1>
          

          {/* Hero Description */}
          <p className="text-lg md:text-xl text-slate-700 mb-10 leading-relaxed max-w-lg font-medium">
            {description || "Fast turnaround, premium design, and transparent pricing — all in one place."}
          </p>

          {/* Call to Action Button */}
          <div className="flex flex-wrap gap-4">
            <a href={Ctr?.link || "/pricing"}>
              <button className="group flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#003eb3] via-[#004edb] to-[#0072ff] text-white font-bold rounded-[10px] shadow-[0_15px_35px_rgba(0,62,179,0.3)] hover:shadow-none hover:-translate-y-1 transition-all duration-300 active:scale-95 cursor-pointer">
                {Ctr?.text || "Get Estimate"} 
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Bottom Transition Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

export default HomepageHero;