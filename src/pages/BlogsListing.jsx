import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { NavLink } from 'react-router-dom';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import ContactCard from '../components/contact/ContactCard';
import Reloader from '../components/Reloader/Reloader';

const BLOGS_COLLECTION = "hexainsighs-blog";
const BLOGS_PER_PAGE = 15;

const BlogsListing = () => {
    const [blogDoc, setBlogDoc] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                window.scrollTo(0, 0);
                const querySnapshot = await getDocs(collection(db, BLOGS_COLLECTION));
                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();
                    setBlogDoc(data);
                    setBlogs(data.subsection?.blogs || []);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);


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

    if (loading) return <Reloader />;

    // Pagination Logic
    const indexOfLastBlog = currentPage * BLOGS_PER_PAGE;
    const indexOfFirstBlog = indexOfLastBlog - BLOGS_PER_PAGE;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 500, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* Banner Section */}
            <section className="relative pt-40 pb-12 px-6 lg:px-12 bg-white overflow-hidden">
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-400/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-pink-400/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#002b80] mb-6 leading-[1.1] tracking-tight">
                        {blogDoc?.banner?.title || "Driving Digital Transformation\nWith Purpose and Precision"}
                    </h1>
                    <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-500 leading-relaxed mb-6">
                        {blogDoc?.banner?.description || "Explore our latest insights, success stories, and expert perspectives on technology and innovation."}
                    </p>
                </div>
            </section> 

            {/* Blog Grid Section */}
            <section className="py-14 px-6 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-bold  text-blue-600 uppercase  mb-4"> {renderTitle(blogDoc?.subsection?.title || "DISCOVER OUR BLOG")}</h2>
                      
                    </div>

                    {blogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {(currentBlogs || []).map((blog, index) => (
                                <NavLink key={indexOfFirstBlog + index} to={`/blog/${indexOfFirstBlog + index}`}>

                                <div 
                                    className="group flex flex-col bg-white rounded-2xl h-[400px] md:h-[450px] border border-[#001E74] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
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
                                            <span className="text-[10px] text-slate-400 font-medium font-[]">
                                                {blogDoc?.uploadDate ? new Date(blogDoc.uploadDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "December 8, 2025"}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-[#002b80] mb-2 line-clamp-1">
                                            {blog?.title}
                                        </h3>
                                        <p className="text-slate-500 text-[12px] leading-relaxed mb-6 line-clamp-6 flex-grow">
                                            {blog?.description ? (blog.description.length > 100 ? blog.description.slice(0, 100) + "..." : blog.description) : ""}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-4">
                                            <div 
                                                className="flex items-center gap-2 text-[#002b80] font-bold text-sm hover:underline"
                                                >
                                                Read More 
                                                <ArrowRight size={16} className="text-blue-600" />
                                            </div>
                                            
                                            {blog?.category && (
                                                <span className="px-4 py-1 bg-slate-100 text-slate-400 text-[9px] font-bold rounded-full">
                                                    {blog.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-[4rem]">
                            <p className="text-slate-400 font-medium">No blogs found in our library.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-20 flex justify-center items-center gap-3">
                            <button 
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-100 text-slate-400 hover:border-blue-600 hover:text-blue-600 transition-all disabled:opacity-30 disabled:hover:border-slate-100 disabled:hover:text-slate-400 cursor-pointer"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                                        currentPage === i + 1 
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                            : 'bg-white border border-slate-100 text-slate-500 hover:border-blue-600 hover:text-blue-600'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button 
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-100 text-slate-400 hover:border-blue-600 hover:text-blue-600 transition-all disabled:opacity-30 disabled:hover:border-slate-100 disabled:hover:text-slate-400 cursor-pointer"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <ContactCard />
        </div>
    );
};

export default BlogsListing;
