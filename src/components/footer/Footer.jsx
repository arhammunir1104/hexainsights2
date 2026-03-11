import React, { useState, useEffect } from 'react';
import { db } from "../../firebase"; 
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { NavLink } from 'react-router-dom';

// Icons
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
    const [footerData, setFooterData] = useState(null);
    const [services, setServices] = useState([]);
    const [industries, setIndustries] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "FooterDB", "aWcbdEedq9Ui9Rtqlcej"), (docSnap) => {
            if (docSnap.exists()) setFooterData(docSnap.data());
        });

        const fetchData = async () => {
            const servicesSnap = await getDocs(collection(db, "servicesDB"));
            setServices(servicesSnap.docs.map(doc => ({
                name: doc.data().title,
                link: `/services/${doc.data().uid || doc.id}`
            })));

            const industriesSnap = await getDocs(collection(db, "industryDB"));
            setIndustries(industriesSnap.docs.map(doc => ({
                name: doc.data().title,
                link: `/industry/${doc.data().uid || doc.id}`
            })));
        };

        fetchData();
        return () => unsub();
    }, []);

    // Hardcoded items to match mockup exactly
    const mockServices = [
        { name: "Web Development", link: "/services/web-development" },
        { name: "Mobile Development", link: "/services/mobile-development" },
        { name: "UI/UX", link: "/services/ui-ux" }
    ];

    const mockIndustries = [
        { name: "Healthcare", link: "/industry/healthcare" },
        { name: "Fintech", link: "/industry/fintech" },
        { name: "Real Estate", link: "/industry/real-estate" }
    ];

    return (
        <footer className="bg-white py-10 border-t border-slate-50 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
                    
                    {/* 1. Left Section: Branding & Contact */}
                    <div className="lg:col-span-3 flex flex-col">
                        <NavLink to="/">
                            <img src="/logo.png" alt="Hexainsights Logo" className="h-12 w-auto mb-4 object-contain" />
                        </NavLink>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-4 text-slate-500">
                                <div className="p-2 bg-blue-50/50 rounded-lg">
                                    <WhatsAppIcon sx={{ fontSize: 20 }} className="text-[#002b80]" />
                                </div>
                                <span className="text-[14px] font-medium">+92 406306068</span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-slate-500">
                                <div className="p-2 bg-blue-50/50 rounded-lg">
                                    <MailOutlineIcon sx={{ fontSize: 20 }} className="text-[#002b80]" />
                                </div>
                                <span className="text-[14px] font-medium">Info@hexainsights.com</span>
                            </div>

                            <div className="pt-2">
                                <h5 className="text-[14px] font-bold text-[#002b80] mb-2">Follow us on</h5>
                                <div className="flex gap-3">
                                    {[
                                        { icon: <LinkedInIcon sx={{ fontSize: 18 }} />, link: "#" },
                                        { icon: <FacebookIcon sx={{ fontSize: 18 }} />, link: "#" },
                                        { icon: <InstagramIcon sx={{ fontSize: 18 }} />, link: "#" },
                                        { icon: <TwitterIcon sx={{ fontSize: 18 }} />, link: "#" },
                                        { icon: <YouTubeIcon sx={{ fontSize: 18 }} />, link: "#" }
                                    ].map((social, i) => (
                                        <a key={i} href={social.link} 
                                           className="w-9 h-9 rounded-lg border border-slate-100 flex items-center justify-center text-[#002b80] hover:bg-[#002b80] hover:text-white transition-all duration-300">
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Locations */}
                    <div className="lg:col-span-3">
                        <h4 className="text-[#002b80] font-bold text-lg mb-4">Locations</h4>
                        <div className="space-y-2">
                            <div>
                                <p className="text-[14px] text-slate-400 leading-relaxed">
                                    UAE - Al Wahda Street, GIBCA, Dubai
                                </p>
                            </div>
                            <div>
                                <p className="text-[14px] text-slate-400 leading-relaxed">
                                    Pakistan - North Karachi, Sector 9, Karachi
                                </p>
                            </div>
                            {/* Replicated as per image mockup */}
                            <div>
                                <p className="text-[14px] text-slate-400 leading-relaxed">
                                    UAE - Al Wahda Street, GIBCA, Dubai
                                </p>
                            </div>
                            <div>
                                <p className="text-[14px] text-slate-400 leading-relaxed">
                                    Pakistan - North Karachi, Sector 9, Karachi
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Company */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[#002b80] font-bold text-lg mb-4">Company</h4>
                        <ul className="space-y-1.5">
                            {['About Us', 'Services', 'Industries'].map((item) => (
                                <li key={item}>
                                    <NavLink to={`/${item.toLowerCase().replace(' ', '-')}`} 
                                             className="text-[14px] text-slate-400 hover:text-[#002b80] transition-colors">
                                        {item}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. Services */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[#002b80] font-bold text-lg mb-4">Services</h4>
                        <ul className="space-y-1.5">
                            {mockServices.map((s) => (
                                <li key={s.name}>
                                    <NavLink to={s.link} className="text-[14px] text-slate-400 hover:text-[#002b80] transition-colors">
                                        {s.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 5. Industries */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[#002b80] font-bold text-lg mb-4">Industries</h4>
                        <ul className="space-y-1.5">
                            {mockIndustries.map((ind) => (
                                <li key={ind.name}>
                                    <NavLink to={ind.link} className="text-[14px] text-slate-400 hover:text-[#002b80] transition-colors">
                                        {ind.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-4 border-t flex justify-center items-center border-slate-50">
                    <p className="text-[13px] text-slate-400 font-medium">
                        Copyright Hexainsights. All Rights Reserved. Powered By Codenthic
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;