import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

import Banner from '../components/Industry/Banner';
import Project from '../components/Industry/Project';
import IndustryContent from '../components/Industry/IndustryContent';
import HireContent from '../components/Industry/HireContent';
import ServiceStaffComponent from '../components/Industry/ServiceStaffComponent';
import Team from '../components/homepage/Team';
import Reloader from '../components/Reloader/Reloader';
import Contact from '../components/homepage/Contact';
import ServicesContent from '../components/Service/ServiceContent'
import ServicesServe from '../components/about/ServicesServe';


function IndustryPage() {
  const { uid } = useParams(); // Fetches the document ID (e.g., 'Finance', 'Tech')
  const navigate = useNavigate();
  
  const [industryData, setIndustryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndustryData = async () => {
      if (!uid) return;
        window.scrollTo(0, 0);

      try {
        setLoading(true);
        // Direct fetch from industryDB using the UID from params
        const docRef = doc(db, "industryDB", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setIndustryData(docSnap.data());
        } else {
          console.error("Industry not found:", uid);
          navigate('/'); // Redirect if industry doesn't exist
        }
      } catch (error) {
        console.error("Error fetching industry:", error);
      } finally {
        // Slight delay to ensure smooth transition
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchIndustryData();
    window.scrollTo(0, 0);
  }, [uid, navigate]);

  if (loading) return <Reloader />;

  return (
    <>
      {/* Banner dynamically uses bannerData from Firestore */}
      <Banner 
        data={industryData?.bannerData} 
      />

       
      <ServicesContent data={industryData?.subSection}  />

      {/* Passing data to IndustryContent for the specific layout in image_13d0b6.png */}
      <ServicesServe page={industryData?.title} />
      {/* Projects filtered by the industry uid */}
      <Project header={industryData?.projectSection} page={industryData?.title}  /> 

      {/* <HireContent data={industryData?.hireSection} /> */}

      {/* ServiceStaff filtered by industry uid as requested */}
      <ServiceStaffComponent pageUid={uid} />

      <Team />
      <Contact />
    </>
  );
}

export default IndustryPage;