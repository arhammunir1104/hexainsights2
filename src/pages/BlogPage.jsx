import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore'; // Direct document imports

import Contact from '../components/homepage/Contact';
import ProjectComponent from '../components/caseStudy/ProjectComponent';
import Reloader from '../components/Reloader/Reloader';

function Blog() {
    const { uid } = useParams(); // This is the Firestore Document ID
    const navigate = useNavigate();
    
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCaseStudy = async () => {
            if (!uid) return;
        window.scrollTo(0, 0);
            
            try {
                setLoading(true);
                
                // Direct reference using the Document ID from params
                const docRef = doc(db, "caseStudiesDB", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Extract data and include the ID
                    setProjectData({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("No document found in caseStudiesDB with ID:", uid);
                    navigate('/'); 
                }
            } catch (error) {
                console.error("Firestore Fetch Error:", error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchCaseStudy();
    }, [uid, navigate]);

    if (loading) return <Reloader />;

    return (
        <>
            {projectData && <ProjectComponent data={projectData} />}
            <Contact />
        </>
    );
}

export default Blog;