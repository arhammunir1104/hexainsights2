import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { db } from "../../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import arrowImage from "/home-content/projectArrow.png"
import projectCard from "/home-content/projectCard.png"

const ProjectsDelivered = ({ header, page }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => { 
      try {
        const projectsRef = collection(db, "featuredProjectsDB");
        const q = query(projectsRef, where("display", "array-contains",page));
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
        {/* 1) ARROW POSITIONED VERY CLOSE TO TITLE */}
        <div className="absolute -top-8 -left-12 md:-top-12 md:-left-16 w-16 md:w-24 pointer-events-none z-20">
          <img 
            src={arrowImage} 
            alt="decorative arrow" 
            className="w-full h-auto object-contain"
          />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-center z-10 relative">
          <span className="text-[#002b80]">{words[0]}</span>{" "}
          <span className="text-[#3b82f6] font-medium">{words[1]}</span>{" "}
          <span className="text-[#002b80]">{words.slice(2).join(" ")}</span>
        </h2>
      </div>
    );
  };

  if (loading) return null;

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      
      {/* 2) BLUE GRADIENT SHADOW IN TOP RIGHT CORNER */}
      <div className="absolute -top-10 -right-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-100/70 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          {renderTitle(header?.title)}
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
            {header?.description || "Providing cutting-edge digital solutions tailored to your business needs."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
           <NavLink to={`/project/${project.uid}`}>
            <div 
              key={project.id || index}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer border border-transparent hover:shadow-2xl"
            >
              {/* TOP IMAGE AREA */}
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={project.image?.url} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                   {project.keywords?.slice(0, 3).map((word, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/80 backdrop-blur-md text-[9px] font-bold text-slate-600 rounded uppercase">
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              {/* LOWER DESCRIPTION AREA */}
              {/* 3) HOVER COLOR CHANGE TO GRAY (#1c1c1c) */}
              <div className="relative p-6 flex flex-col flex-grow transition-all duration-500 bg-white group-hover:bg-[#1c1c1c]">
                
                {/* 3) STATIC IMAGE: GRAY (Normal) -> NORMAL COLOR (Hover) */}
                <div 
                  className="absolute inset-0 opacity-[0.15] grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 bg-cover bg-center pointer-events-none"
                  style={{ backgroundImage: `url(${projectCard})` }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <h4 className="text-sm font-bold text-slate-700 group-hover:text-white mb-6 leading-snug transition-colors duration-300">
                    {project.shortDescription || project.title}
                  </h4>

                  <div className="mt-auto">
                    <button 
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-[#333] text-white group-hover:bg-blue-600 transition-all duration-300 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom blue bar reveals only on hover */}
              <div className="h-1.5 w-full bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsDelivered;