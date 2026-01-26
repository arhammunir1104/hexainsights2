import React, { useState, useEffect } from 'react'
import { db } from "../../firebase"; 
import { doc, getDoc } from "firebase/firestore";

import Navbar from '../navbar/Navbar'
import HomepageHero from './HomepageHero'
import TrustedBy from './TrustedBy'
import About from './About'
import Services from './Service'
import Project from './Project'
import See from './See'
import Faq from './Faq'
import Discover from './Discover'
import Testimonials from './Testimonials'
import Contact from './Contact'
import Team from './Team'
import IndustriesServe from './IndustriesServe';
import TechnologyWorkWith from './TechnologyWorkWith';
import Reloader from '../Reloader/Reloader';
 
function HeroBackground() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        // Fetching the 'homepage' document from 'pages' collection
        const docRef = doc(db, "pages", "homepage");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPageData(docSnap.data());
        setLoading(false);
        } else {
          console.error("No such document in Firestore!");
        setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  if (loading) {
    return (
      // <div className="min-h-screen flex items-center justify-center bg-white">
      //   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      // </div>
      <Reloader />
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* The EXACT Pink/Blue Ambient Background you wanted */}
      <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b 
        from-[#fbcfe8]/40 via-[#bfdbfe]/30 to-transparent
        blur-3xl opacity-90 pointer-events-none">
      </div>
 
      <div className="relative z-10">
        {/* Passing BannerSection to Hero */}
        <HomepageHero data={pageData?.BannerSection} />
        
        {/* Locations Section usually maps to TrustedBy or a Location grid */}
        <TrustedBy data={pageData?.locationsSection} />
        
        {/* Passing aboutSection to About */}
        <About data={pageData?.aboutSection} />   
        
        {/* Passing servicesWeOfferSection to Services */}
        <Services data={pageData?.servicesWeOfferSection} />
  
        <IndustriesServe />

        {/* These components can either use pageData or their own internal fetch */}
        {/* <Discover /> */}
        <TechnologyWorkWith page="home" />
        <Project />
        <Faq />
        {/* <See /> */}
        <Testimonials />
        <Team />
        <Contact />
      </div>
    </div>
  )
}

export default HeroBackground;