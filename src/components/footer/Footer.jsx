import React, { useState, useEffect } from 'react';
import { db } from "../../firebase"; 
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { NavLink } from 'react-router-dom';

// Icons
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
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

    const socialIconMap = {
        linkedin: <LinkedInIcon sx={{ fontSize: 16 }} />,
        facebook: <FacebookIcon sx={{ fontSize: 16 }} />,
        instagram: <InstagramIcon sx={{ fontSize: 16 }} />,
        twitter: <TwitterIcon sx={{ fontSize: 16 }} />,
        youtube: <YouTubeIcon sx={{ fontSize: 16 }} />,
    };

    if (!footerData) return null;

    return (
        <footer className="bg-white py-12 border-t border-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                {/* GRID ADJUSTMENT: 
                   Changed lg:grid-cols-12 to ensure 5 columns fit in 1 row.
                   Column spans updated to: 3 + 2 + 2 + 2 + 3 = 12 
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-4">
                    
                    {/* 1. Left Section: Branding & Contact (Spans 3) */}
                    <div className="lg:col-span-3 flex flex-col">
                        <NavLink to="/">
                            <img src="/logo.png" alt="Logo" className="h-8 w-auto mb-2" />
                        </NavLink>
                        
                        <div className="mt-4 space-y-2.5">
                            {footerData.phoneNo?.map((phone, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
                                    <WhatsAppIcon sx={{ fontSize: 16 }} className="text-blue-600" />
                                    <span className="text-[13px] font-medium">{phone}</span>
                                </div>
                            ))}
                            {footerData.email?.map((email, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">
                                    <EmailIcon sx={{ fontSize: 16 }} className="text-blue-600" />
                                    <span className="text-[13px] font-medium">{email}</span>
                                </div>
                            ))}

                            <div className="pt-4 flex gap-2">
                                {footerData.socialLinks && Object.entries(footerData.socialLinks).map(([key, link]) => (
                                    <a key={key} href={link} target="_blank" rel="noopener noreferrer"
                                        className="w-7 h-7 border border-slate-100 rounded-md flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300">
                                        {socialIconMap[key]}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 2. Locations (Spans 2) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[#002b80] font-bold text-sm mb-5 uppercase tracking-wider">Locations</h4>
                        <div className="space-y-3">
                            {footerData.address?.map((loc, i) => (
                                <a key={i} href={loc.mapLink} target="_blank" rel="noopener noreferrer" 
                                   className="block text-[13px] text-slate-500 hover:text-blue-600 leading-relaxed transition-colors">
                                    {loc.text}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 3. Company (Spans 2) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[#002b80] font-bold text-sm mb-5 uppercase tracking-wider">Company</h4>
                        <ul className="space-y-2.5">
                            {footerData?.companySection.map((s, i) => (
                                <li key={i}>
                                    <NavLink to={s.link} className="text-[13px] text-slate-500 hover:text-blue-600 transition-colors">{s.title}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. Services (Spans 2) */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[#002b80] font-bold text-sm mb-5 uppercase tracking-wider">Services</h4>
                        <ul className="space-y-2.5">
                            {services.map((s, i) => (
                                <li key={i}>
                                    <NavLink to={s.link} className="text-[13px] text-slate-500 hover:text-blue-600 transition-colors">{s.name}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 5. Industries (Spans 3) */}
                    <div className="lg:col-span-2 lg:ml-8  ">
                        <h4 className="text-[#002b80]  font-bold text-sm mb-5 uppercase tracking-wider">Industries</h4>
                        <ul className="space-y-2.5">
                            {industries.map((ind, i) => (
                                <li key={i}>
                                    <NavLink to={ind.link} className="text-[13px] text-slate-500 hover:text-blue-600 transition-colors">{ind.name}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 tracking-wide uppercase font-semibold">
                    <p>© {new Date().getFullYear()} Hexainsights. All Rights Reserved.</p>
                    <div className="flex items-center gap-1">
                        <span>Powered By</span>
                        <span className="text-[#002b80]">Codenthic</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;