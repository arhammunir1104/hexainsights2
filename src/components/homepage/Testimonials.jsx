import React, { useState, useEffect, useRef } from "react";
import { db } from "../../firebase"; 
import { collection, onSnapshot, query } from "firebase/firestore";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const scrollRef = useRef(null);
  const videoRefs = useRef({});
  const isMoving = useRef(false);
  const isPausedRef = useRef(false);

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

  const handleScroll = () => {
    if (scrollRef.current && !isMoving.current) {
      const container = scrollRef.current;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.children[0]?.offsetWidth || 0;
      const gap = window.innerWidth < 768 ? 24 : 32;
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      if (newIndex >= 0 && newIndex < testimonials.length) {
        setActiveIndex(newIndex);
      }
    }
  };

  const handleNav = (direction) => {
    if (testimonials.length === 0) return;
    isMoving.current = true;
    
    // Pause any playing video when navigating
    if (playingId) {
       const currentVideo = videoRefs.current[playingId];
       if (currentVideo) currentVideo.pause();
       setPlayingId(null);
    }

    setActiveIndex(prev => {
      const nextIndex = direction === "next" 
        ? (prev + 1) % testimonials.length 
        : (prev - 1 + testimonials.length) % testimonials.length;
      return nextIndex;
    });
    setTimeout(() => { isMoving.current = false; }, 500);
  };

  useEffect(() => {
    if (scrollRef.current && isMoving.current) {
      const container = scrollRef.current;
      const card = container.children[activeIndex];
      if (card) {
        const containerWidth = container.offsetWidth;
        const cardWidth = card.offsetWidth;
        const offset = card.offsetLeft - (containerWidth - cardWidth) / 2;
        container.scrollTo({ left: offset, behavior: "smooth" });
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      if (!isPausedRef.current && !playingId) {
        handleNav("next");
      }
    }, 5000); // Slightly longer interval for manual interaction focus
    return () => clearInterval(interval);
  }, [testimonials.length, playingId]);

  const togglePlay = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingId === id) {
      video.pause();
      setPlayingId(null);
    } else {
      // Pause other playing videos if any
      if (playingId && videoRefs.current[playingId]) {
        videoRefs.current[playingId].pause();
      }
      video.play();
      setPlayingId(id);
    }
  };

  if (loading) return null;
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="relative w-full py-16 lg:py-24 bg-white overflow-hidden font-raleway">
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl  font-black tracking-tight text-[#070778]">
            Our <span className="text-[#3b82f6] opacity-60">Client</span> Say
          </h2>
        </div>

        <div 
          className="relative"
          onPointerEnter={() => { isPausedRef.current = true; }}
          onPointerLeave={() => { isPausedRef.current = false; }}
        >
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar snap-x snap-mandatory pt-10 pb-24 px-[10%] sm:px-[20%] md:px-[30%]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {(testimonials || []).map((item, index) => {
              const isActive = index === activeIndex;
              const isPlaying = playingId === item?.id;

              return (
                <div
                  key={item?.id || index}
                  className={`flex-shrink-0 transition-all duration-700 ease-in-out snap-center
                    ${isActive 
                      ? "w-[75vw] sm:w-[260px] lg:w-[350px] z-20 scale-105" 
                      : "w-[70vw] sm:w-[240px] lg:w-[320px] z-10 opacity-60 scale-95"
                    }`}
                >
                  <div className={`relative rounded-[2.5rem] overflow-hidden border-4 transition-all duration-500 flex flex-col bg-white h-[320px] md:h-[420px] shadow-2xl ${isActive ? 'border-blue-400 shadow-blue-500/20' : 'border-blue-50/50'}`}>
                    
                    {/* Video Section */}
                    <div className="relative flex-grow bg-slate-900 overflow-hidden group cursor-pointer" onClick={() => togglePlay(item?.id)}>
                      {item?.videoUrl ? (
                        <video 
                          ref={el => videoRefs.current[item?.id] = el}
                          src={item.videoUrl} 
                          className="w-full h-full object-cover"
                          muted // Muted by default as per requirement
                          controls={isPlaying} // Show controls only when playing or always? Requirement says "manually mute/unmute"
                          loop
                          playsInline
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                          <PlayArrowIcon className="text-white/20" sx={{ fontSize: 80 }} />
                        </div>
                      )}
                      
                      {!isPlaying && (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 transform group-hover:scale-110 transition-transform">
                               <PlayArrowIcon sx={{ fontSize: 40, color: 'white' }} />
                            </div>
                         </div>
                      )}

                      {!isActive && (
                         <div className="absolute inset-0 bg-[#070778]/10 pointer-events-none" />
                      )}
                    </div>

                    {/* Bottom Info Banner */}
                    <div className="bg-[#070778] p-6 text-white">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                          <h3 className={`font-black tracking-tight leading-tight transition-all duration-500 ${isActive ? "text-xl md:text-2xl" : "text-lg"}`}>
                            {item?.name}
                          </h3>
                          <p className="text-blue-300 text-[10px] md:text-xs font-black uppercase tracking-[0.25em]">
                            Watch our Showreel
                          </p>
                        </div>
                        <div 
                          onClick={(e) => { e.stopPropagation(); togglePlay(item?.id); }}
                          className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-[#0d6efd] shadow-xl shadow-blue-600/30 transform transition-all duration-500 hover:scale-110 cursor-pointer ${isActive ? "scale-100" : "scale-90"}`}
                        >
                           {isPlaying ? <PauseIcon sx={{ fontSize: 30, color: 'white' }} /> : <PlayArrowIcon sx={{ fontSize: 30, color: 'white' }} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-6 z-30">
            <button
              onClick={() => handleNav("prev")}
              className="w-14 h-14 rounded-full cursor-pointer bg-[#070778] text-white flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-all active:scale-90 border-2 border-white/10 group"
            >
              <ArrowBackIosNewIcon className="group-hover:-translate-x-0.5 transition-transform" sx={{ fontSize: 20 }} />
            </button>
            <button
              onClick={() => handleNav("next")}
              className="w-14 h-14 rounded-full cursor-pointer bg-[#070778] text-white flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-all active:scale-90 border-2 border-white/10 group"
            >
              <ArrowForwardIosIcon className="group-hover:translate-x-0.5 transition-transform" sx={{ fontSize: 20 }} />
            </button>
          </div>

        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;