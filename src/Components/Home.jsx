import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestoreDb } from './firebaseConfig'; // Firestore configuration
import Nav from '../Components/Nav';
import Admin from './admin/Admin';
import { Link } from 'react-router-dom';
import { Routes, Route, useLocation } from 'react-router-dom';
function App() {
  const location = useLocation();
  const [Homedata, setHomeData] = useState({});
  // Fetch data from Firestore
  const fetchData = async () => {
    const docRef = doc(firestoreDb, 'Home', 'HomePageData');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setHomeData(docSnap.data());
    } else {
      console.error("No such document!");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  // Open the admin page in a new tab
  useEffect(() => {
    if (location.pathname === '/admin') {
      window.open('/Admin', '_blank');
    }
  }, [location]);
  return (
    <div className="Home" id='Home'>
      <div id='main-home' style={{
        backgroundImage: `url(${Homedata.BgImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        height: '100vh'
      }}>
        <Nav />
        <div className='w-100 h-100 position-absolute text-center home-text-align'>
          <div className="main-title">
            {Homedata.Txt1}
          </div>
          <div className="main-subtitle">
            <span>{Homedata.Txt2}</span>
          </div>
          <div className="mt-4" style={{ display: Homedata.RegistrationItem?.length === 0 ? 'none' : 'block' }}>
            {Homedata.RegistrationLink ? (
              <a href={Homedata.RegistrationLink} className='registor-btn'>
                {Homedata.RegistrationItem}
              </a>
            ) : (
              <Link to="/Registor"  target='_blank' className='registor-btn'>
                {Homedata.RegistrationItem}
              </Link>
            )}
          </div>
        </div>
        {/* Always show the Routes */}
        <Routes>
          <Route path="/Admin" element={<Admin />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;
