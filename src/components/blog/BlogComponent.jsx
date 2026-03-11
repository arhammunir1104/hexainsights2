import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const BlogComponent = ({ data, uploadDate, relatedBlogs = [] }) => {
  console.log(data);
  if (!data) return null;

  useEffect(()=>{
            window.scrollTo(0, 0);

  },[])

   const renderTitle = (fullTitle) => {
    if (!fullTitle) return <span className="text-[#002b80]">DISCOVER OUR BLOGS</span>;
    
    const words = fullTitle.split(" ");
    return (
      <>
        <span className="text-[#002b80]">{words[0]}</span>{" "}
        <span className="text-blue-400 font-medium">{words[1]}</span>{" "}
        <span className="text-[#002b80]">{words.slice(2).join(" ")}</span>
      </>
    );
  };
 
  return (  
    <div className="w-full bg-white ">
      <section className="pt-32 pb-16 px-6 md:px-12 lg:px-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-bold text-[#002b80] leading-[1.1] mb-6 tracking-tight">
            {data?.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-8 leading-relaxed max-w-3xl mx-auto">
            {data?.description}
          </p>
          <div className="flex mt-[10%] flex-col items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-blue-600 uppercase tracking-widest">{renderTitle(data?.subsection?.title || "DISCOVER OUR BLOG")} </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                {uploadDate ? new Date(uploadDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "December 8, 2025"}
            </span>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: SUBSECTION CARDS ================= */}
      {/* ================= SECTION 2: SUBSECTION CARDS ================= */}
      <div className="container mx-auto py-10 px-6 lg:px-16">
        <div className="flex flex-col gap-16">
          {(data?.subsection?.cards || []).map((card, index) => {
            // Determine if the index is even or odd for alternating layout
            const isEven = index % 2 !== 0;

            return (
              <div 
                key={index} 
                className={`flex flex-col gap-8 lg:flex-row items-center lg:items-center ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Image Section */}
                <div className="w-full lg:w-1/2">
                  <img
                    src={card?.icon || "/about/img2.png"}
                    alt={card?.heading || "About Illustration"}
                    className="w-full h-auto rounded-2xl shadow-sm object-cover"
                    onError={(e) => { e.target.src = "/about/img2.png"; }} // Fallback if image fails
                  />
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent mb-2 uppercase tracking-wide">
                    {card?.text}
                  </h3>
                  {/* <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight text-[#002b80]">
                    {card.title}
                  </h2> */}
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    {card?.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= SECTION 3: RELATED BLOGS ================= */}
      {relatedBlogs.length > 0 && (
        <section className="py-24 bg-slate-50/30 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 lg:px-16 text-center">
                <h2 className="text-xl font-bold text-[#002b80] uppercase tracking-[0.2em] mb-16">SEE MORE RELATED BLOGS</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {(relatedBlogs || []).map((blog, idx) => (
                      <NavLink key={idx} to={`/blog/${blog?.originalIndex}`}>

                        <div 
                            className="group flex flex-col bg-white rounded-2xl border border-[#001E74] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            {/* Blog Image */}
                            <div className="relative h-52 overflow-hidden bg-slate-50 border-b border-slate-100">
                                <img 
                                    src={blog?.image || "/blog-placeholder.png"} 
                                    alt={blog?.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => { e.target.src = "/blog-placeholder.png"; }}
                                />
                            </div>

                            {/* Blog Content */}
                            <div className="p-5 flex flex-col flex-grow">
                                {/* Date Line */}
                                <div className="flex items-center justify-end mb-3">
                                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                        {uploadDate ? new Date(uploadDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "December 8, 2025"}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-[#002b80] mb-2 line-clamp-1">
                                    {blog?.title}
                                </h3>
                                <p className="text-slate-500 text-[12px] leading-relaxed mb-6 line-clamp-6 flex-grow">
                                    {blog?.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4">
                                    <NavLink 
                                        to={`/blog/${blog?.originalIndex}`}
                                        className="flex items-center gap-2 text-[#002b80] font-bold text-sm hover:underline"
                                        >
                                        Read More 
                                        <ArrowRight size={16} className="text-blue-600" />
                                    </NavLink>
                                    
                                    {blog?.category && (
                                      <span className="px-4 py-1 bg-slate-100 text-slate-400 text-[9px] font-bold rounded-full">
                                            {blog?.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                                    </NavLink>
                    ))}
                </div>
            </div>
        </section>
      )}
    </div>
  );
};

export default BlogComponent;
