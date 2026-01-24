import React from 'react';

const HireContent = () => {
  return (
    <div className="bg-white text-gray-800 font-[Quicksand] p-8 lg:p-16">
      {/* Top Section */}
      <div className="text-left mb-8 lg:mb-12">
        <p className="text-black uppercase font-semibold text-sm mb-2">
          Expertise
        </p>
        <h1 className="text-2xl lg:text-3xl font-bold max-w-3xl  leading-tight">
          Hire Permanent and Remote Developers
        </h1>
        <p className="text-black max-w-[50%] mt-4 leading-relaxed">
          From full-time remote engineering teams to hourly contractors, work with remote devs as needed
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {/* Dedicated Teams */}
        <div className="flex flex-col  items-start text-left p-6">
          <img src="/service/link1.png" alt="Dedicated Teams Icon" className="w-18 h-18  bg-[#86b1eb] rounded-[10px] p-4 mb-4"/>
          <h3 className="text-lg font-bold mb-2">Dedicated Teams</h3>
          <p className="text-gray-500">Find your next team member</p>
        </div>

        {/* Staff Augmentation */}
        <div className="flex flex-col  items-start text-left p-6">
          <img src="/service/link2.png"alt="Staff Augmentation Icon" className="w-18 h-18  bg-[#86b1eb] rounded-[10px] p-4 mb-4"/>
          <h3 className="text-lg font-bold mb-2">Staff Augmentation</h3>
          <p className="text-gray-500">Build a distributed development team</p>
        </div>

        {/* Software Outsourcing */}
        <div className="flex flex-col  items-start text-left p-6">
          <img src="/service/link3.png" alt="Software Outsourcing Icon" className="w-18 h-18  bg-[#86b1eb] rounded-[10px] p-4 mb-4"/>
          <h3 className="text-lg font-bold mb-2">Software Outsourcing</h3>
          <p className="text-gray-500">End-to-End Software Development Outsourcing Solutions</p>
        </div>

        {/* Remote Office */}
        <div className="flex flex-col items-start text-left p-6">
          <img src="/service/link4.png"alt="Remote Office Icon" className="w-18 h-18  bg-[#86b1eb] rounded-[10px] p-4 mb-4" />
          <h3 className="text-lg font-bold mb-2">Remote Office</h3>
          <p className="text-gray-500">Open your own remote development center and grow your business</p>
        </div>
      </div>
    </div>
  );
};

export default HireContent;
