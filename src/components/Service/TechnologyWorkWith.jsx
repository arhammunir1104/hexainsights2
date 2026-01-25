import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";

const TechnologyWorkWith = ({page}) => {
  const [techIcons, setTechIcons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const techRef = collection(db, "technologyDB");
        const q = query(techRef, where("display", "array-contains", page));
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
  }, [page]); // Added page to dependency array for best practice

  const renderTitle = (fullTitle) => {
    const words = (fullTitle || "Technologies We Work With").split(" ");
    return (
      /* Scaled down from text-6xl to text-4xl */
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center">
        <span className="text-[#002b80]">{words[0]}</span>{" "}
        <span className="text-[#3b82f6] font-medium">{words[1]}</span>{" "}
        <span className="text-[#002b80]">{words.slice(2).join(" ")}</span>
      </h2>
    );
  };

  if (loading) return null;

  return (
    /* Reduced vertical padding from py-20 to py-12/16 */
    <section className="py-8 bg-white overflow-hidden ">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section - Tightened margin */}
        <div className="text-center mb-10 md:mb-12">
          {renderTitle("Technologies We Work With")}
        </div>

        {/* Icons Grid: Scaled down icons and gaps */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {techIcons.map((tech) => (
            <div 
              key={tech.id} 
              className="flex items-center justify-center transition-all duration-300  hover:opacity-100"
            >
              {/* Reduced icon container size from w-20 to w-14/16 */}
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