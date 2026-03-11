import React from 'react';
import renderTitle from '../../utills/rendertitle';

const SPIRAL_IMAGE_URL = '/about/design2.png'; 

const CorporateValuesComponent = ({ data }) => {
  if (!data || !data.corporateCards) return null;

  return (
    /* Scaled down py-20 to py-12 */
    <section className="bg-white py-12 lg:py-20 relative overflow-hidden">
      
      {/* Background Glow - Scaled down blur and size */}
      <div 
        className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full blur-[60px] opacity-30 z-0"
        style={{ backgroundColor: '#E6F0FF', transform: 'translate(-20%, 20%)' }}
      ></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header Section - Scaled down mb-12 to mb-10 */}
        <div className="text-center mb-10">
          {/* Scaled down text-4xl to text-2xl/3xl */}
          <h2 className="text-3xl lg:text-5xl  font-bold mb-3">
            {renderTitle(data?.title)}
          </h2>
          <p className="max-w-xl mx-auto text-base md:text-lg text-slate-600leading-relaxed">
            {data?.description}
          </p>
        </div>

        {/* Values Grid - Tightened gap from 8 to 6 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data?.corporateCards || []).map((value, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl"
              style={{
                background: 'linear-gradient(145deg, #0056FF 0%, #002B80 100%)',
                /* Reduced min-height from 280px to 240px */
                minHeight: '240px'
              }}
            >
              {/* Icon Container - Scaled down from 20 to 14 */}
              <div className="mb-4 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                <img 
                  src={value?.icon} 
                  alt={value?.title || "Value Icon"} 
                  /* Scaled icon from 10 to 7 */
                  className="w-7 h-7 object-contain" 
                  onError={(e) => { e.target.src = 'https://img.icons8.com/color/96/ok--v1.png' }}
                />
              </div>

              {/* Text Content - Scaled from text-lg to text-base */}
              <h3 className="text-base font-bold text-white mb-2">
                {value?.title}
              </h3>
              <p className="text-blue-100/80 text-[11px] md:text-xs leading-relaxed max-w-[200px]">
                {value?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CorporateValuesComponent;