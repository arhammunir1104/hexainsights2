import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  ListSubheader,
} from "@mui/material";
import { 
  TrashIcon, 
  PencilSquareIcon, 
  PlusIcon, 
  PhotoIcon, 
  XMarkIcon,
  CheckCircleIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";

const BRAND_COLOR = "#070778";
const CLOUD_NAME = "dg3ade8dr";
const UPLOAD_PRESET = "insights";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const PROJECTS_COLLECTION = "featuredProjectsDB";
const SERVICES_COLLECTION = "servicesDB";
const INDUSTRIES_COLLECTION = "industryDB";

const defaultProject = {
  uid: "",
  title: "",
  image: { url: "", public_id: "" }, 
  shortDescription: "",
  banner: { heading: "", description: "" },
  subSection: {
    heading: "",
    description: "",
    cards: [],
  },
  display: [],
  keywords: [],
};

export default function FeaturedProjectsCMS() {
  const [projects, setProjects] = useState([]);
  const [displayOptions, setDisplayOptions] = useState({ services: [], industries: [] });
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [afterUpload, setAfterUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ title: "", image: null, shortDescription: "" });
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchProjects();
    fetchOptions();
  }, []);

  const fetchProjects = async () => {
    const snap = await getDocs(collection(db, PROJECTS_COLLECTION));
    setProjects(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const fetchOptions = async () => {
    try {
      const [serviceSnap, industrySnap] = await Promise.all([
        getDocs(collection(db, SERVICES_COLLECTION)),
        getDocs(collection(db, INDUSTRIES_COLLECTION))
      ]);
      setDisplayOptions({
        services: serviceSnap.docs.map((doc) => doc.data().title || doc.data().uid),
        industries: industrySnap.docs.map((doc) => doc.data().title || doc.data().uid)
      });
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const createProject = async () => {
    if (!newProjectData.title || !newProjectData.image) return;
    const uid = newProjectData.title.toLowerCase().replace(/\s+/g, "-");
    const docRef = doc(collection(db, PROJECTS_COLLECTION));
    const newProject = { ...defaultProject, uid, title: newProjectData.title, image: newProjectData.image, shortDescription: newProjectData.shortDescription };
    await setDoc(docRef, newProject);
    setProjects((prev) => [...prev, { id: docRef.id, ...newProject }]);
    setNotification({ open: true, message: "Project created successfully", severity: "success" });
    setNewProjectModal(false);
    setNewProjectData({ title: "", image: null, shortDescription: "" });
  };

  const saveProject = async () => {
    if (!selectedProject) return;
    setSaving(true);
    const { id, ...data } = selectedProject;
    await updateDoc(doc(db, PROJECTS_COLLECTION, id), data);
    setProjects((prev) => prev.map((p) => (p.id === id ? selectedProject : p)));
    setNotification({ open: true, message: "Project updated", severity: "success" });
    setSaving(false);
  };

  const deleteProject = async (id) => {
    if(!window.confirm("Delete this project permanently?")) return;
    await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProject?.id === id) setSelectedProject(null);
    setNotification({ open: true, message: "Project deleted", severity: "info" });
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
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
      <CircularProgress size={30} sx={{ color: BRAND_COLOR }} />
      <p className="font-medium animate-pulse">Loading Project Page...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFBFF] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#070778] tracking-tight">Featured Projects CMS</h1>
            <p className="text-slate-500 mt-1 font-medium">Showcase your best work across services and industries.</p>
          </div>
          <button
            onClick={() => setNewProjectModal(true)}
            className="flex  cursor-pointer items-center justify-center gap-2 bg-[#070778] text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all active:scale-95"
          >
            <PlusIcon className="h-5 cursor-pointer w-5 stroke-[3px]" />
            Add New Project
          </button>
        </div>

        {/* LIST GRID */}
        {!selectedProject && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in duration-500">
            {projects.map((project) => (
              <div key={project.id} className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  {project.image?.url ? (
                    <img src={project.image.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><PhotoIcon className="h-12 w-12" /></div>
                  )}
                  <div className="absolute top-4 right-4">
                    <button onClick={() => deleteProject(project.id)} className="p-2  cursor-pointer bg-white/90 backdrop-blur hover:bg-red-50 text-red-500 rounded-xl shadow-sm transition-colors">
                      <TrashIcon className="h-5  cursor-pointer w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[#070778] mb-2">{project.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">{project.shortDescription}</p>
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="mt-auto w-full cursor-pointer flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-50 font-bold text-[#070778] hover:bg-[#070778] hover:text-white transition-all"
                  >
                    <PencilSquareIcon className="h-5 w-5" /> Edit Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EDIT WORKSPACE */}
        {selectedProject && (
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-[#070778] px-6 sm:px-8 py-6 flex justify-between items-center text-white">
              <div>
                <span className="text-indigo-200 text-xs font-black uppercase tracking-widest">Editing Project</span>
                <h2 className="text-xl sm:text-2xl font-bold">{selectedProject.title}</h2>
              </div>
              <button onClick={() => setSelectedProject(null)} className="p-2  cursor-pointer hover:bg-white/10 rounded-full transition-colors">
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>

            <div className="p-6 sm:p-12 space-y-12">
              <section className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <SectionHeader title="Discovery Content" subtitle="Card display and SEO settings" />
                  <div className="space-y-6">
                    <ImageUpload label="Project Thumbnail" image={selectedProject.image?.url} onUpload={() => openImageModal((img) => setSelectedProject((p) => ({ ...p, image: img })))} />
                    <Input label="Short Description" value={selectedProject.shortDescription} onChange={(v) => setSelectedProject((p) => ({ ...p, shortDescription: v }))} />
                    
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">SEO Keywords</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedProject.keywords.map((k, i) => (
                          <Chip key={i} label={k} onDelete={() => setSelectedProject((p) => ({ ...p, keywords: p.keywords.filter((_, idx) => idx !== i) }))} sx={{ borderRadius: '8px', fontWeight: 600 }} />
                        ))}
                      </div>
                      <AddKeywordInput addKeyword={(k) => setSelectedProject((p) => ({ ...p, keywords: [...p.keywords, k] }))} />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <SectionHeader title="Visibility" subtitle="Control where this project appears" />
                  <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-100">
                    <FormControl fullWidth>
                      <InputLabel>Display Target Pages</InputLabel>
                      <Select
                        multiple
                        value={selectedProject.display || []}
                        onChange={(e) => setSelectedProject((p) => ({ ...p, display: e.target.value }))}
                        input={<OutlinedInput label="Display Target Pages" sx={{ borderRadius: '15px', bgcolor: 'white' }} />}
                        renderValue={(selected) => (
                          <div className="flex flex-wrap gap-1">
                            {selected.map((val) => <Chip key={val} label={val} size="small" sx={{ bgcolor: BRAND_COLOR, color: 'white', fontWeight: 700 }} />)}
                          </div>
                        )}
                      >
                        <MenuItem value="home">🏠 Home Page</MenuItem>
                        <ListSubheader sx={{ fontWeight: 900, color: BRAND_COLOR, opacity: 0.5 }}>SERVICES</ListSubheader>
                        {displayOptions.services.map((s) => <MenuItem key={s} value={s} sx={{ pl: 4 }}>{s}</MenuItem>)}
                        <ListSubheader sx={{ fontWeight: 900, color: BRAND_COLOR, opacity: 0.5 }}>INDUSTRIES</ListSubheader>
                        {displayOptions.industries.map((i) => <MenuItem key={i} value={i} sx={{ pl: 4 }}>{i}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </div>

                  <SectionHeader title="Hero Banner" subtitle="Landing page header text" />
                  <div className="space-y-4">
                    <Input label="Headline" value={selectedProject.banner.heading} onChange={(v) => setSelectedProject((p) => ({ ...p, banner: { ...p.banner, heading: v } }))} />
                    <Textarea label="Subheadline/Description" value={selectedProject.banner.description} onChange={(v) => setSelectedProject((p) => ({ ...p, banner: { ...p.banner, description: v } }))} />
                  </div>
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* DYNAMIC DEEP DIVE SECTION */}
              <section className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <SectionHeader title="Deep Dive Sections" subtitle="Detailed breakdown with Image, Heading, Title, & Description" />
                  <button 
                    onClick={() => setSelectedProject((p) => ({ 
                      ...p, 
                      subSection: { 
                        ...p.subSection, 
                        cards: [...p.subSection.cards, { heading: "", title: "", description: "", image: { url: "", public_id: "" } }] 
                      } 
                    }))}
                    className="flex  cursor-pointer items-center justify-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <PlusCircleIcon className="h-5 w-5" /> Add Detail Block
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {selectedProject.subSection.cards.map((card, i) => (
                    <div key={i} className="bg-slate-50/50 rounded-[2rem] border border-slate-100 p-6 relative group transition-all hover:bg-white hover:shadow-lg">
                      <button 
                        onClick={() => {
                          const cards = selectedProject.subSection.cards.filter((_, idx) => idx !== i);
                          setSelectedProject((p) => ({ ...p, subSection: { ...p.subSection, cards } }));
                        }}
                        className="absolute -top-2 -right-2 p-2  cursor-pointer bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-10"
                      >
                        <TrashIcon className="h-4 w-4 stroke-[3px]" />
                      </button>

                      <div className="flex flex-col gap-6">
                        {/* 1. Image Field */}
                        <div className="w-full h-44">
                          <ImageUpload 
                            image={card.image?.url} 
                            onUpload={() => openImageModal((img) => {
                              const cards = [...selectedProject.subSection.cards];
                              cards[i] = { ...cards[i], image: img };
                              setSelectedProject((p) => ({ ...p, subSection: { ...p.subSection, cards } }));
                            })} 
                          />
                        </div>

                        <div className="flex-1 space-y-4">
                          {/* 2. Heading Field */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Section Heading (Small)</label>
                            <input 
                              placeholder="e.g. Phase 01" 
                              className="w-full bg-transparent border-b border-slate-200 py-1 text-sm font-bold text-[#070778] outline-none focus:border-indigo-500 transition-colors"
                              value={card.heading} 
                              onChange={(e) => {
                                const cards = [...selectedProject.subSection.cards];
                                cards[i].heading = e.target.value;
                                setSelectedProject((p) => ({ ...p, subSection: { ...p.subSection, cards } }));
                              }}
                            />
                          </div>

                          {/* 3. Title Field */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Title</label>
                            <input 
                              placeholder="Enter section title..." 
                              className="w-full bg-transparent border-b border-slate-200 py-1 text-lg font-black text-[#070778] outline-none focus:border-indigo-500 transition-colors"
                              value={card.title} 
                              onChange={(e) => {
                                const cards = [...selectedProject.subSection.cards];
                                cards[i].title = e.target.value;
                                setSelectedProject((p) => ({ ...p, subSection: { ...p.subSection, cards } }));
                              }}
                            />
                          </div>

                          {/* 4. Description Field */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea 
                              placeholder="Detailed description..." 
                              className="w-full bg-transparent text-sm text-slate-500 font-medium outline-none min-h-[80px] resize-none leading-relaxed"
                              value={card.description} 
                              onChange={(e) => {
                                const cards = [...selectedProject.subSection.cards];
                                cards[i].description = e.target.value;
                                setSelectedProject((p) => ({ ...p, subSection: { ...p.subSection, cards } }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="pt-10 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={saveProject} 
                  disabled={saving}
                  className="flex-1  cursor-pointer bg-[#070778] text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:bg-slate-300"
                >
                  {saving ? <CircularProgress size={20} color="inherit" /> : <><CheckCircleIcon className="h-6 w-6" /> Deploy Changes</>}
                </button>
                <button onClick={() => setSelectedProject(null)} className="px-10  cursor-pointer py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NEW PROJECT MODAL */}
      <Dialog open={newProjectModal} onClose={() => setNewProjectModal(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '2rem' } }}>
        <DialogTitle sx={{ fontWeight: 900, color: BRAND_COLOR, pt: 4, px: 4 }}>Create New Case Study</DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <div className="space-y-6 mt-2">
            <Input label="Main Title" value={newProjectData.title} onChange={(v) => setNewProjectData((p) => ({ ...p, title: v }))} />
            <Textarea label="Short Summary" value={newProjectData.shortDescription} onChange={(v) => setNewProjectData((p) => ({ ...p, shortDescription: v }))} />
            <ImageUpload label="Thumbnail" image={newProjectData.image?.url} onUpload={() => openImageModal((img) => setNewProjectData((p) => ({ ...p, image: img })))} />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 4 }}>
          <button onClick={() => setNewProjectModal(false)} className="px-6 cursor-pointer font-bold text-slate-400">Discard</button>
          <button 
            disabled={!newProjectData.title || !newProjectData.image} 
            onClick={createProject}
            className="bg-[#070778]  cursor-pointer text-white px-8 py-3 rounded-xl font-bold disabled:opacity-30"
          >
            Create New Project
          </button>
        </DialogActions>
      </Dialog>

      {/* CLOUDINARY MODAL */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '2rem' } }}>
        <div className="p-8 space-y-6">
          <h3 className="text-xl font-black text-[#070778]">Asset Upload</h3>
          <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-6 text-center bg-slate-50/50 relative group">
            {selectedFile ? (
              <img src={URL.createObjectURL(selectedFile)} className="rounded-2xl max-h-40 mx-auto" />
            ) : (
              <div className="py-8"><PhotoIcon className="h-12 w-12 text-slate-200 mx-auto" /></div>
            )}
            <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
          <button onClick={uploadImage} disabled={uploading || !selectedFile} className="w-full   cursor-pointer py-4 bg-[#070778] text-white rounded-2xl font-bold shadow-lg disabled:bg-slate-200">
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </Dialog>

      <Snackbar open={notification.open} autoHideDuration={3000} onClose={() => setNotification((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={notification.severity} variant="filled" sx={{ borderRadius: '12px', fontWeight: 700 }}>{notification.message}</Alert>
      </Snackbar>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */
const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h3 className="text-xl font-black text-[#070778] tracking-tight">{title}</h3>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">{subtitle}</p>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div className="w-full space-y-1.5">
    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div className="w-full space-y-1.5">
    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <textarea className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-600 min-h-[100px]" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const ImageUpload = ({ image, onUpload, label, compact }) => (
  <div className="w-full space-y-1.5 h-full">
    {label && <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
    <div className={`relative group overflow-hidden bg-slate-100 rounded-[1.5rem] border-2 border-slate-50 ${compact ? 'h-full aspect-square' : 'h-full'}`}>
      {image ? (
        <img src={image} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-300 italic text-xs font-bold py-10">No Image</div>
      )}
      <div 
        onClick={onUpload} 
        className="absolute inset-0 bg-[#070778]/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
      >
        <PhotoIcon className="h-8 w-8 text-white" />
      </div>
    </div>
  </div>
);

const AddKeywordInput = ({ addKeyword }) => {
  const [input, setInput] = useState("");
  return (
    <input 
      className="w-full bg-slate-100 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-400 outline-none" 
      value={input} 
      onChange={(e) => setInput(e.target.value)} 
      onKeyDown={(e) => { if(e.key === 'Enter' && input.trim()) { addKeyword(input.trim()); setInput(""); }}} 
      placeholder="Type & press Enter..." 
    />
  );
};