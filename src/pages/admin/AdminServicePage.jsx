// src/pages/admin/ServicePageCMS.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { TrashIcon, PlusIcon, PencilSquareIcon, CloudArrowUpIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------------- CLOUDINARY CONFIG ---------------- */
const CLOUD_NAME = "dg3ade8dr";
const UPLOAD_PRESET = "insights";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const SERVICES_COLLECTION = "servicesDB";
const INDUSTRY_COLLECTION = "industryDB";
const BRAND_COLOR = "#002b80";

const defaultService = {
  uid: "",
  title: "",
  icon: { url: "", public_id: "" },
  bannerData: { title: "", description: "", image: { url: "", public_id: "" }, cta: { title: "", link: "" } },
  subSection: { title: "What We Offer", description: "Our team combines modern technologies with industry-specific expertise to deliver solutions that scale with your business and deliver measurable impact.", cards: [] },
  specializedStaff: { heading: "Specialized Staff" },
  projectSection: { heading: "Featured Projects", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed tempor risus, vitae accumsan magna. Integer a eros efficitur, faucibus lectus a, pharetra nisi." },
  caseStudy: { heading: "Case Studies", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sed tempor risus, vitae accumsan magna. Integer a eros efficitur, faucibus lectus a, pharetra nisi." },
  display: [],
};

export default function ServicePageCMS() {
  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [afterUpload, setAfterUpload] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [newServiceModal, setNewServiceModal] = useState(false);
  const [newServiceData, setNewServiceData] = useState({ title: "", icon: null });

  useEffect(() => {
    fetchServices();
    fetchIndustries();
  }, []);

  const fetchServices = async () => {
    try {
      const snap = await getDocs(collection(db, SERVICES_COLLECTION));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setServices(data);
    } catch (e) {
      toast.error("Error loading services");
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustries = async () => {
    const snap = await getDocs(collection(db, INDUSTRY_COLLECTION));
    const data = snap.docs.map((doc) => doc.data().title);
    setIndustries(["home", "about", ...data]);
  };

  const createServicePage = async () => {
    if (!newServiceData.title || !newServiceData.icon) {
        return toast.warn("Title and Icon are required");
    }
    const uid = newServiceData.title.toLowerCase().replace(/\s+/g, "-");
    const docRef = doc(collection(db, SERVICES_COLLECTION));
    const newService = {
      ...defaultService,
      uid,
      title: newServiceData.title,
      bannerData: { ...defaultService.bannerData, title: newServiceData.title },
      icon: newServiceData.icon,
    };
    await setDoc(docRef, newService);
    setServices((prev) => [...prev, { id: docRef.id, ...newService }]);
    toast.success("Service Page Created");
    setNewServiceModal(false);
    setNewServiceData({ title: "", icon: null });
  };

  const saveService = async () => {
    if (!selectedService) return;
    setSaving(true);
    const { id, ...data } = selectedService;
    try {
      await updateDoc(doc(db, SERVICES_COLLECTION, id), data);
      setServices((prev) => prev.map((s) => (s.id === id ? selectedService : s)));
      toast.success("Service changes saved successfully");
    } catch (e) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    await deleteDoc(doc(db, SERVICES_COLLECTION, id));
    setServices((prev) => prev.filter((s) => s.id !== id));
    if (selectedService?.id === id) setSelectedService(null);
    toast.info("Service deleted");
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
    toast.success("Image uploaded");
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <CircularProgress sx={{ color: BRAND_COLOR }} />
      <p className="mt-4 text-slate-500 font-medium ">Loading Service Page...</p>
    </div>
  );
 
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 ">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#002b80] tracking-tight">Service Pages</h1>
          <p className="text-slate-500 mt-1">Create and manage independent landing pages for your services.</p>
        </div>
        <button 
          onClick={() => setNewServiceModal(true)}
          className="flex cursor-pointer items-center justify-center gap-2 bg-[#002b80] hover:bg-black text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-100"
        >
          <PlusIcon className="h-5 w-5" />  Add Service 
        </button>
      </div>

      {/* SERVICE CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden border border-slate-100 shadow-inner">
                {service.icon?.url ? (
                  <img src={service.icon.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-slate-300">No Icon</div>
                )}
              </div>
              <h3 className="font-extrabold text-[#002b80] mb-4 text-lg line-clamp-1">{service.title}</h3>
              <div className="flex gap-2 w-full">
                <button 
                  onClick={() => setSelectedService(service)}
                  className="flex-1  cursor-pointer py-2 rounded-xl bg-blue-50 text-[#002b80] text-xs font-bold hover:bg-[#002b80] hover:text-white transition-colors"
                >
                  Configure
                </button>
                <button 
                  onClick={() => deleteService(service.id)}
                  className="p-2 cursor-pointer rounded-xl text-slate-300 hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDITING PANEL */}
      {selectedService && (
        <div className="mt-12 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#002b80] px-10 py-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <PencilSquareIcon className="h-6 w-6 opacity-60" />
              <h2 className="text-xl font-bold">Editing: {selectedService.title}</h2>
            </div>
            <button onClick={() => setSelectedService(null)} className="p-2 cursor-pointer hover:bg-white/10 rounded-full">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-10 space-y-12">
            <div className="grid lg:grid-cols-2 gap-10">
               {/* Icon & Display */}
               <div className="space-y-8">
                  <AdminSection title="Core Assets">
                    <ImageUpload label="Navigation Icon (Transparent Recommended)" image={selectedService.icon?.url} onUpload={() => openImageModal((img) => setSelectedService((prev) => ({ ...prev, icon: img })))} />
                    
                    <div className="mt-6">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Associated Categories</label>
                      <FormControl fullWidth>
                        <Select
                          multiple
                          value={selectedService.display || []}
                          onChange={(e) => setSelectedService((prev) => ({ ...prev, display: e.target.value }))}
                          input={<OutlinedInput sx={{ borderRadius: '14px', bgcolor: '#f8fafc' }} />}
                          renderValue={(selected) => (
                            <div className="flex flex-wrap gap-1">
                              {selected.map((val) => <Chip key={val} label={val} size="small" sx={{ bgcolor: '#002b80', color: 'white', fontWeight: 600 }} />)}
                            </div>
                          )}
                        >
                          {industries.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </div>
                  </AdminSection>
               </div>

               {/* Banner Data */}
               <AdminSection title="Hero Header">
                 <ImageUpload label="Hero Background Image" image={selectedService.bannerData?.image?.url} onUpload={() => openImageModal((img) => setSelectedService((prev) => ({ ...prev, bannerData: { ...prev.bannerData, image: img } })))}/>
                 <div className="grid gap-4 mt-6">
                  <AdminInput label="Banner Title" value={selectedService.bannerData.title} onChange={(v) => setSelectedService((prev) => ({ ...prev, bannerData: { ...prev.bannerData, title: v } }))}/>
                  <AdminTextarea label="Banner Description" value={selectedService.bannerData.description} onChange={(v) => setSelectedService((prev) => ({ ...prev, bannerData: { ...prev.bannerData, description: v } }))}/>
                  <div className="grid grid-cols-2 gap-4">
                    <AdminInput label="Button Label" value={selectedService.bannerData.cta.title} onChange={(v) => setSelectedService((prev) => ({ ...prev, bannerData: { ...prev.bannerData, cta: { ...prev.bannerData.cta, title: v } } }))}/>
                    <AdminInput label="Button Link" value={selectedService.bannerData.cta.link} onChange={(v) => setSelectedService((prev) => ({ ...prev, bannerData: { ...prev.bannerData, cta: { ...prev.bannerData.cta, link: v } } }))}/>
                  </div>
                 </div>
               </AdminSection>
            </div>

            {/* What We Offer */}
            <AdminSection title="Service Features (What We Offer)">
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <AdminInput label="Section Title" value={selectedService.subSection.title} onChange={(v) => setSelectedService((prev) => ({ ...prev, subSection: { ...prev.subSection, title: v } }))}/>
                <AdminInput label="Section Sub-description" value={selectedService.subSection.description} onChange={(v) => setSelectedService((prev) => ({ ...prev, subSection: { ...prev.subSection, description: v } }))}/>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedService.subSection.cards.map((card, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 relative group/card">
                    <button onClick={() => {
                      const cards = selectedService.subSection.cards.filter((_, idx) => idx !== i);
                      setSelectedService((prev) => ({ ...prev, subSection: { ...prev.subSection, cards } }));
                    }} className="absolute cursor-pointer top-4 right-4 text-red-400 opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    
                    <div className="h-32 bg-white rounded-2xl mb-4 overflow-hidden relative shadow-sm border border-slate-100">
                      {card.image?.url ? <img src={card.image.url} className="w-full h-full object-cover" alt="" /> : <div className="h-full flex items-center justify-center text-slate-300">No Image</div>}
                      <button onClick={() => openImageModal((img) => setSelectedService((prev) => {
                          const cards = [...prev.subSection.cards]; cards[i] = { ...cards[i], image: img }; return { ...prev, subSection: { ...prev.subSection, cards } };
                        }))} className="absolute cursor-pointer inset-0 bg-black/40 text-white text-[10px] font-bold opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        UPDATE PHOTO
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <AdminInput label="Sub-title" value={card.text} onChange={(v) => { const cards = [...selectedService.subSection.cards]; cards[i].text = v; setSelectedService((prev) => ({ ...prev, subSection: { ...prev.subSection, cards } })); }}/>
                      <AdminInput label="Main Heading" value={card.heading} onChange={(v) => { const cards = [...selectedService.subSection.cards]; cards[i].heading = v; setSelectedService((prev) => ({ ...prev, subSection: { ...prev.subSection, cards } })); }}/>
                      <AdminTextarea label="Feature Info" value={card.description} onChange={(v) => { const cards = [...selectedService.subSection.cards]; cards[i].description = v; setSelectedService((prev) => ({ ...prev, subSection: { ...prev.subSection, cards } })); }}/>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => setSelectedService((prev) => ({ ...prev, subSection: { ...prev.subSection, cards: [...prev.subSection.cards, { heading: "", text: "", description: "", image: { url: "", public_id: "" } }] } }))}
                  className="border-2 cursor-pointer border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center text-slate-400 hover:border-[#002b80] hover:text-[#002b80] hover:bg-blue-50/50 transition-all"
                >
                  <PlusIcon className="h-10 w-10 mb-2" />
                  <span className="font-bold uppercase text-[10px] tracking-widest">New Feature Card</span>
                </button>
              </div>
            </AdminSection>

            {/* Small Content Sections */}
            <div className="grid md:grid-cols-3 gap-8">
              <AdminSection title="Staff Section">
                <AdminInput label="Headline" value={selectedService.specializedStaff.heading} onChange={(v) => setSelectedService((prev) => ({ ...prev, specializedStaff: { heading: v } }))}/>
              </AdminSection>
              <AdminSection title="Project Preview">
                <AdminInput label="Heading" value={selectedService.projectSection.heading} onChange={(v) => setSelectedService((prev) => ({ ...prev, projectSection: { ...prev.projectSection, heading: v } }))}/>
                <div className="mt-3">
                  <AdminTextarea label="Intro Description" value={selectedService.projectSection.description} onChange={(v) => setSelectedService((prev) => ({ ...prev, projectSection: { ...prev.projectSection, description: v } }))}/>
                </div>
              </AdminSection>
              <AdminSection title="Case Study">
                <AdminInput label="Heading" value={selectedService.caseStudy.heading} onChange={(v) => setSelectedService((prev) => ({ ...prev, caseStudy: { ...prev.caseStudy, heading: v } }))}/>
                <div className="mt-3">
                  <AdminTextarea label="Intro Description" value={selectedService.caseStudy.description} onChange={(v) => setSelectedService((prev) => ({ ...prev, caseStudy: { ...prev.caseStudy, description: v } }))}/>
                </div>
              </AdminSection>
            </div>

            <button 
              onClick={saveService} 
              disabled={saving}
              className="w-full cursor-pointer bg-[#002b80] hover:bg-black text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-blue-100 transition-all active:scale-[0.99] flex items-center justify-center gap-3"
            >
              {saving ? <CircularProgress size={24} color="inherit"/> : <><CheckCircleIcon className="h-6 w-6" /> Deploy Service Updates</>}
            </button>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '2rem' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: BRAND_COLOR }}>Media Manager</DialogTitle>
        <DialogContent>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center group hover:border-blue-400 relative transition-colors">
            {selectedFile ? (
              <img src={URL.createObjectURL(selectedFile)} className="rounded-xl mx-auto max-h-48 object-cover shadow-md" alt="Preview" />
            ) : (
              <div className="py-10">
                <CloudArrowUpIcon className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Resource</p>
              </div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFile(e.target.files[0])}/>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <button className="px-6 py-2 cursor-pointer text-slate-400 font-bold text-sm" onClick={() => setModalOpen(false)}>Cancel</button>
          <button 
            disabled={uploading || !selectedFile} 
            onClick={uploadImage}
            className="bg-[#002b80] cursor-pointer text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {uploading ? <CircularProgress size={16} color="inherit" /> : "Upload"}
          </button>
        </DialogActions>
      </Dialog>

      {/* NEW SERVICE MODAL */}
      <Dialog open={newServiceModal} onClose={() => setNewServiceModal(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '2rem' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: BRAND_COLOR }}>New Service Page</DialogTitle>
        <DialogContent className="space-y-6 pt-2">
          <AdminInput label="Unique Page Title" value={newServiceData.title} onChange={(v) => setNewServiceData((prev) => ({ ...prev, title: v }))}/>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Icon Selection</label>
            <div onClick={() => openImageModal((img) => setNewServiceData((prev) => ({ ...prev, icon: img })))} className="bg-slate-50 border border-slate-200 rounded-2xl h-32 flex items-center justify-center cursor-pointer hover:border-blue-300 transition-all overflow-hidden group">
               {newServiceData.icon?.url ? (
                 <img src={newServiceData.icon.url} className="h-full w-full object-contain p-4" alt="" />
               ) : (
                 <PhotoIcon className="h-10 w-10 text-slate-200 group-hover:text-blue-300 transition-colors" />
               )}
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <button className="px-6 py-2 cursor-pointer text-slate-400 font-bold text-sm" onClick={() => setNewServiceModal(false)}>Discard</button>
          <button 
            onClick={createServicePage}
            className="bg-[#002b80] cursor-pointer text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            Create Service Page
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

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
        <button onClick={onUpload} className="bg-white cursor-pointer text-blue-700 px-5 py-2 rounded-xl text-xs font-bold shadow-xl">Upload</button>
      </div>
    </div>
  </div>
);

const PhotoIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6.75a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v12.75a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);