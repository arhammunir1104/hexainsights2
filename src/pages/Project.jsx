import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import Contact from '../components/homepage/Contact';
import ProjectComponent from '../components/project/ProjectComponent';
import Reloader from '../components/Reloader/Reloader';

function Project() {
    const { uid } = useParams(); // Grabs the ID from the URL (e.g., /project/etherium)
    const navigate = useNavigate();
    
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
        window.scrollTo(0, 0);
            try {
                setLoading(true);
                
                // Query the "projects" collection (or whatever your collection name is) 
                // where the field 'uid' matches our URL parameter
                const q = query(collection(db, "featuredProjectsDB"), where("uid", "==", uid));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // We take the first match
                    const docData = querySnapshot.docs[0].data();
                    setProjectData(docData);

                } else {
                    // No project found with this UID - Send them home
                    console.error("Project not found, redirecting...");
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching project:", error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (uid) {
            fetchProject();
        } else {
            navigate('/');
        }
    }, [uid, navigate]);

    if (loading) return <Reloader />;

    return (
        <>
            {/* Pass the fetched projectData to your component */}
            <ProjectComponent data={projectData} />
            
            <Contact />
        </> 
    );
}

export default Project;