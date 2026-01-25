import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Switch,
  IconButton,
  Tooltip,
} from "@mui/material";
import { 
  UserPlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  PhotoIcon,
  GlobeAltIcon,
  UserGroupIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

/* ---------------- CONFIG ---------------- */
const BRAND = "#070778";
const COLLECTION = "teamsDB";
const CLOUD_NAME = "dg3ade8dr";
const UPLOAD_PRESET = "insights";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const defaultMember = {
  name: "",
  designation: "",
  image: { url: "", public_id: "" },
  socials: { facebook: "", instagram: "", twitter: "" },
  visible: true,
};

export default function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    const snap = await getDocs(collection(db, COLLECTION));
    setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const uploadImage = async () => {
    if (!file) return null;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    return { url: data.secure_url, public_id: data.public_id };
  };

  const saveMember = async () => {
    setLoading(true);
    try {
      let image = selected.image;
      if (file) image = await uploadImage();
      const payload = { ...selected, image };

      if (selected.id) {
        await updateDoc(doc(db, COLLECTION, selected.id), payload);
        notify("Profile updated successfully");
      } else {
        await addDoc(collection(db, COLLECTION), payload);
        notify("New member added to the roster");
      }
      setModalOpen(false);
      setFile(null);
      setSelected(null);
      fetchMembers();
    } catch (e) {
      notify("Error saving changes", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id) => {
    if(!window.confirm("Delete this team member?")) return;
    await deleteDoc(doc(db, COLLECTION, id));
    notify("Member removed", "info");
    fetchMembers();
  };

  const toggleVisibility = async (m) => {
    await updateDoc(doc(db, COLLECTION, m.id), { visible: !m.visible });
    notify(m.visible ? "Member hidden from public site" : "Member is now live");
    fetchMembers();
  };

  const notify = (msg, sev = "success") => setNotification({ open: true, message: msg, severity: sev });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-[#F9FAFB] min-h-screen text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-[#070778] font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <UserGroupIcon className="h-5 w-5" />
            <span>Human Resources</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Our Team</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage executive profiles and social links.</p>
        </div>
        <button 
          onClick={() => { setSelected(defaultMember); setModalOpen(true); }}
          className="bg-[#070778] cursor-pointer hover:bg-[#05055a] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-900/10 transition-all active:scale-95"
        >
          <UserPlusIcon className="h-5 w-5" />
          Add Member
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {members.map((m) => (
          <div key={m.id} className={`group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 ${!m.visible && 'opacity-60 grayscale'}`}>
            <div className="relative h-72">
              {m.image?.url ? (
                <img src={m.image.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                  <PhotoIcon className="h-12 w-12" />
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow-sm">
                <Switch size="small" checked={m.visible} onChange={() => toggleVisibility(m)} />
              </div>
            </div>

            <div className="p-6 text-center">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">{m.name || "Unnamed Member"}</h3>
              <p className="text-[#070778] font-bold text-xs uppercase tracking-widest mt-1 mb-4">{m.designation || "No Title Set"}</p>
              
              <div className="flex justify-center gap-4 mb-6 text-slate-400">
                <Tooltip title="Facebook"><a href={m.socials.facebook} target="_blank" className="hover:text-blue-600 transition-colors"><FaFacebookF /></a></Tooltip>
                <Tooltip title="Instagram"><a href={m.socials.instagram} target="_blank" className="hover:text-pink-600 transition-colors"><FaInstagram /></a></Tooltip>
                <Tooltip title="Twitter"><a href={m.socials.twitter} target="_blank" className="hover:text-sky-500 transition-colors"><FaTwitter /></a></Tooltip>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-50">
                <button 
                  onClick={() => { setSelected(m); setModalOpen(true); }}
                  className="flex-1 bg-slate-50 cursor-pointer hover:bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <PencilSquareIcon className="h-4 w-4" /> Edit
                </button>
                <button 
                  onClick={() => deleteMember(m.id)}
                  className="flex-1 bg-slate-50 cursor-pointer hover:bg-red-50 text-red-500 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '2.5rem', p: 1 } }}
      >
        <DialogTitle className="flex justify-between items-center px-6 pt-6">
          <span className="text-2xl font-black tracking-tight">{selected?.id ? "Update Profile" : "New Roster Entry"}</span>
          <IconButton onClick={() => setModalOpen(false)}><XMarkIcon className="h-6 w-6" /></IconButton>
        </DialogTitle>

        <DialogContent className="space-y-6">
          {/* Image Upload Area */}
          <div className="relative group h-56 bg-slate-50 rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
            {(file || selected?.image?.url) ? (
              <img src={file ? URL.createObjectURL(file) : selected.image.url} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <PhotoIcon className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Portrait Photo</span>
              </div>
            )}
            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-black text-xs uppercase tracking-[0.2em]">
              Upload Image
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
            </label>
          </div>

          <div className="grid gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] ml-1">Full Name</label>
              <input className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 font-bold focus:ring-2 focus:ring-[#070778] transition-all" value={selected?.name || ""} onChange={(e) => setSelected(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] ml-1">Designation</label>
              <input className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 font-bold focus:ring-2 focus:ring-[#070778] transition-all" value={selected?.designation || ""} onChange={(e) => setSelected(p => ({ ...p, designation: e.target.value }))} />
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-[2rem] space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#070778] flex items-center gap-2">
              <GlobeAltIcon className="h-4 w-4" /> Social Suite
            </h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 bg-white p-2  rounded-xl border border-slate-100">
                <FaFacebookF className="text-blue-600 ml-2" />
                <input placeholder="Facebook Link" className="w-full outline-0 text-sm border-none focus:ring-0 font-medium" value={selected?.socials.facebook || ""} onChange={(e) => setSelected(p => ({ ...p, socials: { ...p.socials, facebook: e.target.value } }))} />
              </div>
              <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100">
                <FaInstagram className="text-pink-600 ml-2" />
                <input placeholder="Instagram Link" className="w-full outline-0 text-sm border-none focus:ring-0 font-medium" value={selected?.socials.instagram || ""} onChange={(e) => setSelected(p => ({ ...p, socials: { ...p.socials, instagram: e.target.value } }))} />
              </div>
              <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100">
                <FaTwitter className="text-sky-500 ml-2" />
                <input placeholder="Twitter Link" className="w-full outline-0 text-sm border-none focus:ring-0 font-medium" value={selected?.socials.twitter || ""} onChange={(e) => setSelected(p => ({ ...p, socials: { ...p.socials, twitter: e.target.value } }))} />
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions className="p-8 pt-2">
          <Button onClick={() => setModalOpen(false)} sx={{ fontWeight: 700, textTransform: 'none', color: 'slate.500', cursor: "pointer"  }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={saveMember} 
            disabled={loading || uploading}
            sx={{ bgcolor: BRAND, borderRadius: '1.25rem', px: 6, py: 1.5, fontWeight: 800, textTransform: 'none', cursor: "pointer" ,fontSize: '1rem', '&:hover': { bgcolor: '#05055a' } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Save Profile"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000} 
        onClose={() => setNotification(p => ({ ...p, open: false }))} 
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={notification.severity} variant="filled" sx={{ borderRadius: '1.25rem', fontWeight: 600 }}>{notification.message}</Alert>
      </Snackbar>
    </div>
  );
}