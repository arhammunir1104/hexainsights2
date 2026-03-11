// src/pages/admin/AdminTestimonial.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
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
  Tooltip,
} from "@mui/material";
import {
  TrashIcon,
  PencilSquareIcon,
  XMarkIcon,
  VideoCameraIcon,
  PlusIcon,
  CloudArrowUpIcon,
  PlayIcon,
  FilmIcon
} from "@heroicons/react/24/outline";

const COLLECTION = "testimonialsDB";
const BRAND = "#070778";

/* Cloudinary Config */
const CLOUD_NAME = "dg3ade8dr";
const UPLOAD_PRESET = "insights";
const CLOUDINARY_VIDEO_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

export default function AdminTestimonial() {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(null);

  const [formData, setFormData] = useState({
    videoUrl: "",
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
    try {
      const snap = await getDocs(collection(db, COLLECTION));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTestimonials(data);
    } catch (e) {
      console.error(e);
      notify("Failed to fetch testimonials", "error");
    } finally {
      setLoading(false);
    }
  };

  const openNewModal = () => {
    setActiveTestimonial(null);
    setFormData({ videoUrl: "", name: "", designation: "" });
    setModalOpen(true);
  };

  const openEditModal = (testimonial) => {
    setActiveTestimonial(testimonial);
    setFormData({
      videoUrl: testimonial.videoUrl || "",
      name: testimonial.name,
      designation: testimonial.designation,
    });
    setModalOpen(true);
  };

  const notify = (msg, sev = "success") => setToast({ open: true, message: msg, severity: sev });

  /* ---- Ensure Firebase Auth — redirect to login if expired ---- */
  const ensureAuth = async () => {
    const user = auth.currentUser;
    if (!user) {
      notify("Session expired. Redirecting to login...", "error");
      setTimeout(() => navigate("/admin"), 1500);
      return false;
    }
    try {
      // Force token refresh to ensure admin claims are up to date
      await user.getIdToken(true);
    } catch (e) {
      console.error("Token refresh failed:", e);
      notify("Session expired. Redirecting to login...", "error");
      setTimeout(() => navigate("/admin"), 1500);
      return false;
    }
    return true;
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) { // 50MB limit example
      notify("Video file too large (max 50MB)", "warning");
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_VIDEO_UPLOAD_URL, {
        method: "POST",
        body: data,
      });
      const fileData = await res.json();
      if (fileData.secure_url) {
        setFormData((prev) => ({ ...prev, videoUrl: fileData.secure_url }));
        notify("Video uploaded successfully");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      notify("Failed to upload video", "error");
    } finally {
      setUploading(false);
    }
  };

  const saveTestimonial = async () => {
    if (!formData.videoUrl || !formData.name) {
      notify("Please provide a name and upload a video", "warning");
      return;
    }
    setSaving(true);

    try {
      if (!(await ensureAuth())) { setSaving(false); return; }
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
        notify("New video testimonial published");
      }
      setModalOpen(false);
    } catch (e) {
      console.log(e);
      notify("Failed to save data", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Delete this video testimonial?")) return;
    try {
      if (!(await ensureAuth())) return;
      await deleteDoc(doc(db, COLLECTION, id));
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      notify("Testimonial removed", "info");
    } catch (e) {
      notify("Delete failed", "error");
    }
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
            <VideoCameraIcon className="h-5 w-5" />
            <span>Visual Proof</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Video Testimonials</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage recorded client success stories for your platform.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-[#070778] cursor-pointer hover:bg-[#05055a] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-900/10 transition-all active:scale-95"
        >
          <PlusIcon className="h-5 w-5 stroke-[3px]" />
          Add Video Testimonial
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
          >
            {/* Video Preview - Fixed height for consistency */}
            <div className="relative h-56 bg-slate-900 flex items-center justify-center overflow-hidden">
              {item.videoUrl ? (
                <video 
                  src={item.videoUrl} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  muted
                  playsInline
                  onMouseOver={e => e.target.play()}
                  onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                />
              ) : (
                <FilmIcon className="h-12 w-12 text-slate-700" />
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="bg-white/20 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayIcon className="h-6 w-6 text-white" />
                 </div>
              </div>
            </div>

            <div className="p-8 pb-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mt-auto">
                <div>
                  <h4 className="font-black text-[#070778] text-lg leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                    {item.designation}
                  </p>
                </div>

                <div className="flex gap-1">
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small" 
                      onClick={() => openEditModal(item)}
                      sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#eff6ff', color: '#2563eb' } }}
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small" 
                      onClick={() => deleteTestimonial(item.id)}
                      sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#fef2f2', color: '#dc2626' } }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => !uploading && !saving && setModalOpen(false)}
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
            {activeTestimonial ? "Edit Video Info" : "New Video Testimonial"}
          </span>
          <IconButton onClick={() => setModalOpen(false)} disabled={uploading || saving}>
            <XMarkIcon className="h-6 w-6 text-slate-400" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="space-y-6 pt-4">
          {/* Video Upload Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Testimonial Video</label>
            <div className={`relative border-2 border-dashed rounded-[1.5rem] p-8 text-center transition-all ${formData.videoUrl ? 'border-green-200 bg-green-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'}`}>
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <CircularProgress size={24} sx={{ color: BRAND }} />
                  <p className="text-xs font-bold text-[#070778]">Uploading to Cloudinary...</p>
                </div>
              ) : formData.videoUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
                    <video src={formData.videoUrl} className="w-full h-full object-contain" controls />
                  </div>
                  <Button 
                    component="label" 
                    variant="text" 
                    size="small" 
                    sx={{ textTransform: 'none', fontWeight: 700, color: BRAND }}
                  >
                    Change Video
                    <input type="file" accept="video/*" hidden onChange={handleVideoUpload} />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <CloudArrowUpIcon className="h-8 w-8 text-[#070778]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Click to upload video</p>
                    <p className="text-[10px] text-slate-400 font-medium">MP4, WebM up to 50MB</p>
                  </div>
                  <input type="file" accept="video/*" hidden onChange={handleVideoUpload} />
                </label>
              )}
            </div>
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
            disabled={uploading || saving}
            sx={{ fontWeight: 700, textTransform: 'none', color: 'slate.500', cursor : "pointer" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveTestimonial}
            disabled={saving || uploading}
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
            {saving ? <CircularProgress size={24} color="inherit" /> : "Publish Testimonial"}
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
