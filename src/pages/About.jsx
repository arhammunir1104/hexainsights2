import React, { useEffect, useState } from 'react'
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Reloader from '../components/Reloader/Reloader';
import Banner from '../components/about/Banner';
import AboutContent from '../components/about/AboutContent';
import AboutContent2 from '../components/about/AboutContent2';
import CorporateValuesComponent from '../components/about/CorporateValues';
import Team from '../components/homepage/Team';
import Contact from '../components/homepage/Contact';
import IndustriesServe from '../components/about/IndustriesServe';
import ServicesServe from '../components/about/ServicesServe';

function About() {
    const [isReload, setIsReload] = useState(true);
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Use a try-catch inside the effect or check for existence
        const unsub = onSnapshot(doc(db, "AboutUsDB", "content"), (docSnap) => {
            if (docSnap.exists()) {
                setAboutData(docSnap.data());
                setIsReload(false);
            } else {
                console.error("No such document in aboutDB!");
                // Optionally stop reloader even if data fails
                setIsReload(false); 
            }
        }, (error) => {
            console.error("Firestore error:", error);
            setIsReload(false);
        });

        return () => unsub();
    }, []);

    // Ensure we don't render children until aboutData is fully populated
    if (isReload || !aboutData) return <Reloader />;

    return (
        <>
            <Banner 
                data={aboutData?.BannerSection || {}}
            />
 
            {/* Pass empty objects/arrays as fallbacks to prevent errors in children */}
            <AboutContent 
                data={aboutData?.subSection || {}} 
            />
             
            <AboutContent2 
                data={aboutData?.cards || []} 
            />

            <CorporateValuesComponent 
                data={aboutData?.corporateSection || {}} 
            />

            <ServicesServe />

            <IndustriesServe  />

            <Team />
            <Contact />
        </>
    )
}

export default About