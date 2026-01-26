import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

import Banner from '../components/Service/Banner'
import ServicesContent from '../components/Service/ServiceContent'
import Project from '../components/Service/Project'
import Service from '../components/homepage/Service'
import TechnologyComponent from '../components/Service/TechnologyComponent'
import Reloader from '../components/Reloader/Reloader'
import ServiceStaffComponent from '../components/Industry/ServiceStaffComponent'
import CaseStudy from '../components/Service/CaseStudy'
import Contact from '../components/homepage/Contact'
import TechnologyWorkWith from '../components/Service/TechnologyWorkWith'

function ServicePage() {
  const { serviceType } = useParams(); // URL param: /service/:serviceType
  const navigate = useNavigate();
   
  const [isReload, setIsReload] = useState(true);
  const [serviceData, setServiceData] = useState(null);

  useEffect(() => { 
    const fetchServiceData = async () => {
      try {
        setIsReload(true);
        window.scrollTo(0, 0);

        // 1. Query 'services' collection where field 'uid' matches the param
        const q = query(collection(db, "servicesDB"), where("uid", "==", serviceType));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // 2. Set the data from the first matching document
          const data = querySnapshot.docs[0].data();
          setServiceData(data);
          setIsReload(false);
        } else {
          // 3. No match found? Redirect to home
          console.error("Service not found in DB");
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        navigate('/');
      }
    };

    if (serviceType) {
      fetchServiceData();
    }
  }, [serviceType, navigate]);

  return (
    isReload ? (
      <Reloader />
    ) : (
      <>
        {/* Pass dynamic banner data from Firestore */}
        <Banner  
          data={serviceData?.bannerData}
        />
         
        {/* Pass fetched data to your content component */}
        <ServicesContent data={serviceData?.subSection}  />

        <TechnologyWorkWith page={serviceData?.title} />
         
        <ServiceStaffComponent pageUid={serviceData?.uid} show={false} /> 
        <Project header={serviceData?.projectSection} page={serviceData?.title} />
        <CaseStudy  page={serviceData?.title} header={serviceData?.caseStudy} /> 
        <Contact />
      </>
    )
  ) 
}

export default ServicePage;