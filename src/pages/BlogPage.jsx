import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore'; 

import ContactCard from '../components/contact/ContactCard';
import BlogComponent from '../components/blog/BlogComponent';
import Reloader from '../components/Reloader/Reloader';
import Footer from '../components/footer/Footer';
import Navbar from '../components/navbar/Navbar';

const BLOGS_COLLECTION = "hexainsighs-blog";

function BlogPage() {
    const { uid } = useParams(); // Index of the blog in the array
    const navigate = useNavigate(); 
    
    const [blogData, setBlogData] = useState(null);
    const [uploadDate, setUploadDate] = useState("");
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            window.scrollTo(0, 0);
            try {
                setLoading(true);
                const querySnapshot = await getDocs(collection(db, BLOGS_COLLECTION));

                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data();
                    const allBlogs = docData.subsection?.blogs || [];
                    const index = parseInt(uid);

                    if (allBlogs && allBlogs[index]) {
                        const currentBlog = allBlogs[index];
                        setBlogData(currentBlog);
                        setUploadDate(docData?.uploadDate || "");

                        // Fetch related blogs from same category
                        let related = allBlogs
                            .map((b, i) => ({ ...b, originalIndex: i }))
                            .filter(b => b.originalIndex !== index); // Exclude current

                        if (currentBlog?.category) {
                            const categoryMatches = related.filter(b => b.category === currentBlog.category);
                            if (categoryMatches.length > 0) {
                                related = categoryMatches;
                            }
                        }

                        related = related
                            .sort((a, b) => (b.originalIndex || 0) - (a.originalIndex || 0))
                            .slice(0, 6);
                        
                        setRelatedBlogs(related);
                    } else {
                        console.error("Blog index out of bounds:", index);
                        navigate('/blogs');
                    }
                } else {
                    console.error("No blogs found in database");
                    navigate('/blogs');
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
                navigate('/blogs');
            } finally {
                setLoading(false);
            }
        };

        if (uid !== undefined) {
            fetchBlog();
        } else {
            navigate('/blogs');
        }
    }, [uid, navigate]);

    if (loading) return <Reloader />;

    return (
        <div className="min-h-screen bg-white">
            {blogData && (
                <BlogComponent 
                    data={blogData} 
                    uploadDate={uploadDate} 
                    relatedBlogs={relatedBlogs} 
                />
            )}
            <ContactCard />
        </div>
    );
}

export default BlogPage;