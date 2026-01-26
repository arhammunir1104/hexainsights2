import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const ServiceStaffComponent = ({ pageUid = "home", show = true }) => {
  const [data, setData] = useState({ title: "Specialized Staff We Provide", staff: [] });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const docRef = doc(db, "staffDB", "main_content");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fullData = docSnap.data();
          const filteredStaff = fullData.staff.filter(member => 
            member.display && member.display.includes(pageUid)
          );

          setData({
            title: fullData.title || "Specialized Staff We Provide",
            staff: filteredStaff
          });
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [pageUid]);

  if (loading || data.staff.length === 0) return null;

  return (
    <div className="py-8 lg:py-16 px-6 md:px-12 lg:px-24  relative overflow-hidden bg-white">
      
      {/* Subtle Background Scribble - Scaled down */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
         <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 40C60 10 140 10 180 40C150 70 50 70 20 40Z" stroke="#001D84" strokeWidth="2"/>
            <path d="M30 140C70 110 150 110 190 140" stroke="#001D84" strokeWidth="2"/>
         </svg>
      </div>

      {/* Heading Section - Scaled from 5xl to 3xl/4xl */}
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-5xl font-bold text-[#001D84] tracking-tight">
          {renderTitle(data.title)}
        </h2>
        <div className="w-16 h-1 bg-blue-500/20 mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Staff Grid - Tighter gaps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {data.staff.map((member, index) => (
          <div 
            key={index} 
            className="group flex items-center p-4 bg-white rounded-xl shadow-sm border border-slate-50 hover:border-blue-100 hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            {/* Thinner Blue Accent Bar */}
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#001D84] "></div>
            
            <div className="flex items-center ml-3">
              <div className="w-10 h-10 flex-shrink-0 bg-slate-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-50 transition-colors">
                <img 
                  src={member.image?.url} 
                  alt={member.title} 
                  className="w-6 h-6 object-contain  transition-all" 
                />
              </div>
              <h3 className="text-slate-700 font-bold text-sm md:text-base leading-tight group-hover:text-[#001D84] transition-colors">
                {member.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Core Technologies - Scaled down */}
      {show && (
        <div className="mt-20 border-t border-slate-50 pt-12">
          <h4 className="text-center text-xs font-bold text-slate-400 mb-10 uppercase tracking-[0.2em]">
            Core Technologies
          </h4>
          <div className="flex flex-wrap justify-center gap-10 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <TechIcon name="React" url="/service/t1.png" />
            <TechIcon name="Angular" url="/service/t2.png" />
            <TechIcon name="Next.js" url="/service/t3.png" />
            <TechIcon name="Node.js" url="/service/t4.png" />
          </div>
        </div>
      )}
    </div>
  );
};

const TechIcon = ({ name, url }) => (
  <div className="flex flex-col items-center gap-2 group cursor-default">
    <img src={url} alt={name} className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-110" />
    <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">{name}</span>
  </div>
);

export default ServiceStaffComponent;