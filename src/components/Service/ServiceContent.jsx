import React from 'react';

const ServiceContent = ({ data }) => {
  // Safety check: If no data are provided, don't render the section
  if (!data || data.length === 0) return null;


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
    <div className="bg-white text-gray-800 ">

       <div className="bg-white text-gray-800 ">
      <div className="container mx-auto px-6 py-12">
        {/* Top Section - Centered and Resized */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {renderTitle(data?.title)}
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {data?.description || "Description loading..."}
          </p>
        </div>       
      </div>
    </div>

      <div className="container mx-auto py-10 px-6 lg:px-16">
        <div className="flex flex-col gap-16">
          {data?.cards.map((card, index) => {
            // Determine if the index is even or odd for alternating layout
            const isEven = index % 2 === 0;

            return (
              <div 
                key={index} 
                className={`flex flex-col gap-8 lg:flex-row items-center lg:items-center ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Image Section */}
                <div className="w-full lg:w-1/2">
                  <img
                    src={card.image || "/about/img2.png"}
                    alt={card.heading || "About Illustration"}
                    className="w-full h-auto rounded-2xl shadow-sm object-cover"
                    onError={(e) => { e.target.src = "/about/img2.png"; }} // Fallback if image fails
                  />
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent mb-2 uppercase tracking-wide">
                    {card.heading}
                  </h3>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight text-[#002b80]">
                    {card.text}
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceContent;