import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const menus = {
    Services: [
      "Enterprise Software Development",
      "Mobile App Development",
      "Dedicated Development Team",
      "IT Consulting",
      "Digital Transformation",
      "UI / UX Design",
      "QA & Testing",
      "Design LAB",
    ],
    Industries: ["Finance", "Healthcare", "E-commerce", "Education"],
    "Our Work": ["Case Studies", "Portfolio"],
    "About Us": ["Company", "Team", "Careers"],
    Insight: ["Blog", "Resources"],
  };

  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-white rounded-xl shadow-md mx-auto max-w-7xl mt-5">
      {/* Logo */}
      <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
        <img
          src="https://cdn-icons-png.flaticon.com/512/5968/5968282.png"
          alt="logo"
          className="h-8 w-8"
        />
        Hexainsights
      </div>

      {/* Nav Items */}
      <div className="flex items-center gap-8 font-medium text-gray-700">
        {Object.keys(menus).map((menu, idx) => (
          <div
            key={idx}
            className="relative group"
            onMouseEnter={() => setOpenMenu(menu)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="flex items-center gap-1 hover:text-blue-600">
              {menu} <ChevronDown size={16} />
            </button>

            {/* Dropdown */}
            {openMenu === menu && (
              <div className="absolute top-10 left-0 w-64 bg-white shadow-lg rounded-lg p-4 grid grid-cols-2 gap-3">
                {menus[menu].map((item, i) => (
                  <div
                    key={i}
                    className="hover:text-blue-600 text-sm cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <button className="px-5 py-2 rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition">
          Contact Us
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
