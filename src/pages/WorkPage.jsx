import React, { useEffect, useState } from 'react'

import Banner from '../components/Banner/Banner'
import Project from '../components/homepage/Project';
import TechnologyComponent from '../components/Service/TechnologyComponent'
import Team from '../components/homepage/Team';
import WorkContent from '../components/Work/WorkContent';
import Reloader from '../components/Reloader/Reloader';
import Contact from '../components/homepage/Contact';
function WorkPage() {
  const [isReload, setIsReload] = useState(true);

  useEffect(()=>{
      scrollTo(0,0)

    setTimeout(()=>{
      setIsReload(false)
    },1000)
  },[])
  return (
    isReload ? 
    <>
    <Reloader />
    </> 
    : 
   <>
   <Banner  imageUrl= {"/work/banner.png"} title= "OUR WORK"  description= "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."/>
   <WorkContent />
   <Project />
   <TechnologyComponent />
   <Team />
   <Contact />
   </>
  )
}

export default WorkPage;
