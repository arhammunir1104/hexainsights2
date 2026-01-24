import React, { useEffect, useState } from 'react'
import HeroBackground from '../components/homepage/HeroBackground'
import Reloader from '../components/Reloader/Reloader';
import Banner from '../components/contact/Banner';
import ContactCard from '../components/contact/ContactCard';
import Contact from '../components/homepage/Contact';

import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

function ContactPage() {
    const [isReload, setIsReload] = useState(true);

    const [contactData, setContactData] = useState(null);


     useEffect(() => {
        setIsReload(true)
            window.scrollTo(0, 0);

            const unsub = onSnapshot(doc(db, "contactPageDB", "main"), (docSnap) => {
              if (docSnap.exists()) {
                  const data = docSnap.data();
                  // Only pick the BannerSection to update your state
                  if (data?.BannerSection) {
                      setContactData(data.BannerSection);
                  }
                  
                  setIsReload(false);
              } else {
                  console.error("No such document in contactPageDB!");
                  setIsReload(false); 
              }
          }, (error) => {
              console.error("Firestore error:", error);
              setIsReload(false);
          });

          return () => unsub();
        }, []);

         


  return (
     <>
    {isReload?
    <Reloader/>
    :
    <>
    
    <Banner data={contactData} />
    {/* <ContactCard  /> */}
    <Contact />
    
    </>
    }
    </>
  )
}

export default ContactPage
