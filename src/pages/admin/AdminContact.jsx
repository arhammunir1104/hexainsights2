// src/pages/admin/AdminContactCMS.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Snackbar,
  Alert,
  Button,
  TextField,
  IconButton,
  MenuItem,
  Divider,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { 
  PlusIcon, 
  TrashIcon, 
  PhotoIcon, 
  XMarkIcon, 
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  MapPinIcon,
  ShareIcon
} from "@heroicons/react/24/outline";

const BRAND = "#070778";
const COLLECTION = "contactPageDB";
const DOC_ID = "main";

// Cloudinary info
const CLOUD_NAME = "dg3ade8dr";
const UPLOAD_PRESET = "insights";
const BRAND_COLOR = "#002b80";

export default function AdminContact() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* ---------------- NOTIFICATION ---------------- */
  const [notify, setNotify] = useState({ open: false, message: "", severity: "success" });
  const showNotify = (message, severity = "success") => setNotify({ open: true, message, severity });

  /* ---------------- IMAGE MODAL STATE ---------------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [targetPath, setTargetPath] = useState(null); 
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  /* ---------------- DATA STRUCTURE ---------------- */
  const [data, setData] = useState({
    BannerSection: { 
      image: "", 
      title: "", 
      description: "",
      Cta: { text: "", link: "" } 
    },
    header: { title: "", description: "" },
    leftCard: {
      heading: "",
      description: "",
      phones: [],
      emails: [],
      addresses: [],
      socials: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        youtube: ""
      }
    },
    form: { fields: [] }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
      if (snap.exists()) {
        const dbData = snap.data();
        // Deep merge logic to ensure CTA and other nests don't break
        setData(prev => ({
          ...prev,
          ...dbData,
          BannerSection: {
            ...prev.BannerSection,
            ...(dbData.BannerSection || {}),
            Cta: { ...prev.BannerSection.Cta, ...(dbData.BannerSection?.Cta || {}) }
          },
          leftCard: {
            ...prev.leftCard,
            ...(dbData.leftCard || {}),
            socials: { ...prev.leftCard.socials, ...(dbData.leftCard?.socials || {}) }
          }
        }));
      }
    } catch {
      showNotify("Failed to load contact data", "error");
    } finally {
      setFetching(false);
    }
  };

  const saveAll = async () => {
    try {
      setLoading(true);
      await setDoc(doc(db, COLLECTION, DOC_ID), {
        ...data,
        updatedAt: new Date()
      });
      showNotify("Contact page deployed successfully");
    } catch {
      showNotify("Failed to save changes", "error");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
      const img = await res.json();
      
      const updatedData = { ...data };
      let ref = updatedData;
      for (let i = 0; i < targetPath.length - 1; i++) ref = ref[targetPath[i]];
      ref[targetPath[targetPath.length - 1]] = img.secure_url;

      setData(updatedData);
      showNotify("Asset updated");
      closeModal();
    } catch (e) {
      showNotify("Upload failed", "error");
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

   if (fetching) return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <CircularProgress sx={{ color: BRAND_COLOR }} />
        <p className="mt-4 text-slate-500 font-medium ">Loading Contact Page...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 ">
      <div className="max-w-6xl mx-auto space-y-10">

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-[#070778]">Contact Page </h1>
            <p className="text-slate-500 text-sm mt-1">Manage inquiries and company touchpoints</p>
          </div>
          {/* <Chip label="Live Production" variant="outlined" sx={{ fontWeight: 700, borderColor: BRAND, color: BRAND }} /> */}
        </div>

        {/* HERO SECTION */}
        <AdminSection title="Hero Banner" icon={<PhotoIcon className="h-5 w-5" />}>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="relative h-56 bg-slate-100 rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 group">
                  {data.BannerSection?.image ? (
                    <img src={data.BannerSection.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <PhotoIcon className="h-10 w-10 mb-2 opacity-20" />
                        <span className="text-xs font-bold uppercase tracking-widest">No Background</span>
                    </div>
                  )}
                  <button
                    onClick={() => { setTargetPath(["BannerSection", "image"]); setModalOpen(true); }}
                    className="absolute cursor-pointer inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm"
                  >
                    Change Image
                  </button>
                </div>
            </div>
            <div className="space-y-4">
                <AdminInput label="Hero Heading" value={data.BannerSection.title} onChange={v => setData({ ...data, BannerSection: { ...data.BannerSection, title: v } })} />
                <AdminInput label="Hero Description" multiline value={data.BannerSection.description} onChange={v => setData({ ...data, BannerSection: { ...data.BannerSection, description: v } })} />
                <div className="grid grid-cols-2 gap-4">
                    <AdminInput label="CTA Text" value={data.BannerSection.Cta.text} onChange={v => setData({ ...data, BannerSection: { ...data.BannerSection, Cta: { ...data.BannerSection.Cta, text: v } } })} />
                    <AdminInput label="CTA Link" value={data.BannerSection.Cta.link} onChange={v => setData({ ...data, BannerSection: { ...data.BannerSection, Cta: { ...data.BannerSection.Cta, link: v } } })} />
                </div>
            </div>
          </div>
        </AdminSection>

        {/* INFO CARD SECTION */}
        <AdminSection title="Contact Credentials" icon={<DevicePhoneMobileIcon className="h-5 w-5" />}>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
              <AdminInput label="Card Heading" value={data.leftCard.heading} onChange={v => setData({ ...data, leftCard: { ...data.leftCard, heading: v } })} />
              <AdminInput label="Sub-text" value={data.leftCard.description} onChange={v => setData({ ...data, leftCard: { ...data.leftCard, description: v } })} />
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <DynamicList icon={<DevicePhoneMobileIcon className="h-4 w-4" />} label="Phone Numbers" items={data.leftCard.phones} onChange={v => setData({ ...data, leftCard: { ...data.leftCard, phones: v } })} />
            <DynamicList icon={<EnvelopeIcon className="h-4 w-4" />} label="Email Channels" items={data.leftCard.emails} onChange={v => setData({ ...data, leftCard: { ...data.leftCard, emails: v } })} />
            <DynamicList icon={<MapPinIcon className="h-4 w-4" />} label="Office Addresses" items={data.leftCard.addresses} onChange={v => setData({ ...data, leftCard: { ...data.leftCard, addresses: v } })} />
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2 text-[#070778] font-bold text-sm uppercase tracking-wider">
                <ShareIcon className="h-4 w-4" /> Social Profiles
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.keys(data.leftCard.socials).map(key => (
                  <AdminInput 
                    key={key} 
                    label={key} 
                    value={data.leftCard.socials[key]} 
                    onChange={v => setData({ ...data, leftCard: { ...data.leftCard, socials: { ...data.leftCard.socials, [key]: v } } })} 
                  />
                ))}
            </div>
          </div>
        </AdminSection>

        {/* FORM BUILDER */}
        <AdminSection title="Inquiry Form Builder" icon={<PlusIcon className="h-5 w-5" />}>
          <div className="flex justify-between items-center mb-6">
            <p className="text-slate-500 text-sm">Configure fields for the front-end contact form.</p>
            <Button variant="contained" onClick={() => setData(prev => ({ ...prev, form: { fields: [...prev.form.fields, { id: crypto.randomUUID(), type: "text", heading: "", required: false, options: [] }] } }))} startIcon={<PlusIcon className="h-4 w-4" />} sx={{ bgcolor: BRAND, borderRadius: '12px', cursor: "pointer" }}>Add Field</Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {data.form.fields.map(field => (
              <div key={field.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative group">
                <IconButton 
                    onClick={() => setData(prev => ({ ...prev, form: { fields: prev.form.fields.filter(f => f.id !== field.id) } }))} 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                    color="error"
                >
                    <TrashIcon className="h-4 w-4" />
                </IconButton>

                <div className="space-y-4">
                    <AdminInput label="Field Label" value={field.heading} onChange={v => setData(prev => ({ ...prev, form: { fields: prev.form.fields.map(f => f.id === field.id ? { ...f, heading: v } : f) } }))} />
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Input Type"
                        value={field.type}
                        onChange={e => setData(prev => ({ ...prev, form: { fields: prev.form.fields.map(f => f.id === field.id ? { ...f, type: e.target.value } : f) } }))}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    >
                        <MenuItem value="text">Short Text</MenuItem>
                        <MenuItem value="email">Email Address</MenuItem>
                        <MenuItem value="textarea">Large Textbox</MenuItem>
                        <MenuItem value="radio">Multiple Choice (Radio)</MenuItem>
                    </TextField>

                    {field.type === "radio" && (
                        <div className="pt-2 border-t border-slate-100">
                            <DynamicList label="Radio Options" items={field.options} onChange={opts => setData(prev => ({ ...prev, form: { fields: prev.form.fields.map(f => f.id === field.id ? { ...f, options: opts } : f) } }))} />
                        </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </AdminSection>

        <button
          onClick={saveAll}
          disabled={loading}
          className="w-full cursor-pointer bg-[#070778] hover:bg-black text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Deploy Changes"}
        </button>

        {/* IMAGE UPLOAD DIALOG */}
        <Dialog open={modalOpen} onClose={closeModal} PaperProps={{ sx: { borderRadius: '2rem', p: 1 } }}>
            <DialogTitle sx={{ fontWeight: 800, color: BRAND }}>Media Manager</DialogTitle>
            <DialogContent>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 relative group cursor-pointer">
                    {preview ? <img src={preview} className="max-h-40 mx-auto rounded-lg shadow-md" /> : <div className="py-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Select Image Asset</div>}
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => { if(e.target.files[0]) { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); } }} />
                </div>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={closeModal} sx={{ cursor: "pointer", color: 'slate.400', fontWeight: 700 }}>Cancel</Button>
                <Button onClick={uploadImage} disabled={uploading || !file} variant="contained" sx={{ cursor: "pointer", bgcolor: BRAND, px: 4, borderRadius: '12px' }}>
                    {uploading ? <CircularProgress size={20} color="inherit" /> : "Upload"}
                </Button>
            </DialogActions>
        </Dialog>

        <Snackbar open={notify.open} autoHideDuration={3000} onClose={() => setNotify({ ...notify, open: false })} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert severity={notify.severity} variant="filled" sx={{ borderRadius: '12px' }}>{notify.message}</Alert>
        </Snackbar>
      </div>
    </div>
  );
}

/* ---------------- UI SUB-COMPONENTS ---------------- */

const AdminSection = ({ title, icon, children }) => (
  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
    <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-white rounded-xl shadow-sm text-[#070778]">{icon}</div>
        <h2 className="text-sm font-extrabold text-[#070778] uppercase tracking-widest">{title}</h2>
    </div>
    <div className="p-8">{children}</div>
  </div>
);

const AdminInput = ({ label, multiline, value, onChange }) => (
  <div className="w-full">
    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
    <TextField 
        fullWidth 
        multiline={multiline} 
        rows={multiline ? 4 : 1} 
        value={value || ""} 
        onChange={e => onChange(e.target.value)} 
        size="small"
        sx={{ 
            '& .MuiOutlinedInput-root': { 
                borderRadius: '12px',
                bgcolor: '#fcfcfc',
                fontSize: '0.875rem'
            } 
        }}
    />
  </div>
);

const DynamicList = ({ label, icon, items, onChange }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">
        {icon} {label}
    </div>
    {items.map((v, i) => (
      <div key={i} className="flex gap-2 group">
        <TextField 
            fullWidth 
            size="small" 
            value={v} 
            onChange={e => onChange(items.map((item, idx) => idx === i ? e.target.value : item))} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: 'white' } }}
        />
        <IconButton onClick={() => onChange(items.filter((_, idx) => idx !== i))} color="error" size="small">
            <TrashIcon className="h-4 w-4" />
        </IconButton>
      </div>
    ))}
    <Button 
        size="small" 
        onClick={() => onChange([...items, ""])}
        sx={{ color: BRAND, fontWeight: 700, fontSize: '0.7rem', cursor: "pointer" }}
    >
        + Add Entry
    </Button>
  </div>
);