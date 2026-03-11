import React, { useState, useEffect } from "react";

const useTypingEffect = (text, delay = 100, interval = 3000) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let typeTimer;
    let resetTimer;
    if (isTyping) {
      if (displayedText.length < (text?.length || 0)) {
        typeTimer = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length + 1));
        }, delay);
      } else {
        setIsTyping(false);
      }
    } else {
      resetTimer = setTimeout(() => {
        setDisplayedText("");
        setIsTyping(true);
      }, interval);
    }
    return () => {
      clearTimeout(typeTimer);
      clearTimeout(resetTimer);
    };
  }, [displayedText, isTyping, text, delay, interval]);

  return displayedText;
};

function About({ data }) {
  const TARGET_TEXT = data?.title || "Hexainsights";
  const animatedTitle = useTypingEffect(TARGET_TEXT, 120, 3000);

  if (!data) return null;

  return (
    <section className="relative py-12 lg:py-20 bg-white overflow-hidden">
      
      {/* FIXED GRADIENT: Reduced size and opacity */}
      <div 
        className="absolute top-0 right-0 w-[250px] h-[250px] pointer-events-none opacity-30 z-0"
        style={{
          background: "radial-gradient(circle at 80% 50%, rgba(2, 113, 255, 0.5) 0%, transparent 60%)"
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center relative z-10">
        
        {/* LEFT: HERO IMAGE - Adjusted max-width for better balance */}
        <div className="w-full max-w-lg mx-auto lg:max-w-none">
          <img
            src={data.image?.url || "/aboutus/img1.png"}
            alt="Our Team"
            className="w-full h-auto rounded-2xl shadow-sm object-cover border border-slate-50"
          />
        </div>

        {/* RIGHT: CONTENT */}
        <div className="flex flex-col items-start">
          {/* Title: Reduced from text-6xl to text-4xl/5xl */}
          <h2 className="text-3xl lg:text-5xl  font-bold text-[#002b80] mb-5 tracking-tight flex items-center">
            {animatedTitle}
            <span className="inline-block w-[3px] h-8 md:h-10 text-[#002b80] ml-2 animate-pulse rounded-full" />
          </h2>

          {/* Description: Reduced from text-xl to text-base/lg */}
          <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8 font-normal max-w-lg">
            {data.description}
          </p>

          {/* BUTTON: Slimmer padding and text */}
          {data.ctr && (
            <a 
              href={data.ctr.link || "#"}
              className="group flex items-center gap-2.5 px-8 py-3.5 text-white text-sm font-bold rounded-lg 
                        bg-gradient-to-r from-[#002b80] to-[#005eff] 
                        shadow-lg shadow-blue-500/20 
                        hover:shadow-blue-500/40 hover:-translate-y-0.5 
                        transition-all duration-300 active:scale-95"
            >
              {data.ctr.title || "Get Estimate"}
              
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
    </section>
  );
}

export default About;