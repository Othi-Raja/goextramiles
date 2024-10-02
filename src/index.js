import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Components/App.css';
import FooterList from './Components/FooterList';
import Footer from './Components/Footer';
// import Navbar from './Components/Nav'
import Home from './Components/Home';
import 'aos/dist/aos.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Policy from './Components/Policys/Policy';
import Features from './Components/FooterList/Features';   
import AboutUs from './Components/FooterList/AboutUs';   
import Careers from './Components/FooterList/Careers';   
import Privacy from './Components/FooterList/Privacy';   
import ReleaseNotes from './Components/FooterList/ReleaseNotes';
import Business from './Components/FooterList/ForBusiness'; 
import Community from './Components/FooterList/Community';
import HelpVideos from './Components/FooterList/HelpVideos';
import Registration from './Components/Registration/Registration';
import Verification from './Components/Registration/Verification'
const App = () => {
  const location = useLocation();
  // Define route checks for each specific route
  const isPolicyRoute = location.pathname === '/Terms&Conditions';
  const isFeaturesRoute = location.pathname === '/Features';
  const isForBusinessRoute = location.pathname === '/ForBusiness';
  const isCommunityRoute = location.pathname === '/Community';
  const isAboutUsRoute = location.pathname === '/AboutUs';
  const isCareersRoute = location.pathname === '/Careers';
  const isPrivacyRoute = location.pathname === '/Privacy';
  const isReleaseNotesRoute = location.pathname === '/ReleaseNotes';
  const isHelpVideosRoute = location.pathname === '/HelpVideos';
  const isRegistrationRoute = location.pathname === '/Registration';
  const isVerificationRoute = location.pathname === '/Verification';
  return (
    <>
      <ToastContainer />
      {/* Conditionally render components based on the route */}
      {isPolicyRoute ? (
        <>
          <Policy />
          {/* <Footer /> */}
        </>
      ) : isAboutUsRoute ? (
        <>
          <AboutUs />
        </>
      ) : isFeaturesRoute ?(
        <>
        <Features/>
         </>
      ):isRegistrationRoute ? (
        <>
        <Registration/>
         </>
      ):isVerificationRoute ? (
        <>
        <Verification/>
        </>
      ): isForBusinessRoute ? (
        <>
          <Business />
        </>
      ) : isCommunityRoute ? (
        <>
          <Community/>
        </>
      ): isHelpVideosRoute ?(
        <>
        <HelpVideos/>
        </>
      )
        : isCareersRoute ? (
          <>
            <Careers />
          </>
        ) : isPrivacyRoute ? (
          <>
            <Privacy />
          </>
        ) : isReleaseNotesRoute ? (
          <>
            <ReleaseNotes />
          </>
        ) : (
          <>
            {/* Default route - Home page */}
            <Home />
            <FooterList />
            <Footer />
          </>
        )}
    </>
  );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
reportWebVitals();
