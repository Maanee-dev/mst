
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import ScrollToTopButton from './components/ScrollToTopButton.tsx';
import ChatBot from './components/ChatBot.tsx';
import DarkModeToggle from './components/DarkModeToggle.tsx';

// Pages
import Home from './pages/Home.tsx';
import SearchPage from './pages/SearchPage.tsx';
import Stays from './pages/Stays.tsx';
import ResortDetail from './pages/ResortDetail.tsx';
// Fix: Updated import casing to match file name 'Offers.tsx' to resolve case-sensitivity errors
import Offers from './pages/Offers.tsx';
// Fix: Updated import casing to match file name 'Experiences.tsx' to resolve case-sensitivity errors
import Experiences from './pages/Experiences.tsx';
import Stories from './pages/Stories.tsx';
import BlogPostDetail from './pages/BlogPostDetail.tsx';
import PlanMyTrip from './pages/PlanMyTrip.tsx';
import AboutUs from './pages/AboutUs.tsx';
import Contact from './pages/Contact.tsx';
import Terms from './pages/Terms.tsx';
import Privacy from './pages/Privacy.tsx';
import AdminSync from './pages/AdminSync.tsx';
import AdminStories from './pages/AdminStories.tsx';
import AdminFAQ from './pages/AdminFAQ.tsx';

const ScrollToTopOnRoute = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTopOnRoute />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/stays" element={<Stays />} />
        <Route path="/stays/:slug" element={<ResortDetail />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories/:slug" element={<BlogPostDetail />} />
        <Route path="/plan" element={<PlanMyTrip />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/admin/sync" element={<AdminSync />} />
        <Route path="/admin/stories" element={<AdminStories />} />
        <Route path="/admin/faqs" element={<AdminFAQ />} />
      </Routes>
      <ChatBot />
      <ScrollToTopButton />
      <DarkModeToggle />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
