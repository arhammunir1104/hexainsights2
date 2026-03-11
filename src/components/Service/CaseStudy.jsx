import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { db } from "../../firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";

const BlogCard = ({ data }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'RECENT';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'RECENT';
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).toUpperCase();
    } catch (e) {
      return 'RECENT';
    }
  };

  return (
    <NavLink to={`/blog/${data?.id}`} className="block">
      {/* Reduced height from 400px to 320px and padding from p-10 to p-8 */}
      <div className="relative p-6 md:p-8 rounded-xl bg-[#0a0a0a] h-[320px] overflow-hidden group transition-all duration-500 transform hover:scale-[1.01] shadow-lg border border-white/5">
        
        {data?.bannerImage?.url ? (
          <img 
            src={data.bannerImage.url} 
            alt={data?.title || "Case Study"}
            // Reduced base opacity for a subtler look
            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.background = 'black';
              e.target.src = "/placeholder-blog.png";
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-50"></div>
        )}

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase mb-3">
              {formatDate(data?.uploadDate)}
            </p>

            {/* Scaled down heading from text-3xl to text-xl/2xl */}
            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-3 transition-colors duration-300 group-hover:text-blue-400">
              {data?.title}
            </h3>

            {/* Refined description text size */}
            <p className="text-[13px] md:text-sm text-gray-400 leading-relaxed max-w-md line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">
              {data?.description}
            </p> 
          </div>
          
          <div className="flex items-center text-xs font-bold text-white uppercase tracking-widest group-hover:text-blue-400 transition-all duration-300">
            View Insight 
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        
        {/* Subtle accent border at bottom */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-blue-600 group-hover:w-full transition-all duration-500" />
      </div>
    </NavLink>
  );
};

const CaseStudy = ({ page, header }) => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        setLoading(true);
        const insightsRef = collection(db, 'caseStudiesDB');
        const q = query(insightsRef, where('display', 'array-contains', page));
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCaseStudies(fetchedData);
      } catch (error) {
        console.error("Error fetching case studies:", error);
      } finally {
        setLoading(false);
      }
    };
    if (page) fetchCaseStudies();
  }, [page]);

  const renderTitle = (fullTitle) => {
    const words = (fullTitle || "Insights & Case Studies").split(" ");
    return (
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center relative ">
        <span className="text-[#002b80]">{words[0]}</span>{" "}
        <span className="text-[#3b82f6] font-medium">{words[1]}</span>{" "}
        <span className="text-[#002b80]">{words.slice(2).join(" ")}</span>
      </h2>
    );
  };

  return (
    <section className="py-12 lg:py-20 bg-white ">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center text-3xl lg:text-5xl  mb-12">
          {renderTitle(header?.heading)}
          <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto mt-4 leading-relaxed">
            {header?.description || "In-depth looks at how we solve complex digital challenges."}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 opacity-20" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {caseStudies.length > 0 ? (
              caseStudies.map((item) => (
                <BlogCard key={item.id} data={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-16 border border-dashed border-slate-100 rounded-xl">
                <p className="text-slate-400 text-sm italic">No insights found for this section.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudy;