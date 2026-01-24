import React from 'react';

const AboutContent2 = ({ data }) => {
  // Safety check: If no data are provided, don't render the section
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white text-gray-800 font-[Quicksand]">
      {/* Scaled down container padding from py-10 to py-6 */}
      <div className="container mx-auto py-6 px-6 lg:px-16">
        {/* Tightened gap between alternating rows from gap-16 to gap-10 */}
        <div className="flex flex-col gap-10">
          {data.map((card, index) => {
            // Determine if the index is even or odd for alternating layout
            const isEven = index % 2 === 0;

            return (
              <div 
                key={index} 
                className={`flex flex-col gap-6 lg:flex-row items-center ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Image Section - Scaled down slightly with max-width constraint */}
                <div className="w-full lg:w-1/2 max-w-md mx-auto">
                  <img 
                    src={card.image || "/about/img2.png"}
                    alt={card.heading || "About Illustration"}
                    className="w-full h-auto shadow-sm object-cover rounded-lg"
                    onError={(e) => { e.target.src = "/about/img2.png"; }} 
                  />
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  {/* Scaled down heading size and margin */}
                  <h3 className="text-xs font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent mb-1 uppercase tracking-wide">
                    {card.heading}
                  </h3>
                  {/* Scaled down text-3xl to text-xl/2xl */}
                  <h2 className="text-xl lg:text-2xl font-bold mb-3 leading-tight text-[#002b80]">
                    {card.title}
                  </h2>
                  {/* Scaled down description text-base to text-sm */}
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
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

export default AboutContent2;