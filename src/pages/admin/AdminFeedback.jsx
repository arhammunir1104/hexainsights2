import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; 
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Calendar, User, Briefcase, MessageSquare, ClipboardList } from "lucide-react";

const AdminFeedbackPage = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const q = query(collection(db, "formResponses"), orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResponses(fetchedData);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, []);

  const formatValue = (value) => {
    if (value && typeof value.toDate === 'function') {
      return value.toDate().toLocaleString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
    }
    return value?.toString() || "N/A";
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-[#002b80] tracking-tight">Client Inquiries</h1>
          <p className="text-slate-500 mt-1">Manage dynamic form submissions from your website.</p>
        </header>

        {/* RESPONSIVE GRID: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {responses.map((response) => (
            <div 
              key={response.id} 
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
            >
              {/* Card Header: Primary Info */}
              <div className="p-5 border-b border-slate-50 bg-slate-50/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {response.Service || "New Lead"}
                  </span>
                  <div className="flex items-center text-slate-400 text-[11px]">
                    <Calendar size={12} className="mr-1" />
                    {formatValue(response.submittedAt)}
                  </div>
                </div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <User size={18} className="text-slate-400" />
                  {response.Name || "Anonymous"}
                </h2>
              </div>

              {/* Dynamic Attributes List */}
              <div className="p-5 space-y-4 flex-grow">
                {Object.entries(response).map(([key, value]) => {
                  // Skip keys we already handled in the header or internal IDs
                  if (["id", "Name", "submittedAt", "Service"].includes(key)) return null;

                  return (
                    <div key={key} className="flex flex-col border-l-2 border-slate-100 pl-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">
                        {formatValue(value)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Action */}
              {/* <div className="p-4 bg-white border-t border-slate-100 mt-auto">
                <button className="w-full py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                  <MessageSquare size={14} />
                  Contact Client
                </button>
              </div> */}
            </div>
          ))}
        </div>

        {responses.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <ClipboardList className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No responses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbackPage;