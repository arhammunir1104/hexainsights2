import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
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
  PhotoIcon, 
  CloudArrowUpIcon,
  XMarkIcon,
  RectangleGroupIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/react-toastify.css';

/* ---------------- CONSTANTS ---------------- */
const CLOUD_NAME = "dg3ade8dr";
const UPLOAD_PRESET = "insights";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const CASE_STUDIES_COLLECTION = "caseStudiesDB";
const SERVICES_COLLECTION = "servicesDB";
const BRAND_COLOR = "#070778";

const defaultCaseStudy = {
  title: "",
  description: "",
  bannerImage: { url: "", public_id: "" },
  uploadDate: "",
  updateDate: "",
  display: [],
  cards: [],
};

export default function AdminCaseStudies() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Custom Confirmation States
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [afterUpload, setAfterUpload] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCaseStudies();
    fetchServices();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const snap = await getDocs(collection(db, CASE_STUDIES_COLLECTION));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCaseStudies(data);
    } catch (err) {
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    const snap = await getDocs(collection(db, SERVICES_COLLECTION));
    const data = snap.docs.map((d) => d.data().title);
    setServices(["home", ...data]);
  };

  const openImageModal = (cb) => {
    setSelectedFile(null);
    setAfterUpload(() => cb);
    setImageModalOpen(true);
  };

  const uploadImage = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", selectedFile);
      form.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: form });
      const data = await res.json();
      afterUpload({ url: data.secure_url, public_id: data.public_id });
      toast.success("Asset uploaded");
      setImageModalOpen(false);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const createCaseStudy = async () => {
    const docRef = doc(collection(db, CASE_STUDIES_COLLECTION));
    const now = new Date().toISOString();
    const newCase = { ...defaultCaseStudy, uploadDate: now, updateDate: now };
    await setDoc(docRef, newCase);
    setCaseStudies((prev) => [...prev, { id: docRef.id, ...newCase }]);
    setSelectedCase({ id: docRef.id, ...newCase });
    setModalOpen(true);
    toast.success("Draft created");
  };

  const saveCaseStudy = async () => {
    const { id, ...data } = selectedCase;
    data.updateDate = new Date().toISOString();
    await updateDoc(doc(db, CASE_STUDIES_COLLECTION, id), data);
    setCaseStudies((prev) => prev.map((c) => (c.id === id ? selectedCase : c)));
    toast.success("All changes saved");
    setModalOpen(false);
  };

  const initiateDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, CASE_STUDIES_COLLECTION, deleteId));
      setCaseStudies((prev) => prev.filter((c) => c.id !== deleteId));
      toast.warn("Entry removed");
    } catch (e) {
      toast.error("Error deleting entry");
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

   if (loading) return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
        <CircularProgress size={30} sx={{ color: BRAND_COLOR }} />
        <p className="font-medium animate-pulse">Loading Case Study Page...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 pb-20">
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* Normal Header Section */}
      <div className="max-w-7xl mx-auto px-6 pt-12 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#070778] mb-2 font-bold text-sm tracking-widest uppercase">
              <RectangleGroupIcon className="h-5 w-5" />
              <span>Admin Control</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900">Case Studies</h1>
            <p className="text-slate-500 font-medium">Manage your portfolio projects and narrative sections.</p>
          </div>
          <button
            onClick={createCaseStudy}
            className="flex cursor-pointer items-center justify-center gap-2 bg-[#070778] hover:bg-[#05055a] text-white font-bold py-4 px-8 rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-900/10"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Case Study</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((cs) => (
            <div key={cs.id} className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="relative h-60 overflow-hidden">
                {cs.bannerImage?.url ? (
                  <img src={cs.bannerImage.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="flex items-center justify-center h-full bg-slate-100 text-slate-300">
                    <PhotoIcon className="h-16 w-16" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  {cs.display?.slice(0, 1).map((tag) => (
                    <span key={tag} className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-[#070778] rounded-full shadow-lg">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-black text-slate-800 mb-3 line-clamp-1">{cs.title || "Untitled"}</h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-8">{cs.description || "No description provided."}</p>
                
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Updated {new Date(cs.updateDate).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Tooltip title="Edit Content">
                      <IconButton size="small" onClick={() => { setSelectedCase(cs); setModalOpen(true); }} className="bg-slate-50 hover:bg-blue-50 text-blue-600">
                        <PencilSquareIcon className="h-5 w-5" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Permanently">
                      <IconButton size="small" onClick={() => initiateDelete(cs.id)} className="bg-slate-50 hover:bg-red-50 text-red-500">
                        <TrashIcon className="h-5 w-5" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Editor Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        fullWidth 
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: '2.5rem', padding: '10px' }}}
      >
        <DialogTitle className="flex justify-between items-center px-6 pt-6 pb-2">
          <span className="text-3xl font-black text-slate-900 tracking-tighter">Project Workspace</span>
          <IconButton onClick={() => setModalOpen(false)}><XMarkIcon className="h-6 w-6" /></IconButton>
        </DialogTitle>

        {selectedCase && (
          <DialogContent className="px-6 py-4 space-y-10">
            <div className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5">
                 <h4 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">Banner Media</h4>
                 <ImageUpload 
                  image={selectedCase.bannerImage?.url} 
                  onUpload={() => openImageModal((img) => setSelectedCase(prev => ({ ...prev, bannerImage: img })))} 
                />
              </div>
              
              <div className="lg:col-span-7 space-y-6">
                <TextField 
                  label="Project Title" 
                  fullWidth 
                  variant="filled"
                  value={selectedCase.title} 
                  InputProps={{ disableUnderline: true, sx: { margin: "5px 0px"  , borderRadius: '1rem', fontWeight: 800, fontSize: '1.1rem' } }}
                  onChange={(e) => setSelectedCase(prev => ({ ...prev, title: e.target.value }))} 
                />
                
                <TextField 
                  label="Meta Description" 
                  fullWidth 
                  multiline 
                  rows={3} 
                  variant="filled"
                  InputProps={{ disableUnderline: true, sx: { borderRadius: '1rem',  margin: "5px 0px", marginBottom: "5px"   } }}
                  value={selectedCase.description} 
                  onChange={(e) => setSelectedCase(prev => ({ ...prev, description: e.target.value }))} 
                />

                <FormControl fullWidth variant="filled">
                  <InputLabel sx={{ fontWeight: 700, margin: "5px 0px"  }}>Service Categorization</InputLabel>
                  <Select
                    multiple
                    value={selectedCase.display}
                    input={<OutlinedInput label="Service Categorization" sx={{ display: 'none',  margin: "5px 0px"   }} />}
                    renderValue={(selected) => (
                      <div className="flex gap-1 flex-wrap">
                        {selected.map((s) => <Chip key={s} label={s} size="small" sx={{ bgcolor: '#070778', color: 'white', fontWeight: 900, borderRadius: '6px' }} />)}
                      </div>
                    )}
                    sx={{ borderRadius: '1rem', border: 'none', bgcolor: '#f1f5f9' }}
                    onChange={(e) => setSelectedCase(prev => ({ ...prev, display: e.target.value }))}
                  >
                    {services.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Narrative Sections</h3>
                <Button 
                  startIcon={<PlusIcon className="h-4 w-4" />} 
                  variant="outlined" 
                  sx={{cursor: "pointer" , borderRadius: '10px', textTransform: 'none', fontWeight: 700, borderColor: '#070778', color: '#070778' }}
                  onClick={() => setSelectedCase(prev => ({
                    ...prev, 
                    cards: [...prev.cards, { heading: "", title: "", description: "", image: { url: "", public_id: "" } }]
                  }))}
                >
                  New Section
                </Button>
              </div>

              <div className="space-y-6">
                {selectedCase.cards.map((card, i) => (
                  <div key={i} className="group relative bg-slate-50 border border-slate-100 rounded-[2rem] p-8 hover:bg-white hover:shadow-xl transition-all">
                    <div className="grid md:grid-cols-12 gap-8">
                      <div className="md:col-span-3">
                        <ImageUpload 
                          small
                          image={card.image?.url} 
                          onUpload={() => openImageModal(img => {
                            const cards = [...selectedCase.cards];
                            cards[i].image = img;
                            setSelectedCase(prev => ({ ...prev, cards }));
                          })} 
                        />
                      </div>
                      <div className="md:col-span-9 grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <TextField placeholder="Label (e.g. 01. Challenge)" fullWidth size="small" value={card.heading} onChange={(e) => {
                            const cards = [...selectedCase.cards]; cards[i].heading = e.target.value;
                            setSelectedCase(prev => ({ ...prev, cards }));
                          }} />
                          <TextField placeholder="Section Title" fullWidth size="small" value={card.title} onChange={(e) => {
                            const cards = [...selectedCase.cards]; cards[i].title = e.target.value;
                            setSelectedCase(prev => ({ ...prev, cards }));
                          }} />
                        </div>
                        <TextField placeholder="Narrative text..." fullWidth multiline rows={3} size="small" value={card.description} onChange={(e) => {
                          const cards = [...selectedCase.cards]; cards[i].description = e.target.value;
                          setSelectedCase(prev => ({ ...prev, cards }));
                        }} />
                      </div>
                    </div>
                    <IconButton 
                      size="small" 
                      className="absolute -top-3 -right-3 bg-red-500 text-white shadow-lg hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setSelectedCase(prev => ({ ...prev, cards: prev.cards.filter((_, idx) => idx !== i) }))}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        )}

        <DialogActions className="p-8 bg-slate-50 rounded-b-[2.5rem]">
          <Button onClick={() => setModalOpen(false)} sx={{ color: 'slate.500', fontWeight: 700, cursor: "pointer" }}>Cancel</Button>
          <Button 
            variant="contained" 
            disableElevation
            onClick={saveCaseStudy}
            sx={{ backgroundColor: "#070778",cursor: "pointer"  ,borderRadius: '1rem', px: 6, py: 1.5, fontWeight: 800, '&:hover': { backgroundColor: '#05055a' }}}
          >
            Publish Case Study
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Confirmation Modal */}
      <Dialog 
        open={confirmOpen} 
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: '2rem', p: 2 }}}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Are you sure?</h2>
          <p className="text-slate-500 mt-2">This will permanently delete the case study. This action cannot be undone.</p>
          <div className="flex flex-col gap-3 mt-8">
            <button onClick={confirmDelete} className="bg-red-500 cursor-pointer hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all">Delete Entry</button>
            <button onClick={() => setConfirmOpen(false)} className="bg-slate-100 cursor-pointer text-slate-600 font-bold py-3 rounded-xl transition-all">Keep it</button>
          </div>
        </div>
      </Dialog>

      {/* Image Upload Hub */}
      <Dialog open={imageModalOpen} onClose={() => setImageModalOpen(false)} PaperProps={{ sx: { borderRadius: '2rem' }}}>
        <div className="p-8 w-[400px]">
          <h3 className="text-lg font-black mb-6 flex items-center gap-2">
            <PhotoIcon className="h-5 w-5 text-[#070778]" />
            Upload Media
          </h3>
          {selectedFile ? (
            <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
              <img src={URL.createObjectURL(selectedFile)} className="w-full h-48 object-cover" alt="Preview" />
              <button onClick={() => setSelectedFile(null)} className="absolute cursor-pointer top-2 right-2 bg-black/50 p-1 rounded-full text-white">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="w-full border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center cursor-pointer hover:border-[#070778] hover:bg-blue-50/30 transition-all">
              <CloudArrowUpIcon className="h-10 w-10 text-slate-300 mb-2" />
              <span className="text-xs font-bold text-slate-500 text-center uppercase tracking-widest leading-loose">Choose Image</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </label>
          )}
          <Button 
            fullWidth
            onClick={uploadImage} 
            disabled={uploading || !selectedFile} 
            variant="contained" 
            sx={{ backgroundColor: '#070778', py: 2, cursor: "pointer" ,borderRadius: '1rem', marginTop: "20px" ,fontWeight: 800 }}
          >
            {uploading ? <CircularProgress size={20} color="inherit" /> : "Upload"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

/* ---------------- IMAGE UPLOAD COMPONENT ---------------- */
const ImageUpload = ({ image, onUpload, small }) => (
  <div className="relative group">
    {image ? (
      <div className={`relative ${small ? 'h-32' : 'h-64'} w-full rounded-[2rem] overflow-hidden border border-slate-100`}>
        <img src={image} className="h-full w-full object-cover" alt="" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button onClick={onUpload} className="bg-white cursor-pointer text-black text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full">
            Replace Media
          </button>
        </div>
      </div>
    ) : (
      <button 
        onClick={onUpload}
        className={`${small ? 'h-32' : 'h-64'} w-full cursor-pointer bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-all`}
      >
        <PhotoIcon className={`${small ? 'h-6' : 'h-10'} opacity-30 mb-2`} />
        <span className="text-[10px] font-black uppercase tracking-widest">Add Media</span>
      </button>
    )}
  </div>
);