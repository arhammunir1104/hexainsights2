import React from 'react';

const ProjectComponent = ({ data }) => {
  if (!data) return null;
 
  return ( 
    /* Scaled down top margin from 10% to 48px and bottom from 5% to 32px */
    <div className="w-full py-12 lg:py-20 bg-white ">
      {/* ================= SECTION 1: BANNER ================= */}
      {/* Scaled down py-16 to py-10 */}
      <section className="px-6 md:px-12 lg:px-24 text-center border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          {/* Scaled down text-5xl to text-3xl/4xl */}
          <h1 className="text-3xl lg:text-5xl  font-bold text-[#002b80] leading-[1.1] mb-5 tracking-tight whitespace-pre-line">
            {data.title}
          </h1>
          
          {/* Scaled down text-xl to text-base */}
          <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed  font-medium">
            {data?.description}
          </p>
        </div>
      </section>

      {/* ================= SECTION 2: SUBSECTION CARDS ================= */}
 <div className="container mx-auto px-6 lg:px-16">
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
                    {card.title}
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

export default ProjectComponent;