import React from 'react';

const ProjectComponent = ({ data }) => {
  if (!data) return null;

  return (
    /* Scaled down top margin from 10% to 48px and bottom from 5% to 32px */
    <div className="w-full mt-12 mb-8 bg-white font-[Quicksand]">
      {/* ================= SECTION 1: BANNER ================= */}
      {/* Scaled down py-16 to py-10 */}
      <section className="py-10 px-6 md:px-12 lg:px-24 text-center border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          {/* Scaled down text-5xl to text-3xl/4xl */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#070778] leading-tight mb-4">
            {data.title}
          </h1>
          
          {/* Scaled down text-xl to text-base */}
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 max-w-2xl mx-auto">
            {data?.description}
          </p>
        </div>
      </section>

      {/* ================= SECTION 2: SUBSECTION CARDS ================= */}
      {/* Scaled down vertical padding and gap between cards */}
      <section className="py-12 px-6 md:px-12 lg:px-24 space-y-16">
        {data?.cards?.map((card, index) => {
          const isEven = index % 2 !== 0;

          return (
            <div 
              key={index} 
              className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 lg:gap-16`}
            >
              {/* Image Column */}
              <div className="w-full md:w-1/2">
                <div className="overflow-hidden shadow-md rounded-lg">
                  <img 
                    src={card.image?.url} 
                    alt={card.title} 
                    className="w-full h-full object-cover aspect-video"
                  />
                </div>
              </div>

              {/* Text Column */}
              <div className="w-full md:w-1/2 space-y-3">
                <p className="text-[#007bff] font-bold uppercase tracking-widest text-[10px] md:text-xs">
                   {card.heading || "Our Feature"}
                </p>
                {/* Scaled down text-3xl to text-xl/2xl */}
                <h3 className="text-xl md:text-2xl font-bold text-[#070778]">
                  {card.title}
                </h3>
                {/* Scaled down text-lg to text-sm/base */}
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default ProjectComponent;