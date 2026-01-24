import React from "react";
import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HomepageHero = ({ data }) => { 
  if (!data) return null;

  const { title, description, image, Cta } = data;

  return (
    /* Scaled down min-height from screen to 80vh */
    <section className="relative w-full min-h-[80vh] flex items-center overflow-hidden bg-white">
      {/* 1. Background Layer System */}
      <div className="absolute inset-0 z-0">
        <img
          src={image || "/home-hero.png"} 
          alt={title || "Hero Image"}
          className="w-full h-full object-cover object-right lg:object-center opacity-95"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-[#fbcfe8]/20 via-transparent to-transparent" />

        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-[#f472b6]/15 blur-[60px] rounded-full mix-blend-multiply pointer-events-none" />
        
        <div className="absolute top-[5%] left-[10%] w-[35%] h-[45%] bg-[#60a5fa]/10 blur-[50px] rounded-full mix-blend-screen pointer-events-none" />

        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent lg:from-white/95 lg:via-white/20 lg:to-transparent" />
      </div>

      {/* 2. Content Container */}
      {/* Scaled down padding from pt-32 pb-20 to pt-24 pb-16 */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full">
        <div className="max-w-2xl">
          {/* Hero Heading: Scaled down from text-7xl to text-5xl/6xl */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002b80] leading-[1.1] mb-5 tracking-tight whitespace-pre-line">
            {title || "Your Project, \nDelivered Smarter"}
          </h1>

          {/* Hero Description: Scaled down from text-xl to text-lg */}
          <p className="text-base md:text-lg text-slate-700 mb-8 leading-relaxed max-w-lg font-medium">
            {description || "Fast turnaround, premium design, and transparent pricing — all in one place."}
          </p>

          {/* Call to Action Button: Scaled down padding and shadow */}
          <div className="flex flex-wrap gap-4">
            <NavLink to={Cta?.link || "/pricing"}>
              <button className="group flex items-center gap-2.5 px-8 py-3 bg-gradient-to-r from-[#003eb3] via-[#004edb] to-[#0072ff] text-white font-bold rounded-[10px] shadow-[0_10px_25px_rgba(0,62,179,0.2)] hover:shadow-none hover:-translate-y-1 transition-all duration-300 active:scale-95 cursor-pointer">
                <span className="text-sm md:text-base">{Cta?.text || "Get Estimate"}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* 3. Bottom Transition Fade: Scaled down height from 32 to 24 */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

export default HomepageHero;