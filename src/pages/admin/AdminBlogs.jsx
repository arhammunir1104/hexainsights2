import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  TrashIcon,
  PencilSquareIcon,
  PlusIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  RectangleGroupIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";

/* ---------------- CONSTANTS ---------------- */
const CLOUD_NAME = "dg3ade8dr";
const UPLOAD_PRESET = "insights";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const BLOGS_COLLECTION = "hexainsighs-blog";
const SERVICES_COLLECTION = "servicesDB";
const BRAND_COLOR = "#070778";

/* Shared MUI input style — uniform font, no bold */
const INPUT_SX = {
  borderRadius: "0.75rem",
  fontSize: "0.95rem",
  fontWeight: 400,
};

const getDefaultBlogDoc = () => ({
  uploadDate: "",
  updateDate: "",
  banner: { title: "", description: "" },
  subsection: {
    title: "",
    blogs: [],
  },
});

const getDefaultBlog = () => ({
  title: "",
  description: "",
  image: "",
  category: "",
  subsection: {
    title: "",
    cards: [],
  },
});

const getDefaultCard = () => ({
  icon: "",
  text: "",
  description: "",
});

/* Helper: deeply merge fetched data with defaults */
const safeMergeDoc = (data) => {
  const defaults = getDefaultBlogDoc();
  return {
    uploadDate: data?.uploadDate || defaults.uploadDate,
    updateDate: data?.updateDate || defaults.updateDate,
    banner: {
      title: data?.banner?.title ?? defaults.banner.title,
      description: data?.banner?.description ?? defaults.banner.description,
    },
    subsection: {
      title: data?.subsection?.title ?? defaults.subsection.title,
      blogs: Array.isArray(data?.subsection?.blogs)
        ? data.subsection.blogs.map((b) => ({
            title: b?.title ?? "",
            description: b?.description ?? "",
            image: b?.image ?? "",
            category: b?.category ?? "",
            subsection: {
              title: b?.subsection?.title ?? "",
              cards: Array.isArray(b?.subsection?.cards)
                ? b.subsection.cards.map((c) => ({
                    icon: c?.icon ?? "",
                    text: c?.text ?? "",
                    description: c?.description ?? "",
                  }))
                : [],
            },
          }))
        : [],
    },
  };
};

export default function AdminBlogs() {
  const navigate = useNavigate();
  const [blogDoc, setBlogDoc] = useState(getDefaultBlogDoc());
  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);

  // Blog modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlogIndex, setEditingBlogIndex] = useState(null);
  const [currentBlog, setCurrentBlog] = useState(getDefaultBlog());

  // Confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Image upload
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [afterUpload, setAfterUpload] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBlogDoc();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const snap = await getDocs(collection(db, SERVICES_COLLECTION));
      const data = snap.docs.map((doc) => doc.data().title);
      setServices(data.sort());
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  const fetchBlogDoc = async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(db, BLOGS_COLLECTION));
      if (snap.docs.length > 0) {
        const d = snap.docs[0];
        setDocId(d.id);
        setBlogDoc(safeMergeDoc(d.data()));
      } else {
        setDocId(null);
        setBlogDoc(getDefaultBlogDoc());
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to connect to the database. Please check your internet connection and try again.");
      toast.error("Failed to load blog data");
    } finally {
      setLoading(false);
    }
  };

  /* ---- Safe state updaters ---- */
  const updateBanner = (field, value) => {
    setBlogDoc((prev) => {
      const safe = prev || getDefaultBlogDoc();
      return {
        ...safe,
        banner: { ...(safe.banner || { title: "", description: "" }), [field]: value },
      };
    });
  };

  const updateSubsectionTitle = (value) => {
    setBlogDoc((prev) => {
      const safe = prev || getDefaultBlogDoc();
      return {
        ...safe,
        subsection: { ...(safe.subsection || { title: "", blogs: [] }), title: value },
      };
    });
  };

  /* ---- Ensure Firebase Auth — redirect to login if expired ---- */
  const ensureAuth = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Session expired. Redirecting to login...");
      setTimeout(() => navigate("/admin"), 1500);
      return false;
    }
    try {
      await user.getIdToken(true);
    } catch (e) {
      console.error("Token refresh failed:", e);
      toast.error("Session expired. Redirecting to login...");
      setTimeout(() => navigate("/admin"), 1500);
      return false;
    }
    return true;
  };

  /* ---- Top-level Save ---- */
  const saveTopLevel = async () => {
    setSaving(true);
    try {
      if (!(await ensureAuth())) { setSaving(false); return; }
      const now = new Date().toISOString();
      let currentDocId = docId;
      if (!currentDocId) {
        const docRef = doc(collection(db, BLOGS_COLLECTION));
        currentDocId = docRef.id;
      }
      const updated = {
        ...blogDoc,
        updateDate: now,
        uploadDate: blogDoc.uploadDate || now,
      };
      await setDoc(doc(db, BLOGS_COLLECTION, currentDocId), updated);
      setDocId(currentDocId);
      setBlogDoc(updated);
      toast.success("Banner & section saved");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Save failed. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ---- Blog CRUD ---- */
  const openAddBlog = () => {
    setEditingBlogIndex(null);
    setCurrentBlog(getDefaultBlog());
    setModalOpen(true);
  };

  const openEditBlog = (index) => {
    const blogs = blogDoc?.subsection?.blogs || [];
    if (index < 0 || index >= blogs.length) return;
    setEditingBlogIndex(index);
    const blog = blogs[index];
    setCurrentBlog({
      title: blog?.title ?? "",
      description: blog?.description ?? "",
      image: blog?.image ?? "",
      category: blog?.category ?? "",
      subsection: {
        title: blog?.subsection?.title ?? "",
        cards: Array.isArray(blog?.subsection?.cards)
          ? blog.subsection.cards.map((c) => ({ ...getDefaultCard(), ...c }))
          : [],
      },
    });
    setModalOpen(true);
  };

  const saveBlog = async () => {
    try {
      if (!(await ensureAuth())) return;
      const now = new Date().toISOString();
      let currentDocId = docId;
      if (!currentDocId) {
        const docRef = doc(collection(db, BLOGS_COLLECTION));
        currentDocId = docRef.id;
      }
      const blogs = [...(blogDoc?.subsection?.blogs || [])];
      if (editingBlogIndex !== null) {
        blogs[editingBlogIndex] = currentBlog;
      } else {
        blogs.push(currentBlog);
      }
      const updated = {
        ...blogDoc,
        updateDate: now,
        uploadDate: blogDoc.uploadDate || now,
        subsection: { ...(blogDoc?.subsection || { title: "" }), blogs },
      };
      await setDoc(doc(db, BLOGS_COLLECTION, currentDocId), updated);
      setDocId(currentDocId);
      setBlogDoc(updated);
      toast.success(editingBlogIndex !== null ? "Blog updated" : "Blog added");
      setModalOpen(false);
    } catch (err) {
      console.error("Save blog error:", err);
      toast.error("Failed to save blog. Check your connection.");
    }
  };

  const initiateDeleteBlog = (index) => {
    setDeleteIndex(index);
    setConfirmOpen(true);
  };

  const confirmDeleteBlog = async () => {
    if (!docId) {
      toast.error("No data to delete.");
      setConfirmOpen(false);
      return;
    }
    const blogs = (blogDoc?.subsection?.blogs || []).filter((_, i) => i !== deleteIndex);
    const updated = {
      ...blogDoc,
      updateDate: new Date().toISOString(),
      subsection: { ...(blogDoc?.subsection || { title: "" }), blogs },
    };
    try {
      if (!(await ensureAuth())) { setConfirmOpen(false); return; }
      await setDoc(doc(db, BLOGS_COLLECTION, docId), updated);
      setBlogDoc(updated);
      toast.warn("Blog removed");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Delete failed");
    } finally {
      setConfirmOpen(false);
      setDeleteIndex(null);
    }
  };

  /* ---- Cards CRUD inside blog modal ---- */
  const addCard = () => {
    setCurrentBlog((prev) => {
      const safe = prev || getDefaultBlog();
      const sub = safe.subsection || { title: "", cards: [] };
      return {
        ...safe,
        subsection: {
          ...sub,
          cards: [...(sub.cards || []), getDefaultCard()],
        },
      };
    });
  };

  const updateCard = (cardIdx, field, value) => {
    setCurrentBlog((prev) => {
      const safe = prev || getDefaultBlog();
      const sub = safe.subsection || { title: "", cards: [] };
      const cards = [...(sub.cards || [])];
      if (cardIdx >= 0 && cardIdx < cards.length) {
        cards[cardIdx] = { ...cards[cardIdx], [field]: value };
      }
      return { ...safe, subsection: { ...sub, cards } };
    });
  };

  const removeCard = (cardIdx) => {
    setCurrentBlog((prev) => {
      const safe = prev || getDefaultBlog();
      const sub = safe.subsection || { title: "", cards: [] };
      return {
        ...safe,
        subsection: {
          ...sub,
          cards: (sub.cards || []).filter((_, i) => i !== cardIdx),
        },
      };
    });
  };

  /* ---- Cloudinary Upload ---- */
  const openImageModal = (cb) => {
    setSelectedFile(null);
    setAfterUpload(() => cb);
    setImageModalOpen(true);
  };

  const uploadImage = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", selectedFile);
      form.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload response not OK");
      const data = await res.json();
      if (data.secure_url && afterUpload) {
        afterUpload(data.secure_url);
        toast.success("Image uploaded");
      } else {
        throw new Error("No URL in response");
      }
      setImageModalOpen(false);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* ---- Derived safe values for rendering ---- */
  const bannerTitle = blogDoc?.banner?.title ?? "";
  const bannerDesc = blogDoc?.banner?.description ?? "";
  const subTitle = blogDoc?.subsection?.title ?? "";
  const blogs = blogDoc?.subsection?.blogs ?? [];

  /* ---- RENDER ---- */

  // Loading state
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
        <CircularProgress size={28} sx={{ color: BRAND_COLOR }} />
        <p className="text-sm font-medium animate-pulse">Loading Blogs Page...</p>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 gap-5 px-6">
        <ToastContainer position="top-right" autoClose={2000} />
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
          <ExclamationTriangleIcon className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 text-center">Something went wrong</h2>
        <p className="text-center max-w-md text-sm">{error}</p>
        <button
          onClick={fetchBlogDoc}
          className="flex cursor-pointer items-center gap-2 bg-[#070778] hover:bg-[#05055a] text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-all active:scale-95"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Retry
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 pb-12">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ═══════════════ HEADER ═══════════════ */}
      <div className="max-w-6xl mx-auto px-5 pt-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#070778] mb-1 font-semibold text-xs tracking-widest uppercase">
              <RectangleGroupIcon className="h-4 w-4" />
              <span>Admin Control</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Blogs</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your blog content, banner, and individual blog entries.
            </p>
          </div>
          <button
            onClick={openAddBlog}
            className="flex cursor-pointer items-center justify-center gap-2 bg-[#070778] hover:bg-[#05055a] text-white text-sm font-semibold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/10"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Blog</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5">
        {/* ═══════════════ TOP-LEVEL FIELDS ═══════════════ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-7 mb-8 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-5">
            Banner & Section Settings
          </h3>
          <div className="grid md:grid-cols-2 gap-5">
            <TextField
              label="Banner Title"
              fullWidth
              variant="filled"
              value={bannerTitle}
              InputProps={{ disableUnderline: true, sx: INPUT_SX }}
              onChange={(e) => updateBanner("title", e.target.value)}
            />
            <TextField
              label="Subsection Title"
              fullWidth
              variant="filled"
              value={subTitle}
              InputProps={{ disableUnderline: true, sx: INPUT_SX }}
              onChange={(e) => updateSubsectionTitle(e.target.value)}
            />
          </div>
          <div className="mt-5">
            <TextField
              label="Banner Description"
              fullWidth
              multiline
              rows={3}
              variant="filled"
              value={bannerDesc}
              InputProps={{ disableUnderline: true, sx: INPUT_SX }}
              onChange={(e) => updateBanner("description", e.target.value)}
            />
          </div>
          <div className="flex justify-end mt-5">
            <button
              onClick={saveTopLevel}
              disabled={saving}
              className="flex cursor-pointer items-center gap-2 bg-[#070778] hover:bg-[#05055a] text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? <CircularProgress size={16} color="inherit" /> : "Save Changes"}
            </button>
          </div>
        </div>

        {/* ═══════════════ BLOG CARDS GRID ═══════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => {
            // Pick a thumbnail: blog.image → first card icon → null
            const thumbnail = blog?.image || blog?.subsection?.cards?.[0]?.icon || "";
            return (
              <div
                key={index}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Blog Image / Thumbnail */}
                {thumbnail ? (
                  <div className="h-40 w-full overflow-hidden bg-slate-100">
                    <img
                      src={thumbnail}
                      alt={blog?.title || "Blog"}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-40 w-full bg-gradient-to-br from-[#070778]/10 to-[#3b82f6]/10 flex items-center justify-center">
                    <RectangleGroupIcon className="h-12 w-12 text-[#070778]/20" />
                  </div>
                )}

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-800 mb-1.5 line-clamp-1">
                    {blog?.title || "Untitled Blog"}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-3">
                    {blog?.description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-4">
                    <span>
                      {blog?.subsection?.cards?.length || 0} card
                      {(blog?.subsection?.cards?.length || 0) !== 1 ? "s" : ""}
                    </span>
                    <span>•</span>
                    <span>{blog?.subsection?.title || "No subsection"}</span>
                    {blog?.category && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600 font-bold">{blog.category}</span>
                      </>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Blog #{index + 1}
                    </span>
                    <div className="flex gap-1">
                      <Tooltip title="Edit Blog">
                        <IconButton
                          size="small"
                          onClick={() => openEditBlog(index)}
                        >
                          <PencilSquareIcon className="h-4 w-4 text-blue-600" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Blog">
                        <IconButton
                          size="small"
                          onClick={() => initiateDeleteBlog(index)}
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {blogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <RectangleGroupIcon className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-base font-semibold">No blogs yet</p>
            <p className="text-sm">Click "Add Blog" above to create your first entry.</p>
          </div>
        )}
      </div>

      {/* ═══════════════ BLOG EDITOR MODAL ═══════════════ */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: "1.25rem", p: 0 } }}
      >
        <DialogTitle className="flex justify-between items-center px-6 pt-5 pb-2">
          <span className="text-xl font-bold text-slate-900">
            {editingBlogIndex !== null ? "Edit Blog" : "New Blog"}
          </span>
          <IconButton onClick={() => setModalOpen(false)} size="small">
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="px-6 py-4">
          {/* Blog basic fields */}
          <div className="space-y-5">
            <TextField
              label="Blog Title"
              fullWidth
              variant="filled"
              style={{margin : "10px"}}
              value={currentBlog?.title ?? ""}
              InputProps={{ disableUnderline: true, sx: INPUT_SX }}
              onChange={(e) =>
                setCurrentBlog((prev) => ({ ...(prev || getDefaultBlog()), title: e.target.value }))
              }
            />
            <TextField
              label="Blog Description"
              fullWidth
              multiline
              rows={3}
              variant="filled"
              style={{margin : "10px"}}
              value={currentBlog?.description ?? ""}
              InputProps={{ disableUnderline: true, sx: INPUT_SX }}
              onChange={(e) =>
                setCurrentBlog((prev) => ({ ...(prev || getDefaultBlog()), description: e.target.value }))
              }
            />

            {/* Category selection */}
            <FormControl fullWidth variant="filled" style={{ margin: "10px" }}>
              <InputLabel id="category-select-label" sx={{ fontSize: "0.95rem" }}>Blog Category (Service)</InputLabel>
              <Select
                labelId="category-select-label"
                value={currentBlog?.category || ""}
                onChange={(e) =>
                  setCurrentBlog((prev) => ({ ...(prev || getDefaultBlog()), category: e.target.value }))
                }
                disableUnderline
                sx={INPUT_SX}
              >
                <MenuItem value="">
                  <em>No Category</em>
                </MenuItem>
                {services.map((service, idx) => (
                  <MenuItem key={idx} value={service}>
                    {service}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Blog Image Upload */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Blog Image</p>
              <ImageUpload
                image={currentBlog?.image || ""}
                onUpload={() =>
                  openImageModal((url) =>
                    setCurrentBlog((prev) => ({ ...(prev || getDefaultBlog()), image: url }))
                  )
                }
              />
            </div>

            <TextField
              label="Subsection Title"
              fullWidth
              variant="filled"
              value={currentBlog?.subsection?.title ?? ""}
              InputProps={{ disableUnderline: true, sx: INPUT_SX }}
              onChange={(e) =>
                setCurrentBlog((prev) => {
                  const safe = prev || getDefaultBlog();
                  return {
                    ...safe,
                    subsection: { ...(safe.subsection || { title: "", cards: [] }), title: e.target.value },
                  };
                })
              }
            />
          </div>

          {/* ---- Cards Section ---- */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-slate-800">Cards</h3>
              <Button
                startIcon={<PlusIcon className="h-4 w-4" />}
                variant="outlined"
                size="small"
                sx={{
                  cursor: "pointer",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  borderColor: "#070778",
                  color: "#070778",
                }}
                onClick={addCard}
              >
                Add Card
              </Button>
            </div>

            <div className="space-y-4">
              {(currentBlog?.subsection?.cards ?? []).map((card, i) => (
                <div
                  key={i}
                  className="group relative bg-slate-50 border border-slate-100 rounded-xl p-5 hover:bg-white hover:shadow-md transition-all"
                >
                  <div className="grid md:grid-cols-12 gap-4">
                    {/* Icon Upload */}
                    <div className="md:col-span-3">
                      <ImageUpload
                        small
                        image={card?.icon || ""}
                        onUpload={() =>
                          openImageModal((url) => updateCard(i, "icon", url))
                        }
                      />
                    </div>
                    {/* Card Fields */}
                    <div className="md:col-span-9 space-y-4">
                      <TextField
                        placeholder="Card Title"
                        fullWidth
                        size="small"
                        value={card?.text ?? ""}
                        InputProps={{ sx: { fontSize: "0.95rem" } }}
                        onChange={(e) => updateCard(i, "text", e.target.value)}
                      />
                      <TextField
                        placeholder="Card Description"
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                        value={card?.description ?? ""}
                        InputProps={{ sx: { fontSize: "0.95rem" } }}
                        onChange={(e) =>
                          updateCard(i, "description", e.target.value)
                        }
                      /> 
                    </div>
                  </div>
                  <IconButton
                    size="small"
                    className="absolute -top-2 -right-2 bg-red-500 text-white shadow hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeCard(i)}
                  >
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </IconButton>
                </div>
              ))}

              {(currentBlog?.subsection?.cards ?? []).length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400 bg-slate-50 rounded-xl">
                  <PhotoIcon className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm font-medium">
                    No cards yet. Click "Add Card" to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>

        <DialogActions className="px-6 py-4 bg-slate-50">
          <Button
            onClick={() => setModalOpen(false)}
            sx={{ color: "#64748b", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={saveBlog}
            sx={{
              backgroundColor: "#070778",
              cursor: "pointer",
              borderRadius: "0.6rem",
              px: 4,
              py: 1,
              fontWeight: 700,
              fontSize: "0.85rem",
              "&:hover": { backgroundColor: "#05055a" },
            }}
          >
            {editingBlogIndex !== null ? "Update Blog" : "Publish Blog"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════ CONFIRMATION MODAL ═══════════════ */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: "1rem", p: 1 } }}
      >
        <div className="p-5 text-center">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ExclamationTriangleIcon className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Are you sure?</h2>
          <p className="text-slate-500 text-sm mt-1.5">
            This will permanently delete the blog entry. This action cannot be undone.
          </p>
          <div className="flex flex-col gap-2.5 mt-6">
            <button
              onClick={confirmDeleteBlog}
              className="bg-red-500 cursor-pointer hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-all"
            >
              Delete Blog
            </button>
            <button
              onClick={() => setConfirmOpen(false)}
              className="bg-slate-100 cursor-pointer text-slate-600 text-sm font-semibold py-2.5 rounded-lg transition-all"
            >
              Keep it
            </button>
          </div>
        </div>
      </Dialog>

      {/* ═══════════════ IMAGE UPLOAD MODAL ═══════════════ */}
      <Dialog
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        PaperProps={{ sx: { borderRadius: "1rem" } }}
      >
        <div className="p-6 w-[380px]">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <PhotoIcon className="h-4 w-4 text-[#070778]" />
            Upload Image
          </h3>
          {selectedFile ? (
            <div className="relative rounded-xl overflow-hidden shadow mb-4">
              <img
                src={URL.createObjectURL(selectedFile)}
                className="w-full h-44 object-cover"
                alt="Preview"
              />
              <button
                onClick={() => setSelectedFile(null)}
                className="absolute cursor-pointer top-2 right-2 bg-black/50 p-1 rounded-full text-white"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <label className="w-full border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center cursor-pointer hover:border-[#070778] hover:bg-blue-50/30 transition-all">
              <CloudArrowUpIcon className="h-8 w-8 text-slate-300 mb-2" />
              <span className="text-xs font-semibold text-slate-500 text-center uppercase tracking-widest">
                Choose Image
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </label>
          )}
          <Button
            fullWidth
            onClick={uploadImage}
            disabled={uploading || !selectedFile}
            variant="contained"
            sx={{
              backgroundColor: "#070778",
              py: 1.5,
              cursor: "pointer",
              borderRadius: "0.6rem",
              marginTop: "16px",
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
          >
            {uploading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

/* ---------------- IMAGE UPLOAD COMPONENT ---------------- */
const ImageUpload = ({ image, onUpload, small }) => (
  <div className="relative group">
    {image ? (
      <div
        className={`relative ${
          small ? "h-24" : "h-44"
        } w-full rounded-xl overflow-hidden border border-slate-100`}
      >
        <img src={image} className="h-full w-full object-cover" alt="" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={onUpload}
            className="bg-white cursor-pointer text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
          >
            Replace
          </button>
        </div>
      </div>
    ) : (
      <button
        onClick={onUpload}
        className={`${
          small ? "h-24" : "h-44"
        } w-full cursor-pointer bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-all`}
      >
        <PhotoIcon className={`${small ? "h-5" : "h-8"} opacity-30 mb-1`} />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Add Image
        </span>
      </button>
    )}
  </div>
);
