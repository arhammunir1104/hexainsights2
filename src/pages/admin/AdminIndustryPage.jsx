// src/pages/admin/IndustryPageCMS.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip
} from "@mui/material";
import { PlusIcon, TrashIcon, XMarkIcon, PencilSquareIcon, CloudArrowUpIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------------- CLOUDINARY CONFIG ---------------- */
const CLOUD_NAME = "dg3ade8dr";
const UPLOAD_PRESET = "insights";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const INDUSTRY_COLLECTION = "industryDB";
const SERVICES_COLLECTION = "servicesDB";
const BRAND_COLOR = "#002b80";

const defaultIndustry = {
  title: "",
  icon: { url: "", public_id: "" },
  bannerData: { title: "", description: "", image: { url: "", public_id: "" }, cta: { title: "", link: "" } },
  subSection: { title: "What We Offer", description: "Our team combines modern technologies with industry-specific expertise to deliver solutions that scale with your business and deliver measurable impact.", cards: [] },
  projectSection: { title: "Featured Projects", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed tempor risus, vitae accumsan magna. Integer a eros efficitur, faucibus lectus a, pharetra nisi." },
  display: ["home", "about"],
};

export default function AdminIndustryPage() {
  const [industries, setIndustries] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [industryData, setIndustryData] = useState(defaultIndustry);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [afterUpload, setAfterUpload] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchIndustries();
    fetchServices();
  }, []);

  const fetchIndustries = async () => {
    try {
      const snap = await getDocs(collection(db, INDUSTRY_COLLECTION));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setIndustries(data);
    } catch (e) {
      toast.error("Error fetching industries");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    const snap = await getDocs(collection(db, SERVICES_COLLECTION));
    const data = snap.docs.map(d => d.data().title);
    setServices(data);
  };

  const createIndustry = async (title, icon) => {
    const docRef = doc(db, INDUSTRY_COLLECTION, title);
    const newIndustry = { ...defaultIndustry, title, icon, bannerData: { ...defaultIndustry.bannerData, title } };
    await setDoc(docRef, newIndustry);
    toast.success(`Industry "${title}" created`);
    fetchIndustries();
  };

  const saveIndustry = async () => {
    if (!selectedIndustry) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, INDUSTRY_COLLECTION, selectedIndustry), industryData);
      toast.success("Industry content deployed successfully");
      fetchIndustries();
    } catch (e) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const deleteIndustry = async (id) => {
    if (!window.confirm(`Delete the "${id}" industry page?`)) return;
    await deleteDoc(doc(db, INDUSTRY_COLLECTION, id));
    toast.info("Industry deleted");
    if (selectedIndustry === id) {
      setSelectedIndustry(null);
      setIndustryData(defaultIndustry);
    }
    fetchIndustries();
  };

  const openImageModal = (cb) => {
    setSelectedFile(null);
    setAfterUpload(() => cb);
    setModalOpen(true);
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
    setModalOpen(false);
    toast.success("Media uploaded");
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <CircularProgress sx={{ color: BRAND_COLOR }} />
      <p className="mt-4 text-slate-500 font-medium">Loading Industry Page...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 ">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#002b80] tracking-tight">Industry Page</h1>
          <p className="text-slate-500 mt-1">Design specialized hubs for your target markets.</p>
        </div>
        <NewIndustryModal onCreate={createIndustry} />
      </div>

      {/* INDUSTRY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {industries.map(ind => (
          <div key={ind.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden border border-slate-100 shadow-inner">
                {ind.icon?.url ? <img src={ind.icon.url} className="h-full w-full object-cover" /> : <div className="text-slate-300">No Icon</div>}
              </div>
              <h3 className="font-extrabold text-[#002b80] mb-4 text-lg">{ind.title}</h3>
              <div className="flex gap-2 w-full">
                <button 
                  className="flex-1 cursor-pointer py-2 rounded-xl bg-blue-50 text-[#002b80] text-xs font-bold hover:bg-[#002b80] hover:text-white transition-colors"
                  onClick={() => { setSelectedIndustry(ind.id); setIndustryData(ind); }}
                >
                  Configure
                </button>
                <button className="p-2 cursor-pointer rounded-xl text-slate-300 hover:text-red-500 transition-colors" onClick={() => deleteIndustry(ind.id)}>
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDITOR PANEL */}
      {selectedIndustry && (
        <div className="mt-12 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#002b80] px-10 py-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <PencilSquareIcon className="h-6 w-6 opacity-60" />
              <h2 className="text-xl font-bold">Industrial Design: {industryData.title}</h2>
            </div>
            <button onClick={() => setSelectedIndustry(null)} className="p-2 cursor-pointer hover:bg-white/10 rounded-full transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-10 space-y-12">
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <AdminSection title="Brand Asset">
                  <ImageUpload label="Industry Icon" image={industryData.icon.url} onUpload={() => openImageModal(img => setIndustryData(prev => ({ ...prev, icon: img })))} />
                </AdminSection>
                <AdminSection title="Availability">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Attach to Sections</label>
                  <FormControl fullWidth>
                    <Select
                      multiple
                      value={industryData.display || []}
                      onChange={e => setIndustryData(prev => ({ ...prev, display: e.target.value }))}
                      input={<OutlinedInput sx={{ borderRadius: '14px', bgcolor: '#f8fafc' }} />}
                      renderValue={selected => (
                        <div className="flex flex-wrap gap-1">
                          {selected.map(val => <Chip key={val} label={val} size="small" sx={{ bgcolor: '#002b80', color: 'white' }} />)}
                        </div>
                      )}
                    >
                      <MenuItem value="home">Home Page</MenuItem>
                      <MenuItem value="about">About Us</MenuItem>
                      {services.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                  </FormControl>
                </AdminSection>
              </div>

              <AdminSection title="Hero Component">
                <ImageUpload label="Banner Background" image={industryData.bannerData.image.url} onUpload={() => openImageModal(img => setIndustryData(prev => ({ ...prev, bannerData: { ...prev.bannerData, image: img } })))} />
                <div className="grid gap-4 mt-6">
                  <AdminInput label="Banner Title" value={industryData.bannerData.title} onChange={v => setIndustryData(prev => ({ ...prev, bannerData: { ...prev.bannerData, title: v } }))} />
                  <AdminTextarea label="Banner Description" value={industryData.bannerData.description} onChange={v => setIndustryData(prev => ({ ...prev, bannerData: { ...prev.bannerData, description: v } }))} />
                  <div className="grid grid-cols-2 gap-4">
                    <AdminInput label="CTA Text" value={industryData.bannerData.cta.title} onChange={v => setIndustryData(prev => ({ ...prev, bannerData: { ...prev.bannerData, cta: { ...prev.bannerData.cta, title: v } } }))} />
                    <AdminInput label="CTA Link" value={industryData.bannerData.cta.link} onChange={v => setIndustryData(prev => ({ ...prev, bannerData: { ...prev.bannerData, cta: { ...prev.bannerData.cta, link: v } } }))} />
                  </div>
                </div>
              </AdminSection>
            </div>

            {/* WHAT WE OFFER */}
            <AdminSection title="Offerings Grid">
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <AdminInput label="Section Title" value={industryData.subSection.title} onChange={v => setIndustryData(prev => ({ ...prev, subSection: { ...prev.subSection, title: v } }))} />
                <AdminTextarea label="Section Sub-description" value={industryData.subSection.description} onChange={v => setIndustryData(prev => ({ ...prev, subSection: { ...prev.subSection, description: v } }))} />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {industryData.subSection.cards.map((card, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 relative group/card">
                    <button onClick={() => {
                      const cards = industryData.subSection.cards.filter((_, idx) => idx !== i);
                      setIndustryData(prev => ({ ...prev, subSection: { ...prev.subSection, cards } }));
                    }} className="absolute cursor-pointer top-4 right-4 text-red-400 opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    
                    <div className="h-32 bg-white rounded-2xl mb-4 overflow-hidden relative border border-slate-100 shadow-sm">
                      {card.image?.url ? <img src={card.image.url} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-slate-300">No Image</div>}
                      <button onClick={() => openImageModal(img => {
                          const cards = [...industryData.subSection.cards]; cards[i] = { ...cards[i], image: img };
                          setIndustryData(prev => ({ ...prev, subSection: { ...prev.subSection, cards } }));
                        })} className="absolute cursor-pointer inset-0 bg-black/40 text-white text-[10px] font-bold opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        UPDATE PHOTO
                      </button>
                    </div>

                    <div className="space-y-3">
                      <AdminInput label="Tagline" value={card.text} onChange={v => { const cards = [...industryData.subSection.cards]; cards[i].text = v; setIndustryData(prev => ({ ...prev, subSection: { ...prev.subSection, cards } })); }} />
                      <AdminInput label="Card Heading" value={card.heading} onChange={v => { const cards = [...industryData.subSection.cards]; cards[i].heading = v; setIndustryData(prev => ({ ...prev, subSection: { ...prev.subSection, cards } })); }} />
                      <AdminTextarea label="Brief Info" value={card.description} onChange={v => { const cards = [...industryData.subSection.cards]; cards[i].description = v; setIndustryData(prev => ({ ...prev, subSection: { ...prev.subSection, cards } })); }} />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => setIndustryData(prev => ({ ...prev, subSection: { ...prev.subSection, cards: [...prev.subSection.cards, { heading: "", text: "", description: "", image: {} }] } }))}
                  className="border-2 cursor-pointer border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center text-slate-400 hover:border-[#002b80] hover:text-[#002b80] hover:bg-blue-50/50 transition-all"
                >
                  <PlusIcon className="h-10 w-10 mb-2" />
                  <span className="font-bold uppercase cursor-pointer text-[10px]">Add Feature Card</span>
                </button>
              </div>
            </AdminSection>

            {/* PROJECTS */}
            <AdminSection title="Linked Projects Summary">
              <div className="grid md:grid-cols-2 gap-6">
                <AdminInput label="Section Title" value={industryData.projectSection.title} onChange={v => setIndustryData(prev => ({ ...prev, projectSection: { ...prev.projectSection, title: v } }))} />
                <AdminTextarea label="Section Description" value={industryData.projectSection.description} onChange={v => setIndustryData(prev => ({ ...prev, projectSection: { ...prev.projectSection, description: v } }))} />
              </div>
            </AdminSection>

            <button 
              onClick={saveIndustry} 
              disabled={saving}
              className="w-full cursor-pointer bg-[#002b80] hover:bg-black text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : <><CheckCircleIcon className="h-6 w-6" /> Deploy Changes</>}
            </button>
          </div>
        </div>
      )}

      {/* MEDIA DIALOG */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '2rem' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: BRAND_COLOR }}>Asset Manager</DialogTitle>
        <DialogContent>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center group hover:border-blue-400 relative transition-colors bg-slate-50">
            {selectedFile ? (
              <img src={URL.createObjectURL(selectedFile)} className="rounded-xl mx-auto max-h-48 object-cover shadow-md" alt="Preview" />
            ) : (
              <div className="py-10">
                <CloudArrowUpIcon className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Image</p>
              </div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setSelectedFile(e.target.files[0])} />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <button className="px-6 py-2 cursor-pointer text-slate-400 font-bold text-sm" onClick={() => setModalOpen(false)}>Cancel</button>
          <button onClick={uploadImage} disabled={uploading || !selectedFile} className="bg-[#002b80] cursor-pointer text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 disabled:opacity-50">
            {uploading ? <CircularProgress size={16} color="inherit" /> : "Upload"}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

/* ---------------- NEW INDUSTRY MODAL ---------------- */
const NewIndustryModal = ({ onCreate }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadAndCreate = async () => {
    if (!title || !iconFile) return toast.warn("Title and Icon are required");
    setUploading(true);
    const form = new FormData();
    form.append("file", iconFile);
    form.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: form });
    const data = await res.json();
    const icon = { url: data.secure_url, public_id: data.public_id };
    await onCreate(title, icon);
    setUploading(false);
    setOpen(false);
    setTitle("");
    setIconFile(null);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex  cursor-pointer items-center justify-center gap-2 bg-[#002b80] hover:bg-black text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100">
        <PlusIcon className="h-5 w-5" /> Add Industry
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '2rem' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: BRAND_COLOR }}>Initialize Page</DialogTitle>
        <DialogContent className="space-y-6 pt-2">
          <AdminInput label="Industry Name" value={title} onChange={v => setTitle(v)} />
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center relative hover:border-blue-400 transition-colors">
            {iconFile ? (
               <img src={URL.createObjectURL(iconFile)} className="h-20 w-20 mx-auto object-cover rounded-lg shadow-sm" alt="Preview" />
            ) : (
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Upload Industry Icon</p>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setIconFile(e.target.files[0])} />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <button className="px-6 py-2 cursor-pointer text-slate-400 font-bold text-sm" onClick={() => setOpen(false)}>Discard</button>
          <button onClick={handleUploadAndCreate} disabled={uploading} className="bg-[#002b80] cursor-pointer text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg disabled:opacity-50">
            {uploading ? <CircularProgress size={16} color="inherit" /> : "Build Page"}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

/* ---------------- SHARED UI COMPONENTS ---------------- */
const AdminSection = ({ title, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <div className="h-1 w-8 bg-blue-500 rounded-full" />
      <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="bg-white border border-slate-100 p-2 rounded-[2rem]">{children}</div>
  </div>
);

const AdminInput = ({ label, value, onChange }) => (
  <div className="w-full">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
    <input 
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" 
      value={value ?? ""} 
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const AdminTextarea = ({ label, value, onChange }) => (
  <div className="w-full">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
    <textarea 
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all min-h-[100px]" 
      rows={4} 
      value={value ?? ""} 
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const ImageUpload = ({ label, image, onUpload }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
    <div className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 shadow-inner">
      {image ? <img src={image} className="h-full w-full object-cover" /> : <div className="h-full flex items-center justify-center text-slate-300">No Image</div>}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button onClick={onUpload} className="bg-white cursor-pointer text-blue-700 px-5 py-2 rounded-xl text-xs font-bold shadow-xl">Change Image</button>
      </div>
    </div>
  </div>
);