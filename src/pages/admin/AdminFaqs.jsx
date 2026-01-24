// src/pages/admin/FAQsCMS.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, setDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Backdrop,
  Fade,
} from "@mui/material";
import { 
  TrashIcon, 
  PencilSquareIcon, 
  XMarkIcon, 
  QuestionMarkCircleIcon,
  PlusIcon,
  ChatBubbleLeftEllipsisIcon
} from "@heroicons/react/24/outline";

const FAQS_COLLECTION = "faqsDB";
const BRAND = "#070778";

export default function FAQsCMS() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  const [newFaqModal, setNewFaqModal] = useState(false);
  const [newFaqData, setNewFaqData] = useState({ question: "", answer: "" });

  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    const snap = await getDocs(collection(db, FAQS_COLLECTION));
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFaqs(data);
    setLoading(false);
  };

  const notify = (msg, sev = "success") => setNotification({ open: true, message: msg, severity: sev });

  const createFaq = async () => {
    if (!newFaqData.question || !newFaqData.answer) return;
    setSaving(true);
    const docRef = doc(collection(db, FAQS_COLLECTION));
    await setDoc(docRef, newFaqData);
    setFaqs((prev) => [...prev, { id: docRef.id, ...newFaqData }]);
    notify("New FAQ entry published");
    setNewFaqModal(false);
    setNewFaqData({ question: "", answer: "" });
    setSaving(false);
  };

  const saveFaq = async () => {
    if (!selectedFaq) return;
    setSaving(true);
    const { id, ...data } = selectedFaq;
    await updateDoc(doc(db, FAQS_COLLECTION, id), data);
    setFaqs((prev) => prev.map((f) => (f.id === id ? selectedFaq : f)));
    notify("FAQ updated successfully");
    setSaving(false);
    setSelectedFaq(null);
  };

  const deleteFaq = async (id) => {
    if (!window.confirm("Are you sure you want to remove this FAQ?")) return;
    await deleteDoc(doc(db, FAQS_COLLECTION, id));
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    notify("FAQ deleted", "info");
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <CircularProgress sx={{ color: BRAND }} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-[#F9FAFB] min-h-screen">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-[#070778] font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <QuestionMarkCircleIcon className="h-5 w-5" />
            <span>Support Knowledgebase</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">General FAQs</h1>
          <p className="text-slate-500 mt-1 font-medium">Answer common questions to reduce support overhead.</p>
        </div>
        <button 
          onClick={() => setNewFaqModal(true)}
          className="bg-[#070778] hover:bg-[#05055a] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-900/10 transition-all active:scale-95"
        >
          <PlusIcon className="h-5 w-5 stroke-[3px]" />
          New Question
        </button>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-2xl">
                <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-[#070778]" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <IconButton onClick={() => setSelectedFaq(faq)} sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#eff6ff', color: '#2563eb' } }}>
                  <PencilSquareIcon className="h-4 w-4" />
                </IconButton>
                <IconButton onClick={() => deleteFaq(faq.id)} sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#fef2f2', color: '#dc2626' } }}>
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-800 leading-tight mb-4 group-hover:text-[#070778] transition-colors">
              {faq.question}
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed line-clamp-3">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Global Dialog Styles & Reusable Logic */}
      <FAQModal 
        open={!!selectedFaq || newFaqModal} 
        onClose={() => { setSelectedFaq(null); setNewFaqModal(false); }}
        title={selectedFaq ? "Edit Question" : "Create New FAQ"}
        data={selectedFaq || newFaqData}
        setData={selectedFaq ? setSelectedFaq : setNewFaqData}
        onSave={selectedFaq ? saveFaq : createFaq}
        saving={saving}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={notification.severity} variant="filled" sx={{ borderRadius: '1rem', fontWeight: 600 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

/* ---------------- MODAL COMPONENT ---------------- */
function FAQModal({ open, onClose, title, data, setData, onSave, saving }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 400, sx: { backdropFilter: "blur(8px)", backgroundColor: "rgba(7, 7, 120, 0.1)" } }}
      TransitionComponent={Fade}
      PaperProps={{ sx: { borderRadius: '2.5rem', p: 2 } }}
    >
      <DialogTitle className="flex justify-between items-center pr-4">
        <span className="text-2xl font-black text-[#070778]">{title}</span>
        <IconButton onClick={onClose}><XMarkIcon className="h-6 w-6 text-slate-400" /></IconButton>
      </DialogTitle>

      <DialogContent className="space-y-6 pt-2">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Question</label>
          <TextField
            fullWidth
            variant="filled"
            placeholder="e.g. How long does a typical project take?"
            value={data.question}
            onChange={(e) => setData({ ...data, question: e.target.value })}
            InputProps={{ 
              disableUnderline: true,
              sx: { borderRadius: '1.25rem', bgcolor: '#f8fafc', px: 1, fontWeight: 700 } 
            }}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Detailed Answer</label>
          <TextField
            fullWidth
            multiline
            rows={5}
            variant="filled"
            placeholder="Provide a clear, concise response..."
            value={data.answer}
            onChange={(e) => setData({ ...data, answer: e.target.value })}
            InputProps={{ 
              disableUnderline: true,
              sx: { borderRadius: '1.5rem', bgcolor: '#f8fafc', p: 2, fontWeight: 500 } 
            }}
          />
        </div>
      </DialogContent>

      <DialogActions className="p-8 pt-2">
        <Button onClick={onClose} sx={{ fontWeight: 700, textTransform: 'none', color: 'slate.500' }}>Discard</Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={saving}
          sx={{
            backgroundColor: BRAND,
            borderRadius: '1.25rem',
            px: 6,
            py: 1.5,
            fontWeight: 800,
            textTransform: 'none',
            fontSize: '1rem',
            "&:hover": { backgroundColor: "#05055c" },
          }}
        >
          {saving ? <CircularProgress size={24} color="inherit" /> : "Save FAQ Entry"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}