import React, { useState } from 'react';
import { Mail, Phone, MapPin, Youtube ,Facebook, Instagram, Linkedin, Send } from 'lucide-react';

// Using a standard, clean blue color for primary elements
const PRIMARY_COLOR = 'rgb(41, 107, 240)'; // A clean, bright blue for accents

// Placeholder URL for the circular image element in the black panel
const CIRCLE_IMAGE_URL = '/public/contact/img1.png';

const ContactCard = () => {
  // Combined state for all form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // Initial phone value
    subject: 'Product Design',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    { icon: Phone, text: '+92 300 0895990', link: 'tel:+92 300 0895990' },
    { icon: Mail, text: 'info@hexainsights.com', link: 'mailto:info@hexainsights.com' },
  ];

  const socialLinks = [
    { icon: Instagram, link: '#' },
    { icon: Linkedin, link: '#' },
    { icon: Facebook, link: '#' },
    { icon: Linkedin, link: '#' },
    { icon: Youtube, link: '#' },
  ];

  const subjects = ['Product Design', 'Website Development', 'Mobile Apps developmet'];
  
  // Generic handler for all text inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Handler for subject radio buttons
  const handleSubjectChange = (newSubject) => {
    setFormData(prev => ({ ...prev, subject: newSubject }));
  };
  
  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Log all data to console
    // console.log('Form Data Submitted:', formData);

    // 2. Clear fields
    // setFormData({
    //   firstName: '',
    //   lastName: '',
    //   email: '',
    //   phone: '', 
    //   subject: 'Product Design', // Resetting to the default subject
    //   message: '',
    // });
    
    // 3. Show success message
    // setIsSubmitted(true);

    setTimeout(() => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '', 
            subject: 'Product Design', // Resetting to the default subject
            message: '',
          });
        setIsSubmitted(true);
      }, 2000); // Hide success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000); // Hide success message after 5 seconds
  };


  return (
    <section className="font-sans py-16 sm:py-24 bg-gray-50 flex justify-center items-center">
      
      {/* CRITICAL CHANGE: Added 'relative' class here so 'absolute' elements inside 
        (like the notification) are positioned relative to this container.
      */}
      <div className="max-w-6xl w-full mx-4 sm:mx-8 bg-white rounded-[10px] overflow-hidden relative">

        {/* Success Message Notification - Now positioned relative to the container above */}
        {isSubmitted && (
          <div className="absolute top-0 left-0 w-full p-4 bg-green-500 text-white text-center font-semibold z-50 rounded-t-3xl">
            Message Sent Successfully! We will get back to you shortly.
          </div>
        )}
        
        {/* Main Grid: Stacks on mobile, side-by-side on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-5">

          {/* 1. Left Panel (Contact Information) - Dark Background */}
          <div className="lg:col-span-2 bg-black text-white p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none min-h-[400px]">
            
            {/* Decorative Element (Circular Image) - Added here 
              Positioned bottom-right of the black panel, with a transparent/subtle style.
            */}
            <img 
              src={CIRCLE_IMAGE_URL}
              alt="Decorative circle element"
              className="absolute bottom-[-50px] right-[-50px] w-60 h-60 opacity-20 z-0 select-none pointer-events-none"
              onError={(e) => { 
                e.target.onerror = null; 
                // Fallback for the decorative image to ensure alignment is maintained
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderRadius = '50%';
              }}
            />

            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold mb-2">
                GET YOUR CUSTOM ESTIMATE
              </h2>
              <p className="text-gray-400 text-base mb-10">
                Say something to start a live chat!
              </p>

              {/* Contact Details List */}
              <div className="space-y-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <item.icon className="w-5 h-5 mr-4 mt-1" style={{ color: "white" }} />
                    <a 
                      href={item.link} 
                      className={`text-gray-300 hover:text-white transition text-sm ${item.icon === MapPin ? 'max-w-xs' : 'font-medium'}`}
                    >
                      {item.text}
                    </a>
                  </div>
                ))}

                <div  className="flex items-start">
                    <MapPin className="w-5 h-5 mr-4 mt-1" style={{ color: PRIMARY_COLOR }} />
                    <a 
                      href={"#"} 
                      className={`text-gray-300 hover:text-white transition text-sm max-w-xs' }`}
                    >
                      UAE - Al Wahda Street, GIBCA, Dubai <br />Pakistan - North Karachi, Sector 9, Karachi
                    </a>
                  </div>

                
              </div>
            </div>

            {/* Social Icons (Bottom Left) */}
            <div className="mt-12 relative z-10 flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.link} 
                  aria-label={social.link.substring(1)}
                  className="p-2 bg-gray-800 rounded-full hover:bg-gray-600 transition duration-200"
                >
                  <social.icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Right Panel (Contact Form) - White Background */}
          <div className="lg:col-span-3 p-8 sm:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="relative border-b border-gray-300 focus-within:border-blue-500">
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full pt-3 pb-1 text-gray-900 placeholder-transparent focus:outline-none bg-transparent"
                  />
                  <label 
                    htmlFor="firstName" 
                    className="absolute left-0 top-0 transition-all text-gray-500 text-sm transform -translate-y-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-4 peer-focus:text-sm"
                  >
                    First Name
                  </label>
                </div>
                
                <div className="relative border-b border-gray-300 focus-within:border-blue-500">
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full pt-3 pb-1 text-gray-900 placeholder-transparent focus:outline-none bg-transparent"
                  />
                  <label 
                    htmlFor="lastName" 
                    className="absolute left-0 top-0 transition-all text-gray-500 text-sm transform -translate-y-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-4 peer-focus:text-sm"
                  >
                    Last Name
                  </label>
                </div>
              </div>

              {/* Row 2: Email & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="relative border-b border-gray-300 focus-within:border-blue-500">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full pt-3 pb-1 text-gray-900 placeholder-transparent focus:outline-none bg-transparent"
                  />
                  <label 
                    htmlFor="email" 
                    className="absolute left-0 top-0 transition-all text-gray-500 text-sm transform -translate-y-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-4 peer-focus:text-sm"
                  >
                    Email
                  </label>
                </div>
                
                <div className="relative border-b border-gray-300 focus-within:border-blue-500">
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full pt-3 pb-1 text-gray-900 placeholder-transparent focus:outline-none bg-transparent"
                  />
                  <label 
                    htmlFor="phone" 
                    className="absolute left-0 top-0 transition-all text-gray-500 text-sm transform -translate-y-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-4 peer-focus:text-sm"
                  >
                    Phone Number
                  </label>
                </div>
              </div>

              {/* Row 3: Select Subject (Radio Buttons) */}
              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  Select Subject
                </label>
                <div className="flex flex-wrap gap-4">
                  {subjects.map((s, index) => (
                    <label key={index} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="subject"
                        value={s}
                        checked={formData.subject === s}
                        onChange={() => handleSubjectChange(s)}
                        className="hidden" // Hide native radio button
                      />
                      <span className="w-4 h-4 rounded-full border border-gray-400 mr-2 flex items-center justify-center">
                        {formData.subject === s && (
                          <span className="w-2.5 h-2.5 bg-black rounded-full block"></span>
                        )}
                      </span>
                      <span className="text-gray-700 text-sm">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Row 4: Message Textarea */}
              <div className="relative border-b border-gray-300 focus-within:border-blue-500 pt-4">
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows="1" // Use a small default size, rely on the border line
                  className="w-full pt-3 pb-1 text-gray-900 placeholder-gray-400 focus:outline-none resize-none bg-transparent"
                ></textarea>
                <label 
                  htmlFor="message" 
                  className="absolute left-0 top-0 transition-all text-gray-500 text-sm"
                >
                  Message
                </label>
              </div>

              {/* Row 5: Send Message Button */}
              <div className="text-right pt-4">
                <button
                  type="submit"
                  className="flex cursor-pointer items-center justify-center ml-auto px-8 py-3 bg-black text-white font-medium rounded-xl shadow-lg hover:bg-gray-800 transition-all duration-200"
                >
                  Send Message
                  <Send className="w-4 h-4 ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};


export default ContactCard;