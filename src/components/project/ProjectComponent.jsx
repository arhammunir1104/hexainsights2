import React from 'react';

const ProjectComponent = ({ data }) => {
  if (!data) return null;

  return (
    /* Scaled down margins from 10%/5% to 40px/24px */
    <div className="w-full mt-10 mb-6 bg-white ">
      {/* ================= SECTION 1: BANNER ================= */}
      {/* Scaled down py-16 to py-12 */}
      <section className="py-12 px-6 md:px-12 lg:px-24 text-center border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          {/* Scaled down text-5xl to text-3xl/4xl */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#070778] leading-tight mb-4">
            {data.banner?.heading}
          </h1>
          
          {/* Scaled down text-xl to text-base */}
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
            {data.banner?.description}
          </p>

          {/* Banner Image */}
          {data.banner?.image?.url && (
            <div className="w-full rounded-xl overflow-hidden shadow-xl">
              <img 
                src={data.banner.image.url} 
                alt={data.banner.heading} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* ================= SECTION 2: SUBSECTION CARDS ================= */}
      {/* Scaled down py-20 to py-12 and space-y-24 to space-y-16 */}
      <section className="py-12 px-6 md:px-12 lg:px-24 space-y-16">
        {data.subSection?.cards?.map((card, index) => {
          const isEven = index % 2 !== 0;

          return (
            /* Scaled down gap-12/20 to gap-8/12 */
            <div 
              key={index} 
              className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 lg:gap-12`}
            >
              {/* Image Column */}
              <div className="w-full md:w-1/2">
                {/* Removed hover:scale-[1.02] and reduced rounded corners to 2xl */}
                <div className="rounded-2xl overflow-hidden shadow-md transition-all duration-300">
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