import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { 
  TrashIcon, 
  PlusIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  LinkIcon, 
  ShareIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";

const FOOTER_COLLECTION = "FooterDB";
const BRAND = "#070778";

const defaultFooter = {
  phoneNo: [],
  email: [],
  address: [],
  socialLinks: { facebook: "", twitter: "", instagram: "", linkedin: "", youtube: "" },
  companySection: [],
};

export default function AdminFooter() {
  const [footerData, setFooterData] = useState(defaultFooter);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => { fetchFooter(); }, []);

  const fetchFooter = async () => {
    const snap = await getDocs(collection(db, FOOTER_COLLECTION));
    if (snap.docs.length > 0) setFooterData(snap.docs[0].data());
    setLoading(false);
  };

  const saveFooter = async () => {
    setSaving(true);
    try {
      const snap = await getDocs(collection(db, FOOTER_COLLECTION));
      if (snap.docs.length > 0) {
        await updateDoc(doc(db, FOOTER_COLLECTION, snap.docs[0].id), footerData);
      } else {
        await setDoc(doc(collection(db, FOOTER_COLLECTION)), footerData);
      }
      notify("Global footer settings updated successfully");
    } catch (e) {
      notify("Error updating footer", "error");
    } finally {
      setSaving(false);
    }
  };

  const notify = (msg, sev = "success") => setNotification({ open: true, message: msg, severity: sev });

  const addItem = (type) => {
    const templates = {
      phoneNo: "",
      email: "",
      address: { text: "", mapLink: "" },
      companySection: { title: "", link: "" }
    };
    setFooterData(prev => ({ ...prev, [type]: [...prev[type], templates[type]] }));
  };

  const deleteItem = (type, index) => {
    setFooterData(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
      <CircularProgress sx={{ color: BRAND }} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-[#F9FAFB] min-h-screen text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-[#070778] font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <CheckBadgeIcon className="h-5 w-5" />
            <span>Site-Wide Assets</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Footer Management</h1>
          <p className="text-slate-500 mt-1 font-medium">Control global contact info and navigation links.</p>
        </div>
        <button 
          onClick={saveFooter}
          disabled={saving}
          className="bg-[#070778] hover:bg-[#05055a] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-70"
        >
          {saving ? <CircularProgress size={20} color="inherit" /> : "Publish Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CONTACT INFO GROUP */}
        <div className="space-y-8">
          {/* Phones */}
          <Section cardTitle="Phone Lines" icon={<PhoneIcon className="h-5 w-5" />} onAdd={() => addItem("phoneNo")}>
            {footerData.phoneNo.map((ph, i) => (
              <div key={i} className="flex gap-2 group">
                <InputBase placeholder="Primary Number" value={ph} onChange={(v) => {
                  const arr = [...footerData.phoneNo]; arr[i] = v;
                  setFooterData({ ...footerData, phoneNo: arr });
                }} />
                <DeleteBtn onClick={() => deleteItem("phoneNo", i)} />
              </div>
            ))}
          </Section>

          {/* Emails */}
          <Section cardTitle="Email Channels" icon={<EnvelopeIcon className="h-5 w-5" />} onAdd={() => addItem("email")}>
            {footerData.email.map((em, i) => (
              <div key={i} className="flex gap-2 group">
                <InputBase placeholder="contact@company.com" value={em} onChange={(v) => {
                  const arr = [...footerData.email]; arr[i] = v;
                  setFooterData({ ...footerData, email: arr });
                }} />
                <DeleteBtn onClick={() => deleteItem("email", i)} />
              </div>
            ))}
          </Section>

          {/* Addresses */}
          <Section cardTitle="Office Locations" icon={<MapPinIcon className="h-5 w-5" />} onAdd={() => addItem("address")}>
            {footerData.address.map((ad, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl space-y-3 border border-transparent hover:border-slate-200 transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Location #{i+1}</span>
                  <DeleteBtn onClick={() => deleteItem("address", i)} />
                </div>
                <InputBase placeholder="Full Address" value={ad.text} onChange={(v) => {
                  const arr = [...footerData.address]; arr[i].text = v;
                  setFooterData({ ...footerData, address: arr });
                }} />
                <InputBase placeholder="Google Maps URL" value={ad.mapLink} onChange={(v) => {
                  const arr = [...footerData.address]; arr[i].mapLink = v;
                  setFooterData({ ...footerData, address: arr });
                }} />
              </div>
            ))}
          </Section>
        </div>

        {/* LINKS GROUP */}
        <div className="space-y-8">
          {/* Socials */}
          <Section cardTitle="Social Presence" icon={<ShareIcon className="h-5 w-5" />}>
            <div className="grid gap-3">
              {Object.keys(footerData.socialLinks).map((key) => (
                <div key={key} className="flex items-center gap-4 bg-white p-2 pr-4 rounded-xl border border-slate-100 shadow-sm">
                  <span className="w-24 text-[10px] font-black uppercase text-[#070778] pl-2">{key}</span>
                  <input 
                    className="w-full text-sm border-none focus:ring-0 font-medium text-slate-600" 
                    placeholder={`${key}.com/profile`}
                    value={footerData.socialLinks[key]} 
                    onChange={(e) => setFooterData({
                      ...footerData, 
                      socialLinks: { ...footerData.socialLinks, [key]: e.target.value }
                    })} 
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* Quick Links */}
          <Section cardTitle="Navigation Links" icon={<LinkIcon className="h-5 w-5" />} onAdd={() => addItem("companySection")}>
            <div className="grid gap-4">
              {footerData.companySection.map((cs, i) => (
                <div key={i} className="flex gap-2 items-center bg-slate-50 p-3 rounded-2xl">
                  <div className="flex-1 space-y-2">
                    <input className="w-full bg-white rounded-lg px-3 py-1.5 text-xs font-bold border-none" placeholder="Title" value={cs.title} onChange={(e) => {
                       const arr = [...footerData.companySection]; arr[i].title = e.target.value;
                       setFooterData({ ...footerData, companySection: arr });
                    }} />
                    <input className="w-full bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 border-none" placeholder="Relative Link (e.g. /about)" value={cs.link} onChange={(e) => {
                       const arr = [...footerData.companySection]; arr[i].link = e.target.value;
                       setFooterData({ ...footerData, companySection: arr });
                    }} />
                  </div>
                  <DeleteBtn onClick={() => deleteItem("companySection", i)} />
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      <Snackbar open={notification.open} autoHideDuration={3000} onClose={() => setNotification(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={notification.severity} variant="filled" sx={{ borderRadius: '1rem', fontWeight: 600 }}>{notification.message}</Alert>
      </Snackbar>
    </div>
  );
}

/* ---------------- SUB-COMPONENTS ---------------- */
function Section({ cardTitle, icon, children, onAdd }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-slate-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="text-[#070778]">{icon}</div>
          <h2 className="text-lg font-black tracking-tight">{cardTitle}</h2>
        </div>
        {onAdd && (
          <Tooltip title="Add New">
            <IconButton onClick={onAdd} sx={{ bgcolor: '#eff6ff', color: '#070778', '&:hover': { bgcolor: '#070778', color: 'white' } }}>
              <PlusIcon className="h-4 w-4 stroke-[3px]" />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InputBase({ value, onChange, placeholder }) {
  return (
    <input 
      className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#070778] transition-all"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function DeleteBtn({ onClick }) {
  return (
    <IconButton onClick={onClick} sx={{ color: '#fda4af', '&:hover': { color: '#e11d48', bgcolor: '#fff1f2' } }}>
      <TrashIcon className="h-5 w-5" />
    </IconButton>
  );
}