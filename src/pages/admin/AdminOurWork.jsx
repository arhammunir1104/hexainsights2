import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { 
  PhotoIcon, 
  ArrowUpTrayIcon, 
  CheckCircleIcon, 
  XMarkIcon,
  DocumentTextIcon 
} from "@heroicons/react/24/outline";

const BRAND = "#070778";
const COLLECTION = "ourWorkPage";
const DOC_ID = "main";

const DEFAULT_DATA = {
  banner: {
    heading: "",
    description: "",
    imageUrl: "",
    publicId: ""
  },
  section: {
    heading: "",
    description: ""
  }
};

export default function AdminOurWork() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const ref = doc(db, COLLECTION, DOC_ID);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setData(snap.data());
      } else {
        await setDoc(ref, DEFAULT_DATA);
      }
    } catch {
      toast.error("Failed to load Our Work page data");
    }
  };

  const saveContent = async () => {
    try {
      setSaving(true);
      await updateDoc(doc(db, COLLECTION, DOC_ID), {
        banner: data.banner,
        section: data.section
      });
      toast.success("Page content updated successfully");
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const uploadBannerImage = async () => {
    if (!selectedImage) return toast.error("Please select an image");

    try {
      setUploading(true);
      const CLOUD_NAME = "dg3ade8dr";
      const UPLOAD_PRESET = "insights";
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData
      });
      const result = await res.json();

      await updateDoc(doc(db, COLLECTION, DOC_ID), {
        banner: {
          ...data.banner,
          imageUrl: result.secure_url,
          publicId: result.public_id
        }
      });

      toast.success("Banner image live");
      setModalOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-[#070778] tracking-tight">Our Work Page</h1>
            <p className="text-slate-500 font-medium mt-1 text-lg">Manage your portfolio's main landing content.</p>
          </div>
          <button
            onClick={saveContent}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: BRAND }}
          >
            {saving ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircleIcon className="h-6 w-6" />}
            {saving ? "Publishing..." : "Publish Changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Hero Banner Module */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-[#070778]">
                <PhotoIcon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-[#070778]">Hero Banner Module</h3>
            </div>

            <div className="p-8">
              <div className="relative group rounded-[2rem] overflow-hidden bg-slate-100 mb-8 border-4 border-slate-50 h-[320px]">
                {data.banner.imageUrl ? (
                  <img src={data.banner.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Banner" />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                    <PhotoIcon className="h-12 w-12 opacity-20" />
                    <p className="font-bold text-sm">No Background Image Set</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-[#070778] rounded-xl font-black text-sm shadow-2xl hover:bg-indigo-50 transition-colors"
                  >
                    <ArrowUpTrayIcon className="h-4 w-4 stroke-[3px]" />
                    Update Background Image
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Hero Heading"
                  placeholder="e.g. Innovating the Future"
                  value={data.banner.heading}
                  onChange={v => setData({ ...data, banner: { ...data.banner, heading: v } })}
                />
                <Input
                  label="Hero Description"
                  multiline
                  placeholder="Tell your story..."
                  value={data.banner.description}
                  onChange={v => setData({ ...data, banner: { ...data.banner, description: v } })}
                />
              </div>
            </div>
          </div>

          {/* Intro Section Module */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
             <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-[#070778]">
                <DocumentTextIcon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-[#070778]">Intro Content Module</h3>
            </div>
            
            <div className="p-8 grid grid-cols-1 gap-6">
              <Input
                label="Section Heading"
                placeholder="Highlight your impact"
                value={data.section.heading}
                onChange={v => setData({ ...data, section: { ...data.section, heading: v } })}
              />
              <Input
                label="Section Description"
                multiline
                placeholder="Detailed context about your portfolio..."
                value={data.section.description}
                onChange={v => setData({ ...data, section: { ...data.section, description: v } })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modern Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#070778]/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-black text-[#070778]">Media Asset</h3>
                <p className="text-slate-400 text-sm font-medium">Update banner background</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="relative border-2 border-dashed border-slate-200 rounded-[1.5rem] p-4 text-center bg-slate-50 group hover:border-indigo-300 transition-colors">
              {preview ? (
                <img src={preview} className="rounded-xl max-h-64 w-full object-cover shadow-lg mx-auto" alt="Preview" />
              ) : (
                <div className="py-12 flex flex-col items-center">
                  <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                    <PhotoIcon className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-bold">Drag and drop or click to browse</p>
                  <p className="text-slate-400 text-xs mt-1">PNG, JPG, or WEBP (Max 5MB)</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={e => {
                  const file = e.target.files[0];
                  setSelectedImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </div>

            <div className="flex gap-3 mt-8">
              <button
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                onClick={() => { setPreview(""); setSelectedImage(null); }}
              >
                Clear
              </button>
              <button
                onClick={uploadBannerImage}
                disabled={uploading || !selectedImage}
                className="flex-[2] py-4 rounded-xl text-white font-black shadow-lg shadow-indigo-100 disabled:bg-slate-200 transition-all hover:brightness-110"
                style={{ backgroundColor: BRAND }}
              >
                {uploading ? "Uploading to Cloud..." : "Confirm & Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Input = ({ label, value, onChange, multiline, placeholder }) => (
  <div className="space-y-2 group">
    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#070778]">
      {label}
    </label>
    {multiline ? (
      <textarea
        placeholder={placeholder}
        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-600 min-h-[140px] leading-relaxed shadow-inner shadow-slate-100/50"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    ) : (
      <input
        placeholder={placeholder}
        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700 shadow-inner shadow-slate-100/50"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    )}
  </div>
);