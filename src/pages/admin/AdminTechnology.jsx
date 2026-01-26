// src/pages/admin/TechnologyCMS.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { 
  TrashIcon, 
  PencilSquareIcon, 
  PlusIcon, 
  CloudArrowUpIcon,
  PhotoIcon,
  XMarkIcon,
  CpuChipIcon
} from "@heroicons/react/24/outline";

/* ---------------- CONFIG ---------------- */
const CLOUD_NAME = "dg3ade8dr";
const UPLOAD_PRESET = "insights";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const TECHNOLOGY_COLLECTION = "technologyDB";
const SERVICES_COLLECTION = "servicesDB";
const BRAND_COLOR = "#070778";

export default function AdminTechnology() {
  const [techs, setTechs] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [afterUpload, setAfterUpload] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [newTechModal, setNewTechModal] = useState(false);
  const [newTechData, setNewTechData] = useState({ text: "", image: null });

  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchTechs();
    fetchServices();
  }, []);

  const fetchTechs = async () => {
    const snap = await getDocs(collection(db, TECHNOLOGY_COLLECTION));
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTechs(data);
    setLoading(false);
  };

  const fetchServices = async () => {
    const snap = await getDocs(collection(db, SERVICES_COLLECTION));
    const data = snap.docs.map((doc) => doc.data().title);
    setServices(["home", ...data]);
  };

  const createTech = async () => {
    if (!newTechData.text || !newTechData.image) {
        setNotification({ open: true, message: "Please provide both name and icon", severity: "error" });
        return;
    }
    const docRef = doc(collection(db, TECHNOLOGY_COLLECTION));
    const newTech = { text: newTechData.text, image: newTechData.image, display: [] };
    await setDoc(docRef, newTech);
    setTechs((prev) => [...prev, { id: docRef.id, ...newTech }]);
    setNotification({ open: true, message: "Technology Stack Updated", severity: "success" });
    setNewTechModal(false);
    setNewTechData({ text: "", image: null });
  };

  const saveTech = async () => {
    if (!selectedTech) return;
    setSaving(true);
    const { id, ...data } = selectedTech;
    await updateDoc(doc(db, TECHNOLOGY_COLLECTION, id), data);
    setTechs((prev) => prev.map((t) => (t.id === id ? selectedTech : t)));
    setNotification({ open: true, message: "Changes Published Successfully", severity: "success" });
    setSaving(false);
    setSelectedTech(null);
  };

  const deleteTech = async (id) => {
    if(!window.confirm("Remove this technology from your stack?")) return;
    await deleteDoc(doc(db, TECHNOLOGY_COLLECTION, id));
    setTechs((prev) => prev.filter((t) => t.id !== id));
    setNotification({ open: true, message: "Technology Removed", severity: "info" });
  };

  const openImageModal = (cb) => {
    setSelectedFile(null);
    setAfterUpload(() => cb);
    setImageModalOpen(true);
  };

  const uploadImage = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", selectedFile);
    form.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: form });
    const data = await res.json();
    afterUpload({ url: data.secure_url, public_id: data.public_id });
    setUploading(false);
    setImageModalOpen(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
          <CircularProgress size={30} sx={{ color: BRAND_COLOR }} />
          <p className="font-medium animate-pulse tracking-widest text-xs uppercase">Loading Technology Page...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-[#F9FAFB] min-h-screen text-slate-900">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-[#070778] font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <CpuChipIcon className="h-5 w-5" />
            <span>Stack Management</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Core Technologies</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage the icons and software displayed across your service pages.</p>
        </div>
        <button 
          onClick={() => setNewTechModal(true)}
          className="bg-[#070778] cursor-pointer hover:bg-[#05055a] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-900/10 transition-all active:scale-95"
        >
          <PlusIcon className="h-5 w-5" />
          Add Technology
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {techs.map((tech) => (
          <div 
            key={tech.id} 
            className={`group bg-white border-2 rounded-[2rem] p-6 transition-all duration-300 flex flex-col items-center justify-center text-center relative hover:shadow-2xl hover:-translate-y-1 ${selectedTech?.id === tech.id ? 'border-[#070778] ring-4 ring-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <div className="h-16 w-16 mb-4 rounded-2xl overflow-hidden flex items-center justify-center bg-slate-50 group-hover:bg-white transition-colors">
                {tech.image?.url ? (
                    <img src={tech.image.url} alt={tech.text} className="max-h-12 max-w-12 object-contain" />
                ) : (
                    <PhotoIcon className="h-8 w-8 text-slate-200" />
                )}
            </div>
            <h3 className="font-bold text-sm text-slate-700 leading-tight mb-4">{tech.text}</h3>
            
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <IconButton size="small" onClick={() => setSelectedTech(tech)} className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white">
                    <PencilSquareIcon className="h-4 w-4" />
                </IconButton>
                <IconButton size="small" onClick={() => deleteTech(tech.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white">
                    <TrashIcon className="h-4 w-4" />
                </IconButton>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Panel (Appears when tech is selected) */}
      {selectedTech && (
        <div className="mt-16 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="bg-[#070778] p-8 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Modify {selectedTech.text}</h2>
                    <p className="text-blue-200 text-sm font-medium">Configure visibility and identity</p>
                </div>
                <IconButton onClick={() => setSelectedTech(null)} className="text-white hover:bg-white/10">
                    <XMarkIcon className="h-7 w-7" />
                </IconButton>
            </div>

            <div className="p-10 grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <label className="block text-xs font-black uppercase text-slate-400 tracking-widest">Icon / Graphic</label>
                 <div className="relative group w-40 h-40">
                    <div className="w-full h-full rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50">
                        {selectedTech.image?.url ? (
                            <img src={selectedTech.image.url} className="max-h-24 object-contain" alt="" />
                        ) : (
                            <PhotoIcon className="h-10 w-10 text-slate-200" />
                        )}
                    </div>
                    <button 
                        onClick={() => openImageModal((img) => setSelectedTech((p) => ({ ...p, image: img })))}
                        className="absolute  cursor-pointer inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest"
                    >
                        Change Image
                    </button>
                 </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest">Display Name</label>
                    <input 
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-lg focus:ring-2 focus:ring-[#070778] outline-none transition-all"
                        value={selectedTech.text} 
                        onChange={(e) => setSelectedTech((p) => ({ ...p, text: e.target.value }))}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest">Visibility Settings</label>
                    <FormControl fullWidth>
                        <Select
                            multiple
                            value={selectedTech.display}
                            onChange={(e) => setSelectedTech((p) => ({ ...p, display: e.target.value }))}
                            input={<OutlinedInput sx={{ borderRadius: '1.25rem', bgcolor: '#f8fafc', '& fieldset': { border: 'none' } }} />}
                            renderValue={(selected) => (
                                <div className="flex flex-wrap gap-2">
                                    {selected.map((val) => (
                                        <Chip key={val} label={val} size="small" sx={{ bgcolor: '#070778', color: 'white', fontWeight: 900, borderRadius: '8px' }} />
                                    ))}
                                </div>
                            )}
                        >
                            {services.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>

                <Button 
                    variant="contained" 
                    fullWidth
                    onClick={saveTech} 
                    disabled={saving}
                    sx={{ cursor: "pointer" ,backgroundColor: "#070778", py: 2, borderRadius: '1.25rem', fontWeight: 800, textTransform: 'none', fontSize: '1rem', '&:hover': { backgroundColor: '#05055a' } }}
                >
                    {saving ? <CircularProgress size={24} color="inherit" /> : "Deploy Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Popups */}
      <Dialog open={imageModalOpen} onClose={() => setImageModalOpen(false)} PaperProps={{ sx: { borderRadius: '2rem' }}}>
        <div className="p-8 w-[400px]">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            <CloudArrowUpIcon className="h-6 w-6 text-[#070778]" />
            Upload Asset
          </h3>
          {selectedFile ? (
            <div className="rounded-[1.5rem] overflow-hidden bg-slate-50 p-4 border border-slate-100 mb-6 flex justify-center">
              <img src={URL.createObjectURL(selectedFile)} className="h-32 object-contain" alt="Preview" />
            </div>
          ) : (
            <label className="w-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all mb-6">
                <PhotoIcon className="h-10 w-10 text-slate-300" />
                <span className="text-[10px] font-black uppercase text-slate-400 mt-2">Browse Files</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </label>
          )}
          <div className="flex gap-3">
             <Button fullWidth onClick={() => setImageModalOpen(false)} sx={{ fontWeight: 700, cursor: "pointer" }}>Cancel</Button>
             <Button fullWidth variant="contained" onClick={uploadImage} disabled={uploading || !selectedFile} sx={{ bgcolor: '#070778',  cursor: "pointer" ,borderRadius: '1rem', fontWeight: 800 }}>
                {uploading ? <CircularProgress size={20} /> : "Upload"}
             </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={newTechModal} onClose={() => setNewTechModal(false)} PaperProps={{ sx: { borderRadius: '2.5rem', p: 2 }}}>
        <DialogTitle className="text-2xl font-black">Add to Stack</DialogTitle>
        <DialogContent className="space-y-6 pt-2">
          <input 
            placeholder="Technology Name (e.g. React.js)"
            className="w-full bg-slate-100 rounded-2xl px-5 py-4 font-bold outline-none border-2 border-transparent focus:border-[#070778] transition-all"
            value={newTechData.text} 
            onChange={(e) => setNewTechData((p) => ({ ...p, text: e.target.value }))}
          />
          <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Icon Attachment</label>
              <div 
                onClick={() => openImageModal((img) => setNewTechData((p) => ({ ...p, image: img })))}
                className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden"
              >
                  {newTechData.image?.url ? <img src={newTechData.image.url} className="h-16 object-contain" /> : <PlusIcon className="h-8 w-8 text-slate-300" />}
              </div>
          </div>
        </DialogContent>
        <DialogActions className="p-6 pt-0">
          <Button onClick={() => setNewTechModal(false)} sx={{ fontWeight: 700, cursor: "pointer"  }}>Cancel</Button>
          <Button variant="contained" onClick={createTech} sx={{ bgcolor: '#070778', borderRadius: '1rem', px: 4, fontWeight: 800, cursor: "pointer"  }}>Add Stack</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={notification.open} autoHideDuration={3000} onClose={() => setNotification((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity={notification.severity} variant="filled" sx={{ borderRadius: '1rem', fontWeight: 600 }}>{notification.message}</Alert>
      </Snackbar>
    </div>
  );
}