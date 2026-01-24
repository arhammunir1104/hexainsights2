import './App.css'
import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from "react-toastify";

import HomePage from './pages/HomePage'
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import ServicePage from './pages/ServicePage';
import IndustryPage from './pages/IndustryPage';
import WorkPage from './pages/WorkPage';
import About from './pages/About';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';

// Admin imports
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';

import AdminProtectedRoute from './protected/AdminProtectedRoute';
import AdminLayout from './layout/AdminLayout';

import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminHomePage from './pages/admin/AdminHomePage';
import AdminServicePage from './pages/admin/AdminServicePage';
import AdminIndustryPage from './pages/admin/AdminIndustryPage';
import AdminTechnology from './pages/admin/AdminTechnology';
import AdminProjects from './pages/admin/AdminProjects';
import AdminFaqs from './pages/admin/AdminFaqs';
import AdminTestimonial from './pages/admin/AdminTestimonial';
import AdminTeam from './pages/admin/AdminTeam';
import AdminContact from './pages/admin/AdminContact';
import AdminOurWork from './pages/admin/AdminOurWork';
import AdminAbout from './pages/admin/AdminAbout';
import AdminCaseStudies from './pages/admin/AdminCaseStudies';
import AdminFooter from './pages/admin/AdminFooter';
import Project from './pages/Project';
import AdminStaff from './pages/admin/AdminStaff';
import AdminFeedbackPage from './pages/admin/AdminFeedback';
// import AdminAdmin from './pages/admin/AdminAdmin';

 
function App() {
  const location = useLocation();

  // hide navbar/footer on admin pages
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AdminAuthProvider>
      <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"   // or "dark" if your admin is dark
      />
        {/* SHOW NAVBAR ONLY ON PUBLIC PAGES */}
        {!isAdminRoute && (
          <div className='flex justify-center items-center'>
            <Navbar />
          </div>
        )}

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services/:serviceType" element={<ServicePage />} />
          <Route path="/industry/:uid" element={<IndustryPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<ContactPage />} />
          <Route path="/blog/:uid" element={<BlogPage />} />
          <Route path="/project/:uid" element={<Project />} />
          

          {/* ADMIN LOGIN PAGE */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* ADMIN PROTECTED ROUTES */}
          {/* <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          /> */}

        <Route
            path="/admin/home-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminHomePage />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/service-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminServicePage />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/industry-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminIndustryPage />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/technology-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminTechnology />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/staff-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminStaff />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/projects-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminProjects />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />
           <Route
            path="/admin/faqs-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminFaqs />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/testimonial-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminTestimonial />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />

          
          <Route
            path="/admin/team-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminTeam />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />

          {/* <Route
            path="/admin/accounts"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminAdmin />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          /> */}

          <Route
            path="/admin/contact-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminContact />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />

          {/* <Route
            path="/admin/ourwork-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminOurWork />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          /> */}
 
          <Route
            path="/admin/aboutus-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminAbout />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/casestudy-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminCaseStudies />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/footer"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminFooter />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />

           <Route
            path="/admin/feedback-page"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminFeedbackPage />
                </AdminLayout>
              // </AdminProtectedRoute>
            }
          />

        </Routes>

        {/* SHOW FOOTER ONLY ON PUBLIC PAGES */}
        {!isAdminRoute && <Footer />}

      </>
    </AdminAuthProvider>
    
  );
}

export default App;
