import React, { useEffect, useState } from 'react'
import HeroBackground from '../components/homepage/HeroBackground'
import Reloader from '../components/Reloader/Reloader';

function HomePage() {
  // const [isReload, setIsReload] = useState(true);

//   useEffect(()=>{
// scrollTo(0,0)
//     setTimeout(()=>{
//       setIsReload(false)
//     },1000)

//   },[]) 
  return (
    // isReload ?  
    // <>
    // <Reloader />
    // </>  
    // : 
    <>
    <div>
      <HeroBackground />
    </div>
    </>
  )
}

export default HomePage
