// src/pages/admin/HomePageCMS.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { PlusIcon, TrashIcon, CloudArrowUpIcon, CheckIcon } from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ---------------- CLOUDINARY CONFIG ---------------- */
const CLOUD_NAME = "dg3ade8dr";
const UPLOAD_PRESET = "insights";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const HOME_DOC = "homepage";

const defaultHome = {
  BannerSection: { image: { url: "", public_id: "" }, title: "", description: "", Ctr: { text: "", link: "" } },
  locationsSection: { title: "", description: "", images: [] },
  aboutSection: { image: { url: "", public_id: "" }, title: "", description: "", ctr: { title: "", link: "" } },
  servicesWeOfferSection: { title: "", description: "", ctr: { title: "", link: "" } },
};

export default function HomePageCMS() {
  const [home, setHome] = useState(defaultHome);
  const [draftHome, setDraftHome] = useState(defaultHome);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [afterUpload, setAfterUpload] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { initHome(); }, []);

  const initHome = async () => {
    const refDoc = doc(db, "pages", HOME_DOC);
    const snap = await getDoc(refDoc);
    if (!snap.exists()) {
      await setDoc(refDoc, defaultHome);
      setHome(defaultHome);
      setDraftHome(defaultHome);
    } else {
      const data = snap.data() || {};
      const loaded = {
        BannerSection: { ...defaultHome.BannerSection, ...data.BannerSection },
        locationsSection: { ...defaultHome.locationsSection, ...data.locationsSection, images: Array.isArray(data?.locationsSection?.images) ? data.locationsSection.images : [] },
        aboutSection: { ...defaultHome.aboutSection, ...data.aboutSection },
        servicesWeOfferSection: { ...defaultHome.servicesWeOfferSection, ...data.servicesWeOfferSection },
      };
      setHome(loaded);
      setDraftHome(loaded);
    }
    setLoading(false);
  };

  const saveSection = async (sectionKey) => {
    try {
      setSaving(true);
      const payload = { [sectionKey]: draftHome[sectionKey] };
      await updateDoc(doc(db, "pages", HOME_DOC), payload);
      setHome(prev => ({ ...prev, ...payload }));
      toast.success(`${sectionKey.replace(/([A-Z])/g, ' $1')} updated successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update ${sectionKey}`);
    } finally {
      setSaving(false);
    }
  };

  const openImageModal = (cb) => { setSelectedFile(null); setAfterUpload(() => cb); setModalOpen(true); };

  const uploadImage = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", selectedFile);
    form.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: form });
      const data = await res.json();
      afterUpload({ url: data.secure_url, public_id: data.public_id });
      toast.success("Image uploaded successfully!");
      setModalOpen(false);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <CircularProgress size={40} sx={{ color: '#003eb3' }} />
      <p className="mt-4 text-slate-500 font-medium">Syncing Home Page Data...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 font-[Quicksand]">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#002b80] tracking-tight">Home Page CMS</h1>
          <p className="text-slate-500 text-sm mt-1">Manage content, images, and CTA links for the homepage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* HERO BANNER SECTION */}
        <Section title="Hero / Banner Section">
          <div className="grid md:grid-cols-2 gap-8">
            <ImageUpload
              label="Banner Image"
              image={draftHome.BannerSection.image.url}
              onUpload={() => openImageModal(img => setDraftHome(prev => ({ ...prev, BannerSection: { ...prev.BannerSection, image: img } })))}
            />
            <div className="space-y-4">
              <Input label="Main Title" value={draftHome.BannerSection.title} onChange={v => setDraftHome(prev => ({ ...prev, BannerSection: { ...prev.BannerSection, title: v } }))} />
              <Textarea label="Hero Description" value={draftHome.BannerSection.description} onChange={v => setDraftHome(prev => ({ ...prev, BannerSection: { ...prev.BannerSection, description: v } }))} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="CTA Button Text" value={draftHome.BannerSection.Ctr.text} onChange={v => setDraftHome(prev => ({ ...prev, BannerSection: { ...prev.BannerSection, Ctr: { ...prev.BannerSection.Ctr, text: v } } }))} />
                <Input label="CTA Destination Link" value={draftHome.BannerSection.Ctr.link} onChange={v => setDraftHome(prev => ({ ...prev, BannerSection: { ...prev.BannerSection, Ctr: { ...prev.BannerSection.Ctr, link: v } } }))} />
              </div>
              <SaveButton onClick={() => saveSection("BannerSection")} loading={saving} />
            </div>
          </div>
        </Section>

        {/* LOCATIONS SECTION */}
        <Section title="Locations Section">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Section Title" value={draftHome.locationsSection.title} onChange={v => setDraftHome(prev => ({ ...prev, locationsSection: { ...prev.locationsSection, title: v } }))} />
              <Input label="Section Subtext" value={draftHome.locationsSection.description} onChange={v => setDraftHome(prev => ({ ...prev, locationsSection: { ...prev.locationsSection, description: v } }))} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftHome.locationsSection.images.map((img, i) => (
                <div key={i} className="group relative bg-slate-50 rounded-2xl p-4 border border-slate-200 transition-all hover:border-blue-300">
                  {img.url && <img src={img.url} className="h-32 w-full object-cover rounded-xl mb-3 shadow-sm" alt="Location" />}
                  <Input label="Location Name / Alt" value={img.text || ""} onChange={v => {
                    const images = [...draftHome.locationsSection.images]; images[i] = { ...images[i], text: v };
                    setDraftHome(prev => ({ ...prev, locationsSection: { ...prev.locationsSection, images } }));
                  }} />
                  <button 
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur shadow-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all" 
                    onClick={() => setDraftHome(prev => ({ ...prev, locationsSection: { ...prev.locationsSection, images: prev.locationsSection.images.filter((_, idx) => idx !== i) } }))}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button 
                className="h-full min-h-[160px] border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                onClick={() => openImageModal(img => setDraftHome(prev => ({ ...prev, locationsSection: { ...prev.locationsSection, images: [...prev.locationsSection.images, { ...img, text: "" }] } })))}
              >
                <PlusIcon className="h-8 w-8 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider">Add Location</span>
              </button>
            </div>
            <SaveButton onClick={() => saveSection("locationsSection")} loading={saving} />
          </div>
        </Section>

        {/* ABOUT SECTION */}
        <Section title="About Us Section">
          <div className="grid md:grid-cols-2 gap-8">
            <ImageUpload
              label="Side Image"
              image={draftHome.aboutSection.image.url}
              onUpload={() => openImageModal(img => setDraftHome(prev => ({ ...prev, aboutSection: { ...prev.aboutSection, image: img } })))}
            />
            <div className="space-y-4">
              <Input label="Title" value={draftHome.aboutSection.title} onChange={v => setDraftHome(prev => ({ ...prev, aboutSection: { ...prev.aboutSection, title: v } }))} />
              <Textarea label="About Content" value={draftHome.aboutSection.description} onChange={v => setDraftHome(prev => ({ ...prev, aboutSection: { ...prev.aboutSection, description: v } }))} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Button Text" value={draftHome.aboutSection.ctr.title} onChange={v => setDraftHome(prev => ({ ...prev, aboutSection: { ...prev.aboutSection, ctr: { ...prev.aboutSection.ctr, title: v } } }))} />
                <Input label="Button Link" value={draftHome.aboutSection.ctr.link} onChange={v => setDraftHome(prev => ({ ...prev, aboutSection: { ...prev.aboutSection, ctr: { ...prev.aboutSection.ctr, link: v } } }))} />
              </div>
              <SaveButton onClick={() => saveSection("aboutSection")} loading={saving} />
            </div>
          </div>
        </Section>

        {/* SERVICES SECTION */}
        <Section title="Services Preview Section">
          <div className="space-y-4">
            <Input label="Headline" value={draftHome.servicesWeOfferSection.title} onChange={v => setDraftHome(prev => ({ ...prev, servicesWeOfferSection: { ...prev.servicesWeOfferSection, title: v } }))} />
            <Textarea label="Subtext" value={draftHome.servicesWeOfferSection.description} onChange={v => setDraftHome(prev => ({ ...prev, servicesWeOfferSection: { ...prev.servicesWeOfferSection, description: v } }))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="CTA Text" value={draftHome.servicesWeOfferSection.ctr.title} onChange={v => setDraftHome(prev => ({ ...prev, servicesWeOfferSection: { ...prev.servicesWeOfferSection, ctr: { ...prev.servicesWeOfferSection.ctr, title: v } } }))} />
              <Input label="CTA Link" value={draftHome.servicesWeOfferSection.ctr.link} onChange={v => setDraftHome(prev => ({ ...prev, servicesWeOfferSection: { ...prev.servicesWeOfferSection, ctr: { ...prev.servicesWeOfferSection.ctr, link: v } } }))} />
            </div>
            <SaveButton onClick={() => saveSection("servicesWeOfferSection")} loading={saving} />
          </div>
        </Section>
      </div>

      {/* IMAGE UPLOAD MODAL */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '24px', padding: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: "#002b80", fontSize: '1.5rem' }}>Update Visual</DialogTitle>
        <DialogContent>
          <div className="mt-2 group relative border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-blue-400 transition-all">
            {selectedFile ? (
              <img src={URL.createObjectURL(selectedFile)} className="rounded-xl mx-auto max-h-48 object-cover" alt="Preview" />
            ) : (
              <div className="py-10">
                <CloudArrowUpIcon className="h-12 w-12 text-slate-300 mx-auto group-hover:text-blue-500 transition-colors" />
                <p className="text-slate-500 text-sm mt-2">Select a high-resolution image</p>
              </div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setSelectedFile(e.target.files[0])} />
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <button className="px-4 py-2 text-slate-500 font-bold text-sm" onClick={() => setModalOpen(false)}>Cancel</button>
          <button 
            disabled={uploading || !selectedFile} 
            onClick={uploadImage}
            className="flex items-center gap-2 bg-[#003eb3] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {uploading ? <CircularProgress size={16} color="inherit" /> : <><CheckIcon className="h-4 w-4" /> Finalize Upload</>}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

/* ---------------- MODERN UI COMPONENTS ---------------- */
const Section = ({ title, children }) => (
  <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
    <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
      <h2 className="text-lg font-extrabold text-[#002b80] tracking-tight">{title}</h2>
      <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
    </div>
    <div className="p-8 space-y-6">{children}</div>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div className="w-full">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
    <input 
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" 
      value={value ?? ""} 
      onChange={e => onChange(e.target.value)} 
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div className="w-full">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
    <textarea 
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all min-h-[100px]" 
      rows={4} 
      value={value ?? ""} 
      onChange={e => onChange(e.target.value)} 
    />
  </div>
);

const ImageUpload = ({ label, image, onUpload }) => (
  <div className="space-y-3">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group overflow-hidden rounded-2xl border border-slate-200 h-64 bg-slate-100 shadow-inner">
      {image ? (
        <img src={image} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Visual" />
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center text-slate-400">
           <CloudArrowUpIcon className="h-10 w-10 mb-2 opacity-20" />
           <span className="text-xs font-medium">Empty Frame</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button onClick={onUpload} className="bg-white text-blue-700 px-5 py-2 rounded-xl text-xs font-extrabold shadow-xl active:scale-95 transition-all">
          Change Media
        </button>
      </div>
    </div>
  </div>
);

const SaveButton = ({ onClick, loading }) => (
  <button 
    onClick={onClick} 
    disabled={loading}
    className="w-full py-3 bg-[#002b80] hover:bg-black text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-70 mt-2 flex items-center justify-center gap-2"
  >
    {loading ? <CircularProgress size={16} color="inherit" /> : <><CheckIcon className="h-4 w-4" /> Deploy Changes</>}
  </button>
);