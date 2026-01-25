import React, { useState, useEffect } from "react";
import { ChevronDown, X, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { db } from "../../firebase"; 
import { collection, getDocs } from "firebase/firestore";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  
  const [navData, setNavData] = useState({
    Services: [],
    Industries: []
  });

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const servicesSnap = await getDocs(collection(db, "servicesDB"));
        const servicesList = servicesSnap.docs.map(doc => ({
          name: doc.data().title,
          icon: doc.data().icon?.url || "https://cdn-icons-png.flaticon.com/512/2620/2620861.png",
          link: `/services/${doc.data().uid || doc.id}`
        }));

        const industriesSnap = await getDocs(collection(db, "industryDB"));
        const industriesList = industriesSnap.docs.map(doc => ({
          name: doc.data().title,
          icon: doc.data().icon?.url || "https://cdn-icons-png.flaticon.com/512/3135/3135706.png",
          link: `/industry/${doc.data().uid || doc.id}`
        }));

        setNavData({ Services: servicesList, Industries: industriesList });
      } catch (error) {
        console.error("Error fetching navbar data:", error);
      }
    };
    fetchNavData();
  }, []);

  return (
    <nav className="absolute top-0 left-0 right-0 z-[999] flex justify-between items-center mx-auto px-6 py-4 max-w-7xl bg-transparent">
      
      {/* Logo - Scaled down height */}
      <div className="flex items-center">
        <NavLink to="/" className="cursor-pointer">
          <img src="/logo.png" alt="Hexainsights" className="h-8 md:h-9 w-auto object-contain" />
        </NavLink>
      </div>

      {/* Desktop Menu - Scaled down gap and text size */}
      <div className="hidden lg:flex items-center gap-6 font-medium text-sm text-slate-800">
        <NavLink to="/" className="hover:text-blue-600 transition-colors">Home</NavLink>
        
        {Object.keys(navData).map((menu) => (
          <div
            key={menu}
            className="relative py-2 group" 
            onMouseEnter={() => setOpenMenu(menu)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="flex items-center gap-1 hover:text-blue-600 transition-all cursor-pointer outline-none">
              {menu} 
              <ChevronDown size={14} className={`transition-transform duration-300 ${openMenu === menu ? 'rotate-180 text-blue-600' : ''}`} />
            </button>

            {/* Dropdown - Reduced width and padding */}
            {openMenu === menu && (
              <div className="absolute top-full right-0 pt-2 w-[480px] z-[1000] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-5">
                  <h3 className="text-[#002b80] font-bold text-xs mb-4 px-2 border-l-3 border-blue-600 uppercase tracking-widest">
                    {menu}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {navData[menu].map((item, i) => (
                      <NavLink 
                        key={i} 
                        to={item.link}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-blue-50 hover:bg-blue-50/50 group transition-all"
                      >
                        <div className="w-8 h-6 rounded bg-slate-100 flex-shrink-0 overflow-hidden">
                          <img src={item.icon} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-[13px] font-semibold text-slate-600 group-hover:text-blue-700 truncate">
                          {item.name}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <NavLink to="/about" className="hover:text-blue-600 transition-colors">About Us</NavLink>

        {/* Button - Reduced padding and text size */}
        <NavLink to="/pricing" className="ml-2">
          <button className="px-6 py-2.5 bg-gradient-to-r from-[#003eb3] to-[#0072ff] hover:shadow-lg hover:shadow-blue-500/30 text-white text-sm font-bold rounded-lg transition-all duration-300 active:scale-95 cursor-pointer border border-white/10">
            Get Our Pricing
          </button>
        </NavLink>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden">
        <button onClick={() => setDrawerOpen(true)} className="p-2 text-slate-800 cursor-pointer">
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Drawer - Scaled text and padding */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[1001] bg-slate-900/40 backdrop-blur-sm lg:hidden">
          <div className="absolute right-0 top-0 h-full w-[80%] max-w-xs bg-white p-5 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <img src="/logo.png" alt="logo" className="h-7 object-contain" />
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-full bg-slate-100 text-slate-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-1 overflow-y-auto">
              <NavLink to="/" onClick={() => setDrawerOpen(false)} className="font-semibold text-base p-2.5 text-slate-800">Home</NavLink>
              
              {Object.keys(navData).map((menu) => (
                <div key={menu}>
                  <button 
                    onClick={() => setOpenSubMenu(openSubMenu === menu ? null : menu)}
                    className={`flex justify-between w-full font-semibold text-base p-2.5 ${openSubMenu === menu ? 'text-blue-700' : 'text-slate-700'}`}
                  >
                    {menu} <ChevronDown size={18} className={`transition-transform duration-300 ${openSubMenu === menu ? 'rotate-180' : ''}`} />
                  </button>
                  {openSubMenu === menu && (
                    <div className="flex flex-col gap-1 px-2 pb-2">
                      {navData[menu].map((item, i) => (
                        <NavLink key={i} to={item.link} onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-slate-700 text-sm font-semibold">
                          <img src={item.icon} className="w-6 h-4 object-cover rounded shadow-sm" alt=""/>
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <NavLink to="/about" onClick={() => setDrawerOpen(false)} className="font-semibold text-base p-2.5 text-slate-800">About Us</NavLink>
              
              <NavLink to="/pricing" onClick={() => setDrawerOpen(false)} className="mt-6">
                <button className="w-full py-3.5 bg-[#003eb3] text-white rounded-xl text-sm font-bold">
                  Get Our Pricing
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;