import React from 'react';

const AboutContent = ({ data }) => {
  // Defensive title rendering to prevent "split" errors
  const renderTitle = (fullTitle) => {
    if (!fullTitle) return <span className="text-[#002b80]">About Us</span>;
    
    const words = fullTitle.split(" ");
    return (
      <>
        <span className="text-[#002b80]">{words[0]}</span>{" "}
        <span className="text-blue-400 font-medium">{words[1]}</span>{" "}
        <span className="text-[#002b80]">{words.slice(2).join(" ")}</span>
      </>
    );
  };

  return (
    <div className="bg-white text-gray-800 font-[Quicksand]">
      {/* Scaled down py-12 to py-8 for a more compact vertical footprint */}
      <div className="container mx-auto px-6 py-8">
        {/* Top Section - Centered and Resized */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Scaled down from text-4xl to text-2xl/3xl */}
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            {renderTitle(data?.title)}
          </h2>
          {/* Scaled down text-base to text-sm */}
          <p className="text-gray-500 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            {data?.description || "Description loading..."}
          </p>
        </div>       
      </div>
    </div>
  );
};

export default AboutContent;