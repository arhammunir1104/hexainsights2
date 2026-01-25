import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; 
import { collection, getDocs } from "firebase/firestore";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Faq = () => {
  const [expanded, setExpanded] = useState(false);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "faqsDB"));
        const faqs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFaqData(faqs);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const midIndex = Math.ceil(faqData.length / 2);
  const leftColumn = faqData.slice(0, midIndex);
  const rightColumn = faqData.slice(midIndex);

  if (loading) return null;

  const AccordionItem = ({ item }) => (
    <div className="mb-4"> {/* Reduced from mb-6 */}
      <Accordion
        expanded={expanded === item.id}
        onChange={handleChange(item.id)}
        sx={{
          boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.05)', // Softer, smaller shadow
          borderRadius: '10px !important', // Slightly tighter corners
          '&:before': { display: 'none' },
          border: '1px solid #f1f5f9', // Added subtle border for definition
        }}
      >
        <AccordionSummary
          sx={{
            flexDirection: 'row',
            '& .MuiAccordionSummary-expandIconWrapper': { display: 'none' },
            px: { xs: 2, md: 2.5 },
            py: 0.5 // Slimmer vertical padding
          }}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="text-blue-500 flex-shrink-0">
              {expanded === item.id ? <RemoveIcon sx={{ fontSize: 18 }} /> : <AddIcon sx={{ fontSize: 18 }} />}
            </div>
            <Typography className="text-[14px] md:text-[15px] font-bold text-slate-700 ">
              {item.question}
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ px: { xs: 2.5, md: 6 }, pb: 2.5 }}>
          <Typography className="text-[13px] md:text-[14px] text-slate-500 leading-relaxed ">
            {item.answer}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );

  return (
    <section className="relative py-16 bg-white overflow-hidden">
      
      {/* DECORATION - Scaled down */}
       {/* FIXED GRADIENT: Reduced size and opacity */}
      <div 
        className="absolute bottom-0 right-0 w-[250px] h-[250px] pointer-events-none opacity-30 z-0"
        style={{
          background: "radial-gradient(circle at 80% 50%, rgba(2, 113, 255, 0.5) 0%, transparent 60%)"
        }}
      />
      <div className="max-w-6xl mx-auto px-6 relative z-10"> {/* Reduced max-w from 7xl for a tighter look */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight ">
            <span className="text-[#002b80]">Frequently</span>{" "}
            <span className="text-[#3b82f6]">Asked</span>{" "}
            <span className="text-[#002b80]">Questions</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-10">
          <div className="flex flex-col">
            {leftColumn.map((item) => <AccordionItem key={item.id} item={item} />)}
          </div>
          <div className="flex flex-col">
            {rightColumn.map((item) => <AccordionItem key={item.id} item={item} />)}
          </div>
        </div>

        {/* --- REFINED CTA SECTION --- */}
        <div className="mt-8 flex justify-center w-full">
          <a 
            href="#contact"
            className="group flex items-center justify-center gap-2 px-7 py-3 text-white text-sm font-bold rounded-lg 
                      bg-gradient-to-r from-[#002b80] to-[#005eff] 
                      shadow-lg shadow-blue-500/20 
                      hover:shadow-blue-500/40 hover:-translate-y-0.5 
                      transition-all duration-300 active:scale-95
                      w-full sm:w-auto text-center"
          >
            <span>Get Estimate</span>
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Faq;