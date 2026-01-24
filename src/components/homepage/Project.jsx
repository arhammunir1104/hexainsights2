import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { db } from "../../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import arrowImage from "/home-content/projectArrow.png"
import projectCard from "/home-content/projectCard.png"

const ProjectsDelivered = ({ data }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsRef = collection(db, "featuredProjectsDB");
        const q = query(projectsRef, where("display", "array-contains", "home"));
        const querySnapshot = await getDocs(q);

        const fetchedProjects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const renderTitle = (fullTitle) => {
    const words = (fullTitle || "Projects We Delivered").split(" ");
    return (
      <div className="relative inline-block">
        {/* Decorative Arrow - Scaled down from w-24 to w-16 */}
        <div className="absolute -top-6 -left-8 md:-top-10 md:-left-12 w-12 md:w-16 lg:w-20 pointer-events-none z-20">
          <img 
            src={arrowImage} 
            alt="decorative arrow" 
            className="w-full h-auto object-contain opacity-80"
          />
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight mb-2 text-center z-10 relative">
          <span className="text-[#002b80]">{words[0]}</span>{" "}
          <span className="text-[#3b82f6] font-medium">{words[1]}</span>{" "}
          <span className="text-[#002b80]">{words.slice(2).join(" ")}</span>
        </h2>
      </div>
    );
  };

  if (loading) return null;

  return (
    <section className="relative py-16 lg:py-20 bg-white overflow-hidden">
      
      {/* Background Glow - Scaled down blur and size */}
      <div className="absolute -top-10 -right-10 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-blue-100/50 rounded-full blur-[80px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          {renderTitle(data?.title)}
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto mt-3 leading-relaxed">
            {data?.description || "Providing cutting-edge digital solutions tailored to your business needs."}
          </p>
        </div>

        {/* Grid - Adjusted gap for a tighter look */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {projects.map((project, index) => (
           <NavLink to={`/project/${project.uid}`} key={project.id || index}>
            <div 
              className="group relative flex flex-col bg-white rounded-xl overflow-hidden transition-all duration-500 cursor-pointer border border-slate-50 hover:shadow-xl"
            >
              {/* TOP IMAGE AREA - Aspect square remains but card rounded-xl is cleaner */}
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={project.image?.url} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                   {project.keywords?.slice(0, 3).map((word, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-white/90 backdrop-blur-md text-[8px] font-bold text-slate-700 rounded-sm uppercase tracking-wider">
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              {/* LOWER DESCRIPTION AREA - Reduced padding */}
              <div className="relative p-4 flex flex-col flex-grow transition-all duration-500 bg-white group-hover:bg-[#1c1c1c]">
                
                <div 
                  className="absolute inset-0 opacity-[0.1] grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 bg-cover bg-center pointer-events-none"
                  style={{ backgroundImage: `url(${projectCard})` }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Title - reduced from text-sm to text-[13px] and reduced mb */}
                  <h4 className="text-[13px] font-bold text-slate-700 group-hover:text-white mb-4 leading-tight transition-colors duration-300">
                    {project.shortDescription || project.title}
                  </h4>

                  <div className="mt-auto">
                    {/* Circle Button - Scaled down from w-10 to w-8 */}
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-[#333] text-white group-hover:bg-blue-600 transition-all duration-300 shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-1 w-full bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsDelivered;