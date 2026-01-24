// import React, { useState, useEffect } from "react";
// import { db, functions } from "../../firebase";
// import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
// import { httpsCallable } from "firebase/functions";
// import {
//   TextField,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   IconButton,
// } from "@mui/material";
// import { TrashIcon, PencilIcon, LockClosedIcon } from "@heroicons/react/24/outline";

// const ADMIN_COLLECTION = "admin";

// export default function AdminAdmin() {
//   const [admins, setAdmins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedAdmin, setSelectedAdmin] = useState(null);
//   const [newAdmin, setNewAdmin] = useState({ email: "", password: "" });

//   const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   const fetchAdmins = async () => {
//     setLoading(true);
//     const snap = await getDocs(collection(db, ADMIN_COLLECTION));
//     setAdmins(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     setLoading(false);
//   };

//   // ---------------- CREATE ADMIN ----------------
//   const createAdmin = async () => {
//     if (!newAdmin.email || !newAdmin.password) return;
//     setSaving(true);
//     try {
//       const createFn = httpsCallable(functions, "createAdmin");
//       await createFn(newAdmin);
//       setNotification({ open: true, message: "Admin Created", severity: "success" });
//       setModalOpen(false);
//       setNewAdmin({ email: "", password: "" });
//       fetchAdmins();
//     } catch (err) {
//       console.error(err);
//       setNotification({ open: true, message: err.message, severity: "error" });
//     }
//     setSaving(false);
//   };

//   // ---------------- BLOCK / UNBLOCK ----------------
//   const toggleBlock = async (admin) => {
//     try {
//       const fn = httpsCallable(functions, "toggleAdminBlock");
//       await fn({ uid: admin.id });
//       fetchAdmins();
//     } catch (err) {
//       console.error(err);
//       setNotification({ open: true, message: err.message, severity: "error" });
//     }
//   };

//   // ---------------- RESET PASSWORD ----------------
//   const resetPassword = async (admin) => {
//     try {
//       await auth.sendPasswordResetEmail(admin.email);
//       setNotification({ open: true, message: "Reset Email Sent", severity: "success" });
//     } catch (err) {
//       console.error(err);
//       setNotification({ open: true, message: err.message, severity: "error" });
//     }
//   };

//   // ---------------- DELETE ADMIN ----------------
//   const deleteAdmin = async (admin) => {
//     try {
//       const fn = httpsCallable(functions, "deleteAdmin");
//       await fn({ uid: admin.id });
//       setNotification({ open: true, message: "Admin Deleted", severity: "info" });
//       fetchAdmins();
//     } catch (err) {
//       console.error(err);
//       setNotification({ open: true, message: err.message, severity: "error" });
//     }
//   };

//   const filteredAdmins = admins.filter((a) => a.email.includes(search));

//   return (
//     <div className="px-6 py-10 space-y-6">
//       <h1 className="text-3xl font-bold text-[#070778]">Admin Management</h1>

//       <div className="flex gap-4 flex-wrap">
//         <TextField
//           placeholder="Search by email"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           sx={{ minWidth: 250 }}
//         />
//         <Button variant="contained" sx={{ backgroundColor: "#070778" }} onClick={() => setModalOpen(true)}>
//           Add Admin
//         </Button>
//       </div>

//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//         {loading ? (
//           <CircularProgress />
//         ) : (
//           filteredAdmins.map((admin) => (
//             <div key={admin.id} className="bg-white shadow rounded-xl p-4 flex flex-col gap-2">
//               <p className="font-semibold">{admin.email}</p>
//               <p className="text-gray-500">{admin.role}</p>
//               <p className="text-gray-400">{admin.isBlocked ? "Blocked" : "Active"}</p>
//               <div className="flex gap-2 mt-2">
//                 <Button size="small" variant="outlined" startIcon={<LockClosedIcon className="h-4" />} onClick={() => toggleBlock(admin)}>
//                   {admin.isBlocked ? "Unblock" : "Block"}
//                 </Button>
//                 <Button size="small" variant="outlined" color="error" startIcon={<TrashIcon className="h-4" />} onClick={() => deleteAdmin(admin)}>
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* ---------------- MODAL ---------------- */}
//       <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle sx={{ fontWeight: 700, color: "#070778" }}>Add Admin</DialogTitle>
//         <DialogContent className="space-y-4">
//           <TextField label="Email" fullWidth value={newAdmin.email} onChange={(e) => setNewAdmin((p) => ({ ...p, email: e.target.value }))} />
//           <TextField label="Password" type="password" fullWidth value={newAdmin.password} onChange={(e) => setNewAdmin((p) => ({ ...p, password: e.target.value }))} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setModalOpen(false)}>Cancel</Button>
//           <Button variant="contained" sx={{ backgroundColor: "#070778" }} onClick={createAdmin} disabled={saving}>
//             {saving ? <CircularProgress size={18} color="inherit" /> : "Create Admin"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ---------------- NOTIFICATION ---------------- */}
//       <Snackbar
//         open={notification.open}
//         autoHideDuration={3000}
//         onClose={() => setNotification((p) => ({ ...p, open: false }))}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
//       </Snackbar>
//     </div>
//   );
// }
