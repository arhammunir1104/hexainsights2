import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { 
  TrashIcon, 
  PencilSquareIcon, 
  PlusIcon, 
  PhotoIcon, 
  XMarkIcon,
  CheckCircleIcon,
  UserGroupIcon,
  CloudArrowUpIcon
} from "@heroicons/react/24/outline";

const BRAND_COLOR = "#070778";
const CLOUD_NAME = "dg3ade8dr";
const UPLOAD_PRESET = "insights";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const STAFF_COLLECTION = "staffDB";
const SERVICES_COLLECTION = "servicesDB";
const DOC_ID = "main_content";

export default function AdminStaff() {
  const [data, setData] = useState({ title: "", staff: [] });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Workspace State
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  // Upload Modal State
  const [imageModal, setImageModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const staffSnap = await getDoc(doc(db, STAFF_COLLECTION, DOC_ID));
      if (staffSnap.exists()) setData(staffSnap.data());

      const servicesSnap = await getDocs(collection(db, SERVICES_COLLECTION));
      const serviceTitles = servicesSnap.docs.map((doc) => doc.data().uid || doc.data().title);
      setServices(["home", ...serviceTitles]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, STAFF_COLLECTION, DOC_ID), data);
      setNotification({ open: true, message: "Staff structure published!", severity: "success" });
    } catch (e) {
      setNotification({ open: true, message: "Publish failed", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const openEditor = (member = null, index = null) => {
    setEditingIndex(index);
    setSelectedStaff(member ? { ...member } : { title: "", image: { url: "", public_id: "" }, display: [] });
  };

  const commitStaffMember = () => {
    if (!selectedStaff.title || !selectedStaff.image.url) {
        setNotification({ open: true, message: "Name and Photo are required", severity: "warning" });
        return;
    }

    const newList = [...data.staff];
    if (editingIndex !== null) {
      newList[editingIndex] = selectedStaff;
    } else {
      newList.push(selectedStaff);
    }

    setData({ ...data, staff: newList });
    setSelectedStaff(null);
  };

  const removeStaffMember = (index) => {
    if(!window.confirm("Delete this staff member?")) return;
    const updated = data.staff.filter((_, i) => i !== index);
    setData({ ...data, staff: updated });
    setNotification({ open: true, message: "Member removed from list", severity: "info" });
  };

  const uploadToCloudinary = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", selectedFile);
      form.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: form });
      const resData = await res.json();
      
      setSelectedStaff(prev => ({ ...prev, image: { url: resData.secure_url, public_id: resData.public_id } }));
      setImageModal(false);
      setSelectedFile(null);
    } catch (e) {
      setNotification({ open: true, message: "Upload failed", severity: "error" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
      <CircularProgress size={30} sx={{ color: BRAND_COLOR }} />
      <p className="font-medium animate-pulse tracking-widest text-xs uppercase">Loading Staff Page...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFBFF] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <UserGroupIcon className="h-6 w-6 text-[#070778]" />
                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Team Management</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#070778] tracking-tight">Specialized Staff</h1>
            <p className="text-slate-500 font-medium">Manage and assign experts to specific service pages.</p>
          </div>
          <div className="flex gap-3">
            <button
                onClick={() => openEditor()}
                className="flex cursor-pointer items-center justify-center gap-2 bg-white text-[#070778] border-2 border-slate-100 px-6 py-3.5 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
                <PlusIcon className="h-5 w-5 stroke-[3px]" />
                Add Staff
            </button>
            <button
                onClick={handleSaveAll}
                disabled={saving}
                className="flex  cursor-pointer items-center justify-center gap-2 bg-[#070778] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
                {saving ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon className="h-5 w-5 stroke-[3px]" />}
                Deploy Changes
            </button>
          </div>
        </div>

        {/* SECTION: GLOBAL HEADING */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-12 flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/4">
                <h2 className="text-lg font-black text-[#070778] uppercase tracking-tight">Section Title</h2>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1">Live Website Header</p>
            </div>
            <input 
                className="flex-1 w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl px-6 py-4 outline-none font-bold text-slate-700 transition-all"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="e.g. Our Expert Medical Team"
            />
        </div>

        {/* STAFF GRID (List Mode) */}
        {!selectedStaff && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {data.staff.map((member, idx) => (
              <div key={idx} className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                    <img src={member.image.url} className="w-24 h-24 rounded-[2rem] object-cover ring-4 ring-slate-50 shadow-md group-hover:scale-105 transition-transform" alt={member.title} />
                    <button 
                        onClick={() => removeStaffMember(idx)}
                        className="absolute -top-2 -right-2 p-1.5  cursor-pointer bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
                <h3 className="text-lg font-black text-[#070778] mb-3">{member.title}</h3>
                
                <div className="flex flex-wrap justify-center gap-1 mb-6">
                    {member.display?.map(d => (
                        <span key={d} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-black uppercase tracking-tighter italic">
                            {d}
                        </span>
                    ))}
                </div>

                <button 
                  onClick={() => openEditor(member, idx)}
                  className="mt-auto  cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 font-bold text-[#070778] hover:bg-[#070778] hover:text-white transition-all"
                >
                  <PencilSquareIcon className="h-4 w-4" /> Edit
                </button>
              </div>
            ))}
          </div>
        )}

        {/* WORKSPACE EDITOR (Slide-in Mode) */}
        {selectedStaff && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-[#070778] px-8 py-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                    <span className="text-indigo-200 text-xs font-black uppercase tracking-widest italic">Personnel Workspace</span>
                    <h2 className="text-xl font-bold">{selectedStaff.title || "New Staff"}</h2>
                </div>
              </div>
              <button onClick={() => setSelectedStaff(null)} className="p-2  cursor-pointer hover:bg-white/10 rounded-full transition-colors">
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>

            <div className="p-8 sm:p-12 max-w-4xl mx-auto space-y-12">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Left: Image */}
                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Profile Photo</label>
                        <div 
                            onClick={() => setImageModal(true)}
                            className="aspect-square rounded-[3rem] bg-slate-50 border-4 border-dashed border-slate-100 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:border-indigo-200 transition-all"
                        >
                            {selectedStaff.image?.url ? (
                                <img src={selectedStaff.image.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Staff" />
                            ) : (
                                <div className="text-center">
                                    <CloudArrowUpIcon className="h-12 w-12 text-slate-200 mx-auto mb-2" />
                                    <p className="text-xs font-black text-slate-300 uppercase">Upload Image</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-[#070778]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <PhotoIcon className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Title</label>
                            <input 
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl px-6 py-4 outline-none font-bold text-[#070778] text-xl transition-all"
                                value={selectedStaff.title}
                                onChange={(e) => setSelectedStaff({...selectedStaff, title: e.target.value})}
                                placeholder="e.g. Product engineer"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Visibility Settings</label>
                            <FormControl fullWidth>
                                <Select
                                    multiple
                                    value={selectedStaff.display || []}
                                    onChange={(e) => setSelectedStaff({...selectedStaff, display: e.target.value})}
                                    input={<OutlinedInput sx={{ borderRadius: '20px', bgcolor: '#F8FAFC', border: 'none', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }} />}
                                    renderValue={(selected) => (
                                        <div className="flex flex-wrap gap-1">
                                            {selected.map((val) => (
                                                <Chip key={val} label={val} size="small" sx={{ bgcolor: BRAND_COLOR, color: 'white', fontWeight: 900, borderRadius: '8px' }} />
                                            ))}
                                        </div>
                                    )}
                                >
                                    {services.map((s) => (
                                        <MenuItem key={s} value={s} sx={{ fontWeight: 800, color: BRAND_COLOR }}>{s}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <p className="text-[10px] text-slate-400 font-bold uppercase px-1 leading-relaxed">
                                Select which service pages this staff member should be displayed on.
                            </p>
                        </div>

                        <button 
                            onClick={commitStaffMember}
                            className="w-full  cursor-pointer bg-[#070778] text-white py-5 rounded-2xl font-black uppercase tracking-[0.1em] shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Update List 
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: IMAGE UPLOADER */}
      <Dialog open={imageModal} onClose={() => setImageModal(false)} PaperProps={{ sx: { borderRadius: "2.5rem", padding: "1rem" } }}>
        <DialogContent className="text-center space-y-6">
          <h3 className="text-xl font-black text-[#070778] uppercase">Upload Profile Photo</h3>
          <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-dashed border-slate-200">
              {selectedFile ? (
                  <div className="space-y-4">
                      <img src={URL.createObjectURL(selectedFile)} className="w-48 h-48 mx-auto rounded-3xl object-cover shadow-2xl" alt="Preview" />
                      <p className="text-xs font-black text-indigo-400 uppercase">{selectedFile.name}</p>
                  </div>
              ) : (
                <div className="py-8">
                    <PhotoIcon className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-400">Drag or drop a square portrait</p>
                </div>
              )}
              <input type="file" id="staff-img" hidden accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
              <label htmlFor="staff-img" className="mt-6 inline-block bg-white text-[#070778] border-2 border-slate-100 px-8 py-3 rounded-xl font-black text-sm cursor-pointer hover:bg-slate-50">
                  Select File
              </label>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setImageModal(false)} className="flex-1  cursor-pointer py-4 font-black text-slate-400 uppercase text-xs">Cancel</button>
            <button 
                onClick={uploadToCloudinary} 
                disabled={uploading || !selectedFile}
                className="flex-1 bg-[#070778] text-white py-4  cursor-pointer rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100 disabled:opacity-30"
            >
              {uploading ? <CircularProgress size={18} color="inherit" /> : "Upload"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert severity={notification.severity} variant="filled" sx={{ borderRadius: '15px', fontWeight: 900 }}>{notification.message}</Alert>
      </Snackbar>
    </div>
  );
}