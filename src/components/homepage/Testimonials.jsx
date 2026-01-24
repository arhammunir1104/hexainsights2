import React, { useState, useEffect, useRef } from "react";
import { db } from "../../firebase"; 
import { collection, onSnapshot, query } from "firebase/firestore";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import star from "/home-content/star.png"

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "testimonialsDB")); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestimonials(fetchedData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = current.offsetWidth >= 1024 ? current.offsetWidth / 3 : current.offsetWidth;
      current.scrollBy({ 
        left: direction === "left" ? -scrollAmount : scrollAmount, 
        behavior: "smooth" 
      });
    }
  };

  if (loading) return null;

  return (
    <section className="relative py-16 lg:py-20 bg-white overflow-hidden font-[Quicksand]">
      {/* Background Decor - Subtle scale down */}
      <div className="absolute top-0 right-0 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-gradient-to-bl from-blue-50 to-transparent blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading - Scaled from 5xl to 4xl */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-[Quicksand]">
            <span className="text-[#002b80]">Our</span>{" "}
            <span className="text-[#3b82f6]">Clients</span>{" "}
            <span className="text-[#002b80]">Say</span>
          </h2>
        </div>

        <div className="relative px-2">
          {/* Navigation Arrows - Scaled down buttons */}
          <button 
            onClick={() => scroll("left")}
            className="cursor-pointer absolute -left-4 md:-left-10 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-white shadow-lg border border-slate-100 text-[#002b80] hover:bg-[#005eff] hover:text-white transition-all z-30 active:scale-90"
          >
            <ArrowBackIosNewIcon sx={{ fontSize: { xs: 12, md: 16 } }} />
          </button>
          
          <button 
            onClick={() => scroll("right")}
            className="cursor-pointer absolute -right-4 md:-right-10 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-white shadow-lg border border-slate-100 text-[#002b80] hover:bg-[#005eff] hover:text-white transition-all z-30 active:scale-90"
          >
            <ArrowForwardIosIcon sx={{ fontSize: { xs: 12, md: 16 } }} />
          </button>

          {/* Testimonials Scroll Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((item) => (
              <div 
                key={item.id} 
                className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-center"
              >
                {/* Card - Reduced padding and min-height */}
                <div className="relative p-6 md:p-8 bg-[#0271FF] rounded-[1.5rem] mb-6 shadow-lg shadow-blue-500/10 min-h-[220px] md:min-h-[260px] flex flex-col">
                  
                  <img src={star} alt="" className="w-6 h-6 mb-3 opacity-90" />
                  
                  <p className="text-white text-sm md:text-[15px] leading-relaxed font-medium">
                    "{item.description}"
                  </p>
                  
                  {/* Bubble Tail */}
                  <div className="absolute -bottom-2 left-8 w-5 h-5 bg-[#0271FF] rotate-45 rounded-sm" />
                </div>

                {/* Author Details - Scaled avatars */}
                <div className="flex items-center gap-3 pl-2">
                  <div className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-base md:text-lg border-2 border-white shadow-md flex-shrink-0">
                    {item.name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-[#1E1E1E] font-bold text-sm md:text-base leading-tight">
                      {item.name}
                    </h4>
                    <span className="text-[#302A2A99] font-bold text-[9px] md:text-[10px] uppercase tracking-wider mt-0.5">
                      {item.designation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;