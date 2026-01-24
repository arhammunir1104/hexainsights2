import React, { useState, useEffect } from 'react';
import { db } from "../../firebase"; 
import { doc, onSnapshot, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Icons
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Contact = () => {
  const [formData, setFormData] = useState({});
  const [dbContent, setDbContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "contactPageDB", "main"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDbContent(data);
        const initialForm = {};
        data.form?.fields?.forEach(field => {
          initialForm[field.heading] = "";
        });
        setFormData(initialForm);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "formResponses"), {
        ...formData,
        submittedAt: serverTimestamp()
      });
      toast.success("Submitted successfully!");
      const reset = {};
      Object.keys(formData).forEach(k => reset[k] = "");
      setFormData(reset);
    } catch (error) {
      toast.error("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSocials = () => {
    const socials = dbContent?.leftCard?.socials;
    if (!socials) return null;
    const iconMap = {
      twitter: <TwitterIcon sx={{ fontSize: 18 }} />,
      instagram: <InstagramIcon sx={{ fontSize: 18 }} />,
      linkedin: <LinkedInIcon sx={{ fontSize: 18 }} />,
      facebook: <FacebookIcon sx={{ fontSize: 18 }} />,
      youtube: <YouTubeIcon sx={{ fontSize: 18 }} />,
    };

    return Object.keys(socials).map((key) => {
      if (socials[key] && iconMap[key]) {
        return (
          <a key={key} href={socials[key]} target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-[#0037a5] flex items-center justify-center transition-all">
            {iconMap[key]}
          </a>
        );
      }
      return null;
    });
  };

  if (loading || !dbContent) return null;

  return (
    <section id='contact' className="w-full py-10 md:py-16 bg-white font-[Quicksand]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Shrunken Heading Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002b80]">
           {dbContent.header?.title}
          </h2>
          <p className="max-w-2xl mx-auto mt-2 text-gray-500 text-xs md:text-sm leading-relaxed">
            {dbContent.header?.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row bg-white rounded-[1.5rem]  overflow-hidden min-h-[500px]">
          
          {/* LEFT CARD - Compacted */}
          <div className="lg:w-[35%] bg-gradient-to-br rounded-[1.5rem]  from-[#001E74] via-[#0037a5] to-[#3b82f6] p-8 text-white relative">
            <div className="relative z-10">
                <h3 className="text-xl font-bold mb-1">Contact Information</h3>
                <p className="text-blue-100/70 text-xs mb-8">Reach out to us directly</p>

               <div className="space-y-4"> {/* Reduced from space-y-6 for a tighter look */}
  
          {/* Phone Numbers */}
          {dbContent.leftCard?.phones?.map((phone, index) => (
            <div key={`phone-${index}`} className="flex items-center gap-3">
              <WhatsAppIcon sx={{ fontSize: 18 }} className="text-white" />
              <span className="text-[13px] text-white font-medium">{phone}</span>
            </div>
          ))}

          {/* Emails */}
          {dbContent.leftCard?.emails?.map((email, index) => (
            <div key={`email-${index}`} className="flex items-center gap-3">
              <EmailIcon sx={{ fontSize: 18 }} className="text-white" />
              <span className="text-[13px] text-white font-medium truncate">{email}</span>
            </div>
          ))}

          {/* Addresses */}
          {dbContent.leftCard?.addresses?.map((address, index) => (
            <div key={`address-${index}`} className="flex items-start gap-3">
              <LocationOnIcon sx={{ fontSize: 18 }} className="text-white mt-0.5" />
              <span className="text-[13px] text-white leading-snug">{address}</span>
            </div>
          ))}
          
        </div>

                <div className="flex gap-3 mt-16">
                  {renderSocials()}
                </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
          </div>

          {/* RIGHT FORM - Reduced Gaps */}
          <div className="lg:w-[65%] p-8 md:p-10 bg-white">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {dbContent.form?.fields?.map((field) => (
                <div key={field.id} className={`${(field.type === 'textarea' || field.type === 'radio') ? 'md:col-span-2' : ''}`}>
                  <label className="block text-[10px] font-bold text-[#002b80] mb-1 uppercase tracking-wider">
                    {field.heading}{field.required ? '*' : ''}
                  </label>
                  
                  {field.type === 'radio' ? (
                    <div className="flex flex-wrap gap-4 mt-1">
                      {field.options?.map((option, i) => (
                        <label key={i} className="flex items-center gap-2 cursor-pointer group">
                          <input type="radio" name={field.heading} value={option}
                            checked={formData[field.heading] === option}
                            onChange={handleInputChange} className="hidden" />
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${formData[field.heading] === option ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                            {formData[field.heading] === option && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <span className={`text-xs ${formData[field.heading] === option ? 'text-black font-semibold' : 'text-gray-400'}`}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : field.type === 'textarea' ? (
                    <textarea name={field.heading} value={formData[field.heading] || ""}
                      onChange={handleInputChange} required={field.required}
                      placeholder="Message" className="w-full border-b border-gray-200 py-1.5 outline-none focus:border-blue-600 text-xs resize-none" rows={2} />
                  ) : (
                    <input type={field.type || "text"} name={field.heading} value={formData[field.heading] || ""}
                      onChange={handleInputChange} required={field.required}
                      placeholder={field.heading} className="w-full border-b border-gray-200 py-1.5 outline-none focus:border-blue-600 text-xs" />
                  )}
                </div>
              ))}

              <div className="md:col-span-2 flex justify-end mt-2">
                <button type="submit" disabled={isSubmitting}
                  className="bg-[#001E74] text-white px-10 py-2.5 rounded text-sm font-bold hover:bg-[#0037a5] transition-all disabled:opacity-50">
                  {isSubmitting ? "..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Contact;