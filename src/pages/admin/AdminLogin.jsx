// src/pages/admin/AdminLogin.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { 
  TextField, 
  Button, 
  CircularProgress, 
  Alert, 
  InputAdornment,
  IconButton 
} from "@mui/material";
import { 
  LockClosedIcon, 
  EnvelopeIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ShieldCheckIcon 
} from "@heroicons/react/24/outline";

const BRAND = "#070778";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Initial loading for auth check
  const [btnLoading, setBtnLoading] = useState(false);
  
  const navigate = useNavigate();

  /* ---------------- LOGIC FIX: AUTO-REDIRECT ---------------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const session = Cookies.get("adminSession");
      if (user && session) {
        navigate("/admin/home-page");
      } else {
        setLoading(false); // Only show login form if no session found
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setBtnLoading(true);

    try {
      // 1. Firebase Auth Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Authorization Check (UID matches admin collection)
      const adminRef = doc(db, "admin", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists() || adminSnap.data().role !== "admin" || adminSnap.data().isBlocked) {
        setError("Unauthorized access or account blocked.");
        await auth.signOut();
        setBtnLoading(false);
        return;
      }

      // 3. Set Session Cookie
      Cookies.set("adminSession", user.uid, { expires: 1, secure: true, sameSite: "Strict" });
      navigate("/admin/home-page");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      setBtnLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <CircularProgress sx={{ color: BRAND }} />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-md">
        {/* Branding/Logo Area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-[2rem] mb-4 shadow-sm">
            <ShieldCheckIcon className="h-10 w-10 text-[#070778]" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Gateway</h1>
          <p className="text-slate-500 font-medium mt-2">Secure management portal access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100">
          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: '1rem', fontWeight: 600 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
              <TextField
                fullWidth
                variant="filled"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '1.25rem', bgcolor: '#f8fafc' }
                }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Security Key</label>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                variant="filled"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockClosedIcon className="h-5 w-5 text-slate-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '1.25rem', bgcolor: '#f8fafc' }
                }}
              />
            </div>

            <Button
              fullWidth
              type="submit"
              disabled={btnLoading}
              variant="contained"
              sx={{
                bgcolor: BRAND,
                py: 2,
                borderRadius: '1.25rem',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 800,
                boxShadow: '0 10px 20px -5px rgba(7, 7, 120, 0.3)',
                '&:hover': { bgcolor: '#05055c', boxShadow: 'none' }
              }}
            >
              {btnLoading ? <CircularProgress size={24} color="inherit" /> : "Authorize Access"}
            </Button>
          </form>
        </div>

        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          Protected by Enterprise Security protocols.
        </p>
      </div>
    </div>
  );
}