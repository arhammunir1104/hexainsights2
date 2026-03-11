import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { db } from "../../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Services({ data }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const { title, description, cta } = data || {};

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesRef = collection(db, "servicesDB");
        const q = query(servicesRef, where("display", "array-contains", "home"));
        const querySnapshot = await getDocs(q);
        
        const fetchedServices = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setServices(fetchedServices);
      } catch (error) {
        console.error("Error fetching services cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const renderTitle = (fullTitle) => {
    const words = (fullTitle || "Services We Offer").split(" ");
    return (
      <>
        <span className="text-[#002b80]">{words[0]}</span>{" "}
        <span className="text-[#3b82f6] font-medium">{words[1]}</span>{" "}
        <span className="text-[#002b80]">{words.slice(2).join(" ")}</span>
      </>
    );
  };

  if (loading) return <div className="py-16 text-center text-slate-400 text-sm">Loading Our Services...</div>;

  return (
    <section className="relative py-12 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section: Scaled down text and margins */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl  font-bold tracking-tight mb-4">
            {renderTitle(title)}
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {description || "Tailored solutions designed to drive growth and efficiency for your business."}
          </p>
        </div>

        {/* Services Grid: Optimized card height and padding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {services.map((service, index) => (
            <NavLink 
              to={`/services/${service.uid}`} 
              key={service.id || index}
              className="group flex flex-col items-center transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Card Container: Changed aspect ratio and reduced rounding */}
              <div className="w-full aspect-[4/3.5] rounded-[1.8rem] p-6 flex flex-col items-center justify-around text-center 
                              bg-gradient-to-b from-[#4F9CFF] via-[#001E74] to-[#001E74] shadow-lg shadow-blue-100/40">
                
                {/* Icon Circle: Scaled down from w-28 to w-20 */}
                <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center p-4 shadow-md mb-6 transform  transition-transform duration-500">
                  <img
                    src={service.icon?.url || service.image?.url}
                    alt={service.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Service Title: Adjusted font size to text-lg */}
                <h3 className="text-lg font-bold text-white leading-tight px-2">
                  {service.title}
                </h3>
              </div>
            </NavLink>
          ))}
        </div>

        {/* CTA Button: Slimmer dimensions */}
        <div className="flex justify-center">
          <NavLink to={cta?.link || "/pricing"}>
            <button className="flex cursor-pointer items-center gap-2 px-8 py-3 text-white text-sm font-bold rounded-lg 
                                bg-gradient-to-r from-[#002b80] to-[#005eff] 
                                shadow-lg shadow-blue-500/20 
                                hover:shadow-blue-500/40 hover:-translate-y-0.5 
                                transition-all duration-300 active:scale-95 group">
              
              {cta?.title || "Get Estimate"}
              
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth="3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </NavLink>
        </div>
      </div>
    </section>
  );
}