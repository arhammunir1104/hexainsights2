import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";

const TechnologyWorkWith = ({ data }) => {
  const [techIcons, setTechIcons] = useState([]);
  const [loading, setLoading] = useState(true);

  const { title, description } = data || {};

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const techRef = collection(db, "technologyDB");
        const q = query(techRef, where("display", "array-contains", "home"));
        const querySnapshot = await getDocs(q);

        const fetchedIcons = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          url: doc.data().image?.url,
        }));

        setTechIcons(fetchedIcons);
      } catch (error) {
        console.error("Error fetching technologies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTech();
  }, []);

  const renderTitle = (fullTitle) => {
    const words = (fullTitle || "Technologies We Work With").split(" ");
    return (
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-center">
        <span className="text-[#002b80]">{words[0]}</span>{" "}
        <span className="text-[#3b82f6] font-medium">{words[1]}</span>{" "}
        <span className="text-[#002b80]">{words.slice(2).join(" ")}</span>
      </h2>
    );
  };

  if (loading) return null;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section - Scaled down margins */}
        <div className="text-center mb-10">
          {renderTitle(title)}
          {description && (
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Icons Grid - Reduced gaps significantly for a "normal" look */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {techIcons.map((tech) => (
            <div 
              key={tech.id} 
              className="flex items-center justify-center transition-all duration-300 "
            >
              {/* Icon Container - Scaled from 20 to 14 (approx 56px) */}
              <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center">
                <img
                  src={tech.url}
                  alt="technology icon"
                  className="max-w-full max-h-full object-contain pointer-events-none"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologyWorkWith;