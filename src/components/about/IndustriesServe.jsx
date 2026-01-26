import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";

// Ensure this path is correct relative to this file
import industyImage from "/home-content/industry.png"; 

 const IndustriesServe = () => {
  const [industries, setIndustries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const servicesRef = collection(db, "industryDB");
        const q = query(servicesRef, where("display", "array-contains", "about"));
        const querySnapshot = await getDocs(q);

        const fetchedData = querySnapshot.docs.map((doc) => ({
          title: doc.data().title,
          description: doc.data().description, 
        }));

        if (fetchedData.length > 0) setIndustries(fetchedData);
      } catch (error) {
        console.error("Error fetching industries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    if (industries.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % industries.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [industries]);

  if (loading || industries.length === 0) return null;

  const currentItem = industries[currentIndex];

  return (
    /* Scaled down py-10 to py-8 */
    <section className="px-4 py-8 md:px-12 bg-white ">
      <div className="max-w-7xl mx-auto">
        <div 
          /* Scaled down height from 420px to 320px and rounded corners from 3rem to 1.5rem */
          className="relative w-full h-[300px] md:h-[320px] rounded-2xl md:rounded-3xl overflow-hidden flex flex-col items-center justify-center text-center px-6 transition-all duration-1000"
          style={{
            backgroundImage: `url(${industyImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/90 via-[#2563eb]/85 to-[#1e3a8a]/90 mix-blend-multiply" />

          {/* CONTENT */}
          <div className="relative z-10 max-w-3xl w-full">
            {/* Scaled down text-6xl to text-3xl/4xl */}
            <h2 className="text-3xl lg:text-5xl  font-bold text-white mb-1 tracking-tight">
              Industries We Serve
            </h2>

            {/* DYNAMIC TITLE: Scaled down height and font size */}
            <div className="h-12 mt-4 flex items-center justify-center mb-1">
               <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white drop-shadow-md transition-all duration-500">
                {currentItem.title}
              </h3> 
            </div>

            {/* DESCRIPTION: Scaled down text-md to text-sm/base */}
            <p className="text-white/90 text-base md:text-lg leading-relaxed mb-6 max-w-xl mx-auto font-normal">
              Explore the range of services designed to meet your needs. From expert video production to strategic marketing, we provide tailored solutions that drive results.
            </p>

            {/* BUTTON: Scaled down padding */}
            <button
              onClick={() => navigate("/pricing")}
              className="bg-white cursor-pointer text-[#1e40af] text-sm font-bold px-8 py-2.5 rounded-lg shadow-lg 
                         hover:bg-opacity-90 transition-all active:scale-95"
            >
              Get Estimate
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesServe;