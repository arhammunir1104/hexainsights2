import React from 'react';
import { NavLink } from 'react-router-dom';

// Reusable SVG assets for the CTA component
const GlobeIcon = () => (
  <img src="/home-CTA/img1.png" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="top-9/2  text-blue-500" />
   
);

const ArrowLineSVG = () => (
  <img src="/home-CTA/img2.png" width="100" height="100" className="absolute top-8/2 left-[-4%] w-[100%] h-[100%]  -translate-y-1/2" /> 
    
);

const CTA = () => {
  return (
    <section className="relative w-full py-16 md:py-24 font-sans overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-[#292929] p-8 md:p-16 rounded-3xl shadow-xl flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-12">
          {/* Left Side: Text and CTA */}
          <div className="flex-1 text-center lg:text-left relative flex flex-col items-center lg:items-start">
            <div className="relative mb-4">
              <GlobeIcon />
              <ArrowLineSVG />
            </div>
            <h2 className="text-2xl font-[Quicksand] md:text-3xl font-bold text-white mb-2">
              Final CTA - Convert Visitors into Leads
            </h2>
            <p className="text-sm font-[Quicksand] md:text-base text-white mt-3 mb-6">
              Let's Build Something Amazing Together
            </p>
            {/* <button className="relative z-10 px-6 py-3 rounded-[10px] text-white font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-700 to-blue-500">
              Discover Our Tech Stack
              <span className="ml-2">→</span>
            </button> */}
            <NavLink to="#">  

          <button className="mt-8 px-8 hover:from-blue-900 hover:to-blue-700 duration-150 transition-all py-4 cursor-pointer bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white font-semibold rounded-[10px] shadow-lg hover:shadow-xl transition-all duration-300">
            Discover Our Tech Stack →
          </button>
            </NavLink>
          </div>

          {/* Right Side: Contact Form */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <form className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full bg-transparent border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 pb-2"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 pb-2"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Prv Type"
                  className="w-full bg-transparent border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 pb-2"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Budget"
                  className="w-full bg-transparent border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 pb-2"
                />
              </div>
              <div>
                <textarea
                  placeholder="Message"
                  rows="3"
                  className="w-full bg-transparent border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 pb-2 resize-none"
                ></textarea>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
