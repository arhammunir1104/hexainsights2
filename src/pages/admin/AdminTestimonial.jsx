// src/pages/admin/TestimonialsCMS.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Backdrop,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  TrashIcon,
  PencilSquareIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/outline";

const COLLECTION = "testimonialsDB";
const BRAND = "#070778";

export default function AdminTestimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    name: "",
    designation: "",
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const snap = await getDocs(collection(db, COLLECTION));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setTestimonials(data);
    setLoading(false);
  };

  const openNewModal = () => {
    setActiveTestimonial(null);
    setFormData({ description: "", name: "", designation: "" });
    setModalOpen(true);
  };

  const openEditModal = (testimonial) => {
    setActiveTestimonial(testimonial);
    setFormData({
      description: testimonial.description,
      name: testimonial.name,
      designation: testimonial.designation,
    });
    setModalOpen(true);
  };

  const saveTestimonial = async () => {
    if (!formData.description || !formData.name) return;
    setSaving(true);

    try {
      if (activeTestimonial) {
        await updateDoc(doc(db, COLLECTION, activeTestimonial.id), formData);
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === activeTestimonial.id ? { ...t, ...formData } : t
          )
        );
        notify("Client feedback updated");
      } else {
        const ref = doc(collection(db, COLLECTION));
        await setDoc(ref, formData);
        setTestimonials((prev) => [...prev, { id: ref.id, ...formData }]);
        notify("New testimonial published");
      }
      setModalOpen(false);
    } catch (e) {
      notify("Failed to save data", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Delete this client feedback?")) return;
    await deleteDoc(doc(db, COLLECTION, id));
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    notify("Testimonial removed", "info");
  };

  const notify = (msg, sev = "success") => setToast({ open: true, message: msg, severity: sev });

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
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            <span>Social Proof</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Client Success Stories</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage the words of praise shown on your landing pages.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-[#070778] cursor-pointer hover:bg-[#05055a] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-900/10 transition-all active:scale-95"
        >
          <PlusIcon className="h-5 w-5 stroke-[3px]" />
          Add Testimonial
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
          >
            <div className="absolute top-6 right-8 text-blue-50 group-hover:text-blue-100 transition-colors">
               <ChatBubbleBottomCenterTextIcon className="h-12 w-12" />
            </div>

            <div className="flex-grow relative z-10">
              <p className="text-slate-600 italic leading-relaxed text-lg mb-8 pt-4">
                “{item.description}”
              </p>
            </div>

            <div className="border-t border-slate-50 pt-6 flex justify-between items-end">
              <div>
                <h4 className="font-black text-[#070778] text-lg leading-tight">
                  {item.name}
                </h4>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                  {item.designation}
                </p>
              </div>

              <div className="flex gap-1">
                <IconButton 
                  size="small" 
                  onClick={() => openEditModal(item)}
                  sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#eff6ff', color: '#2563eb' } }}
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => deleteTestimonial(item.id)}
                  sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#fef2f2', color: '#dc2626' } }}
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 400,
          sx: { backdropFilter: "blur(8px)", backgroundColor: "rgba(7, 7, 120, 0.1)" },
        }}
        TransitionComponent={Fade}
        PaperProps={{
          sx: { borderRadius: '2.5rem', p: 2, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' },
        }}
      >
        <DialogTitle className="flex justify-between items-center pr-4">
          <span className="text-2xl font-black text-[#070778]">
            {activeTestimonial ? "Edit Feedback" : "New Testimonial"}
          </span>
          <IconButton onClick={() => setModalOpen(false)}>
            <XMarkIcon className="h-6 w-6 text-slate-400" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="space-y-6">
          <div className="mt-4 space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">The Review</label>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="filled"
              placeholder="What did the client say?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              InputProps={{ 
                disableUnderline: true,
                sx: { borderRadius: '1.5rem', bgcolor: '#f8fafc', p: 2, fontWeight: 500 } 
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Client Name</label>
              <TextField
                fullWidth
                variant="filled"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                InputProps={{ 
                  disableUnderline: true,
                  sx: { borderRadius: '1.25rem', bgcolor: '#f8fafc', px: 1, fontWeight: 700 } 
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Designation</label>
              <TextField
                fullWidth
                variant="filled"
                placeholder="CEO at TechCorp"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                InputProps={{ 
                  disableUnderline: true,
                  sx: { borderRadius: '1.25rem', bgcolor: '#f8fafc', px: 1, fontWeight: 700 } 
                }}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions className="p-6">
          <Button 
            onClick={() => setModalOpen(false)} 
            sx={{ fontWeight: 700, textTransform: 'none', color: 'slate.500', cursor : "pointer" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveTestimonial}
            disabled={saving}
            sx={{
              backgroundColor: BRAND,
              borderRadius: '1.25rem',
              px: 6,
              py: 1.5,
              fontWeight: 800,
              textTransform: 'none',
              fontSize: '1rem',
              cursor : "pointer",
              "&:hover": { backgroundColor: "#05055c" },
            }}
          >
            {saving ? <CircularProgress size={24} color="inherit" /> : "Save Testimonial"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ borderRadius: '1rem', fontWeight: 600 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}