import React from 'react';
import { NavLink } from 'react-router-dom';

const Discover = () => {
  return (
    <section className="relative w-full py-16 md:py-24 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-[2fr_1.5fr] items-center gap-12 lg:gap-20">

        {/* Left Side: Circular Tech Stack Diagram */}
        <div className="relative flex justify-center items-center w-full max-w-[500px] mx-auto md:order-1">
          {/* Main laptop image */}
          <div className="relative z-10 w-full h-auto rounded-xl overflow-hidden ">
            <img 
              src="/home-discover/img1.png" 
              alt="Laptop displaying web app design" 
              className="w-full h-full object-cover" 
            />
          </div>


        </div>

        {/* Right Side: Text and Button Section */}
        <div className="text-center md:text-left md:order-2">
          <h2 className="text-3xl md:text-4xl font-[Quicksand] lg:text-4xl font-bold text-[#070778] mb-4">
            TECHNOLOGY EXPERTISE
          </h2>
          <h3 className="text-xl md:text-2xl lg:text-2xl font-[Quicksand] font-bold text-gray-800 mb-6">
            We Work with the Latest Technologies
          </h3>

          <div className="space-y-4 font-[Quicksand] text-gray-700 text-lg">
            <p><span className="font-bold text-gray-900">Front-End:</span> React.js, Next.js, Vue.js, Angular</p>
            <p><span className="font-bold text-gray-900">Back-End:</span> Node.js, PHP, Laravel</p>
            <p><span className="font-bold text-gray-900">CMS & E-Commerce:</span> WordPress, Shopify, Magento</p>
            <p><span className="font-bold text-gray-900">Cloud & DevOps:</span> AWS, Azure, Google Cloud</p>
          </div>
            <a
  href="#contact" >  

          <button className="mt-8 px-8 hover:from-blue-900 scroll-auto  hover:to-blue-700 duration-150 transition-all py-4 cursor-pointer bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white font-semibold rounded-[10px] shadow-lg hover:shadow-xl transition-all duration-300">
            Discover Our Tech Stack →
          </button>
            </a>
        </div>
      </div>
    </section>
  );
};

export default Discover;
