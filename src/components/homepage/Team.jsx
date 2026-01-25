import React, { useState, useEffect, useRef } from 'react';
import { db } from "../../firebase"; 
import { collection, onSnapshot, query, where } from "firebase/firestore";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import frame from "/home-content/frame.png"

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "teamsDB"), where("visible", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeamMembers(fetchedData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleNav = (direction) => {
    if (direction === "next") {
      setActiveIndex((prev) => (prev + 1) % teamMembers.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const card = container.children[activeIndex];
      if (card) {
        const offset = card.offsetLeft - (window.innerWidth < 768 ? 20 : 0);
        container.scrollTo({
          left: offset,
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex]);

  if (loading) return null;

  return (
    <section className="relative w-full py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
               {/* FIXED GRADIENT: Reduced size and opacity */}
      <div 
        className="absolute top-0 left-0 w-[250px] h-[250px] pointer-events-none opacity-30 z-0"
        style={{
          background: "radial-gradient(circle at 20% 50%, rgba(2, 113, 255, 0.5) 0%, transparent 60%)"
        }}
      />
        {/* Heading Scaled Down */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0037a5]">
            Our <span className="text-[#3b82f6] opacity-60">Team</span>
          </h2>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex items-center gap-6 md:gap-8 overflow-x-auto md:overflow-hidden no-scrollbar snap-x snap-mandatory pb-16 pt-5 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {teamMembers.map((member, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={member.id}
                  className={`flex-shrink-0 transition-all duration-500 ease-in-out snap-center
                    ${isActive 
                      ? "w-[80vw] sm:w-[280px] lg:w-[320px] z-20" 
                      : "w-[65vw] sm:w-[240px] lg:w-[260px] opacity-70 z-10"
                    }`}
                >
                  {/* Image Section - Reduced heights */}
                  <div className="relative rounded-t-[1.5rem] overflow-hidden bg-[#001E74] h-[300px] md:h-[380px] flex items-end justify-center">
                    {/* Decorative Frame - Scaled down */}
                    <img src={frame} alt="" className="absolute top-6 left-6 w-10 h-10 opacity-50" />

                    <img
                      src={member.image?.url || 'https://via.placeholder.com/400x500'}
                      alt={member.name}
                      className={`relative z-10 w-full h-[92%] object-contain transition-all duration-500
                        ${isActive ? "grayscale-0 brightness-110 scale-105" : "grayscale opacity-50 scale-100"}`}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001E74] via-transparent to-transparent opacity-40 z-20" />
                  </div>

                  {/* Info Section - Tighter padding */}
                  <div className="bg-gradient-to-r from-[#002b80] to-[#001E74] p-5 rounded-b-[1.5rem] text-white shadow-lg">
                    <h3 className="text-lg md:text-xl font-bold truncate">
                      {member.name}
                    </h3>
                    <p className="text-blue-300 text-[11px] md:text-xs font-semibold mb-4 uppercase tracking-wider">
                      {member.designation}
                    </p>

                    <div className="flex gap-3">
                      {member.socials?.facebook && (
                        <a href={member.socials.facebook} target="_blank" rel="noreferrer" className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/30 transition-all">
                          <FacebookIcon sx={{ fontSize: 16 }} />
                        </a>
                      )}
                      {member.socials?.instagram && (
                        <a href={member.socials.instagram} target="_blank" rel="noreferrer" className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/30 transition-all">
                          <InstagramIcon sx={{ fontSize: 16 }} />
                        </a>
                      )}
                      {member.socials?.twitter && (
                        <a href={member.socials.twitter} target="_blank" rel="noreferrer" className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/30 transition-all">
                          <TwitterIcon sx={{ fontSize: 16 }} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons - Scaled down */}
          <div className="absolute -bottom-2 right-10 flex gap-3 hidden md:flex">
            <button
              onClick={() => handleNav("prev")}
              className="w-11 h-11 rounded-full bg-[#1c1c1c] text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all active:scale-90"
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
            </button>
            <button
              onClick={() => handleNav("next")}
              className="w-11 h-11 rounded-full bg-[#1c1c1c] text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all active:scale-90"
            >
              <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;