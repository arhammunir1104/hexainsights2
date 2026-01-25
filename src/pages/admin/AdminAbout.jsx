// src/pages/admin/AdminAboutPage.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  PlusIcon, 
  TrashIcon, 
  PhotoIcon, 
  XMarkIcon, 
  CloudArrowUpIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { CircularProgress } from "@mui/material";

const BRAND_COLOR = "#002b80";
const COLLECTION = "AboutUsDB";
const DOC_ID = "content";

// Cloudinary info
const CLOUD_NAME = "dg3ade8dr";
const UPLOAD_PRESET = "insights";

const DEFAULT_DATA = {
  BannerSection: { 
    image: "", 
    title: "", 
    description: "",
    Cta: { text: "", link: "" } 
  },
  subSection: { title: "", description: "" },
  cards: [],
  corporateSection: { title: "", description: "", corporateCards: [] },
};

export default function AdminAboutPage() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Image Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [targetPath, setTargetPath] = useState(null); 
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
      if (snap.exists()) {
        const dbData = snap.data();
        setData({
          ...DEFAULT_DATA,
          ...dbData,
          BannerSection: {
            ...DEFAULT_DATA.BannerSection,
            ...(dbData.BannerSection || {}),
            Cta: { 
              ...DEFAULT_DATA.BannerSection.Cta, 
              ...(dbData.BannerSection?.Cta || {}) 
            }
          }
        });
      } else {
        await setDoc(doc(db, COLLECTION, DOC_ID), DEFAULT_DATA);
      }
    } catch (e) {
      toast.error("Failed to load About page data");
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, COLLECTION, DOC_ID), {
        ...data,
        updatedAt: new Date()
      });
      toast.success("About Page updated successfully!");
    } catch (e) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async () => {
    if (!file) return toast.error("Select an image first");
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: fd }
      );
      const img = await res.json();
      if (!img.secure_url) throw new Error("Upload failed");

      const updatedData = { ...data };
      let ref = updatedData;
      for (let i = 0; i < targetPath.length - 1; i++) ref = ref[targetPath[i]];
      ref[targetPath[targetPath.length - 1]] = img.secure_url;

      setData(updatedData);
      toast.success("Image uploaded successfully");
      closeModal();
    } catch (e) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setFile(null);
    setPreview("");
    setTargetPath(null);
  };

  const updateCard = (section, index, patch) => {
    const cards = [...data[section]];
    cards[index] = { ...cards[index], ...patch };
    setData({ ...data, [section]: cards });
  };

  const removeCard = (section, index) => {
    const cards = data[section].filter((_, i) => i !== index);
    setData({ ...data, [section]: cards });
  };

  const addCard = (section, template) => {
    setData({ ...data, [section]: [...data[section], template] });
  };

  const updateCorporateCard = (index, patch) => {
    const cards = [...data.corporateSection.corporateCards];
    cards[index] = { ...cards[index], ...patch };
    setData({ ...data, corporateSection: { ...data.corporateSection, corporateCards: cards } });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <CircularProgress size={40} sx={{ color: BRAND_COLOR }} />
      <p className="mt-4 text-slate-500 font-medium ">Loading About Us Page...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 ">
      <ToastContainer position="top-right" />
      
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-[#002b80] tracking-tight">About Us CMS</h1>
          <p className="text-slate-500 mt-1">Configure your brand story, mission cards, and corporate values.</p>
        </div>
        <button 
            onClick={saveData} 
            disabled={saving}
            className="hidden cursor-pointer md:flex items-center gap-2 bg-[#002b80] hover:bg-black text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-70"
        >
            {saving ? <CircularProgress size={18} color="inherit" /> : <><CheckCircleIcon className="h-5 w-5" /> Deploy Changes</>}
        </button>
      </header>

      {/* BANNER SECTION */}
      <AdminSection title="Hero Banner">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Banner Media</label>
            <div className="relative group aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
                {data.BannerSection.image ? (
                    <img src={data.BannerSection.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Banner" />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                        <PhotoIcon className="h-12 w-12 mb-1 opacity-20" />
                        <span className="text-xs">No image set</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button 
                        onClick={() => { setTargetPath(["BannerSection", "image"]); setModalOpen(true); }}
                        className="bg-white cursor-pointer text-blue-700 px-4 py-2 rounded-xl text-xs font-bold shadow-xl"
                    >
                        Change Image
                    </button>
                </div>
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4">
            <AdminInput label="Main Heading" value={data.BannerSection.title} onChange={v => setData({ ...data, BannerSection: { ...data.BannerSection, title: v } })} />
            <AdminTextarea label="Introduction Paragraph" value={data.BannerSection.description} onChange={v => setData({ ...data, BannerSection: { ...data.BannerSection, description: v } })} />
            <div className="grid grid-cols-2 gap-4">
              <AdminInput label="CTA Label" value={data.BannerSection.Cta?.text} onChange={v => setData({ ...data, BannerSection: { ...data.BannerSection, Cta: { ...data.BannerSection.Cta, text: v } } })} />
              <AdminInput label="CTA Redirect URL" value={data.BannerSection.Cta?.link} onChange={v => setData({ ...data, BannerSection: { ...data.BannerSection, Cta: { ...data.BannerSection.Cta, link: v } } })} />
            </div>
          </div>
        </div>
      </AdminSection>

      {/* SUB SECTION */}
      <AdminSection title="Mission Statement">
        <div className="grid md:grid-cols-2 gap-4">
          <AdminInput label="Sub-title" value={data.subSection.title} onChange={v => setData({ ...data, subSection: { ...data.subSection, title: v } })} />
          <AdminTextarea label="Detailed Description" value={data.subSection.description} onChange={v => setData({ ...data, subSection: { ...data.subSection, description: v } })} />
        </div>
      </AdminSection>

      {/* CARDS SECTION */}
      <AdminSection title="Brand Pillars">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.cards.map((c, i) => (
            <div key={i} className="group relative bg-slate-50/50 border border-slate-200 rounded-3xl p-6 transition-all hover:border-blue-300 hover:shadow-sm">
              <button onClick={() => removeCard("cards", i)} className="absolute cursor-pointer top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                <TrashIcon className="h-5 w-5" />
              </button>
              
              <div className="mb-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Card Graphic</label>
                <div className="h-32 bg-slate-100 rounded-2xl overflow-hidden relative">
                  {c.image ? <img src={c.image} className="w-full h-full object-cover" alt="card" /> : <div className="h-full w-full flex items-center justify-center text-slate-300"><PhotoIcon className="h-8 w-8" /></div>}
                  <button onClick={() => { setTargetPath(["cards", i, "image"]); setModalOpen(true); }} className="absolute cursor-pointer inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-all flex items-center justify-center text-white text-xs font-bold">Edit Image</button>
                </div>
              </div>

              <div className="space-y-3">
                <AdminInput label="Pillar Label" value={c.heading} onChange={v => updateCard("cards", i, { heading: v })} />
                <AdminInput label="Main Title" value={c.title} onChange={v => updateCard("cards", i, { title: v })} />
                <AdminTextarea label="Pillar Content" value={c.description} onChange={v => updateCard("cards", i, { description: v })} />
              </div>
            </div>
          ))}
          <button 
            onClick={() => addCard("cards", { image: "", heading: "", title: "", description: "" })}
            className="flex flex-col cursor-pointer items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-10 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all group"
          >
            <PlusIcon className="h-10 w-10 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-wider">Add Pillar Card</span>
          </button>
        </div>
      </AdminSection>

      {/* CORPORATE VALUES */}
      <AdminSection title="Corporate Core Values">
        <div className="bg-slate-50 p-6 rounded-2xl mb-8 grid md:grid-cols-2 gap-4">
            <AdminInput label="Section Header" value={data.corporateSection.title} onChange={v => setData({ ...data, corporateSection: { ...data.corporateSection, title: v } })} />
            <AdminTextarea label="Values Intro" value={data.corporateSection.description} onChange={v => setData({ ...data, corporateSection: { ...data.corporateSection, description: v } })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.corporateSection.corporateCards.map((c, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm relative group hover:border-blue-300 transition-all">
               <button onClick={() => {
                   const cards = data.corporateSection.corporateCards.filter((_, idx) => idx !== i);
                   setData({ ...data, corporateSection: { ...data.corporateSection, corporateCards: cards } });
               }} className="absolute -top-2 -right-2 cursor-pointer bg-white border shadow-sm text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                <TrashIcon className="h-4 w-4" />
              </button>

              <div className="mb-4">
                <div className="h-20 w-20 bg-blue-50 rounded-2xl mx-auto flex items-center justify-center relative overflow-hidden group/icon">
                  {c.icon ? <img src={c.icon} className="h-full w-full object-contain p-2" alt="icon" /> : <PhotoIcon className="h-8 w-8 text-blue-200" />}
                  <button onClick={() => { setTargetPath(["corporateSection", "corporateCards", i, "icon"]); setModalOpen(true); }} className="absolute cursor-pointer inset-0 bg-[#002b80]/80 text-white opacity-0 group-hover/icon:opacity-100 flex items-center justify-center transition-all">
                    <CloudArrowUpIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <AdminInput label="Value Name" value={c.title} onChange={v => updateCorporateCard(i, { title: v })} />
              <div className="mt-3">
                <AdminTextarea label="Short Description" value={c.description} onChange={v => updateCorporateCard(i, { description: v })} />
              </div>
            </div>
          ))}
          <button 
            onClick={() => setData({ ...data, corporateSection: { ...data.corporateSection, corporateCards: [...data.corporateSection.corporateCards, { icon: "", title: "", description: "" }] }})}
            className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-6 text-slate-400 hover:text-[#002b80] transition-all"
          >
            <PlusIcon className="h-8 w-8 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Add Value</span>
          </button>
        </div>
      </AdminSection>

      <div className="md:hidden pt-10">
        <button onClick={saveData} disabled={saving} className="w-full cursor-pointer bg-[#002b80] text-white py-4 rounded-2xl font-bold shadow-lg">
            {saving ? "Saving Changes..." : "Publish Page Updates"}
        </button>
      </div>

      {/* IMAGE UPLOAD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={closeModal} className="absolute cursor-pointer top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <h3 className="text-xl font-extrabold text-[#002b80] mb-6">Update Media</h3>
            
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 mb-6 text-center group hover:border-blue-400 transition-colors relative">
                {preview ? (
                    <img src={preview} className="rounded-xl max-h-48 mx-auto object-cover border border-slate-100 shadow-sm" alt="preview" />
                ) : (
                    <div className="py-8">
                        <CloudArrowUpIcon className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 font-medium">Click or drag to select image</p>
                    </div>
                )}
                <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => { 
                        if(e.target.files[0]) {
                            setFile(e.target.files[0]); 
                            setPreview(URL.createObjectURL(e.target.files[0])); 
                        }
                    }}
                />
            </div>

            <div className="flex gap-3">
              <button className="flex-1 cursor-pointer py-3 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all" onClick={closeModal}>Cancel</button>
              <button 
                onClick={uploadImage} 
                disabled={uploading || !file} 
                className="flex-1 py-3 cursor-pointer bg-[#002b80] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 disabled:opacity-50 hover:bg-black transition-all"
              >
                {uploading ? <CircularProgress size={18} color="inherit" /> : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div> 
  );
}

/* ---------------- SHARED UI COMPONENTS ---------------- */

const AdminSection = ({ title, children }) => (
  <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
    <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
      <h2 className="text-lg font-extrabold text-[#002b80] tracking-tight">{title}</h2>
      <div className="h-2 w-2 rounded-full bg-blue-500" />
    </div>
    <div className="p-8">{children}</div>
  </div>
);

const AdminInput = ({ label, value, onChange }) => (
  <div className="w-full">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
    <input 
      type="text"
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" 
      value={value ?? ""} 
      onChange={e => onChange(e.target.value)} 
    />
  </div>
);

const AdminTextarea = ({ label, value, onChange }) => (
  <div className="w-full">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
    <textarea 
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all min-h-[80px]" 
      rows={3} 
      value={value ?? ""} 
      onChange={e => onChange(e.target.value)} 
    />
  </div>
);