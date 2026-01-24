import React from "react";

const TrustedBy = ({ data }) => {
  if (!data) return null;

  const { title, description, images } = data;

  const renderTitle = (fullTitle) => {
    const words = (fullTitle || "Locations We Operate From").split(" ");
    return (
      <>
        <span className="text-[#002b80]">{words[0]}</span>{" "}
        <span className="text-[#93c5fd] font-medium">{words[1]}</span>{" "}
        <span className="text-[#002b80]">{words.slice(2).join(" ")}</span>
      </>
    );
  };

  return (
    <section className="relative w-full py-16 bg-white overflow-hidden">
      
      {/* 1. DECORATIONS - Scaled down slightly */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img 
          src="/home-contact/vector1.png" 
          alt="decoration"
          className="absolute top-[8%] left-[5%] md:left-[10%] w-20 md:w-24 lg:w-28 opacity-80 object-contain"
        />
        <img 
          src="/home-contact/vector2.png" 
          alt="decoration"
          className="absolute bottom-[15%] right-[8%] md:right-[15%] w-16 md:w-20 opacity-70 object-contain"
        />
        <img 
          src="/bg-wave.png" 
          alt=""
          className="absolute top-1/2 left-0 w-full opacity-20 object-cover min-h-[200px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Header Section - Reduced mb-20 to mb-12 */}
        <div className="mb-12 relative">
          {/* Heading scaled from 6xl to 4xl/3xl */}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {renderTitle(title)}
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Locations Grid - Reduced gap-12 to gap-8 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 justify-items-center">
          {images?.map((item, index) => (
            <div key={index} className="flex flex-col items-center w-full max-w-[180px]">
              {/* Card Container - Reduced padding and rounded corners */}
              <div className="w-full aspect-square rounded-[1.5rem] flex items-center justify-center p-6 bg-slate-50/60 border border-slate-100/40 hover:bg-white hover:shadow-md transition-all duration-300">
                <img 
                  src={item.url} 
                  alt={item.text} 
                  className="w-full h-full object-contain p-2" 
                />
              </div> 
              
              {/* Country Label - Scaled from text-xl to text-base */}
              <span className="mt-4 text-base font-bold text-[#002b80] tracking-wide">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;