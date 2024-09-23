import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Navbar, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import appLogo from '../assets/GemLogo.png';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import googleIcon from '../assets/googleicon.png';
import appleIcon from '../assets/apple_icon.svg'
import { firestoreDb } from '../firebaseConfig'; 
import { auth, provider } from '../firebaseConfig';
import { signInWithPopup, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Verification() {
  const navigate = useNavigate();
  const [VerifyToRegdata, setVerifyToRegData] = useState({});
  // Fetch data from Firestore
  const fetchData = async () => {
    const docRef = doc(firestoreDb, 'VerifyToRegistor', 'verifytoregistor');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setVerifyToRegData(docSnap.data());
    } else {
      console.error("No such document!");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleClose = () => {
    navigate('/');
  };
  const success = () => {
    toast.success('LogIn Success🎉', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        color: 'green',
        fontWeight: "bold",
        textAlign: "center",
        borderRadius: '20px'
      }
    });
  };
  function signIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
       console.log(user.displayName);
       console.log(user.email);
       console.log(user.photoURL);
       console.log(user.phoneNumber);
       console.log(user.phoneNumber);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (
    <div
      style={{
        backgroundImage: `url(${VerifyToRegdata.BgImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100vh',
      }}
    >
      <Container className="h-100 pt-3">
        <Navbar className="glassbg2 ">
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <img src={appLogo} alt="img" width={'185px'} className="me-2" style={{ cursor: 'default' }} />
          </Navbar.Brand>
          <div className="ms-auto">
            <button
              type="button"
              className="btn-close btn-close-black"
              aria-label="Close"
              onClick={()=>handleClose()}
            ></button>
          </div>
        </Navbar>
        {/* Content centered vertically and horizontally */}
        <div className="w-100 h-75 d-flex flex-column justify-content-center align-items-center">
          {/* Text Content */}
          <div className="text-center mb-4">
            <span className="text-black main-title" style={{ fontSize: '40px' }}>
              {VerifyToRegdata.Txtcontent}
            </span>
          </div>
          {/* Buttons */}
          <div className="container">
  <div className="row justify-content-center">
    <div className="col-12 col-md-6 col-lg-4 mb-2 d-flex justify-content-center">
      <button onClick={signIn} className="googleSignIn border-0 d-flex align-items-center  w-md-auto px-3">
        <img src={googleIcon} alt="Google Icon" width={45} className="me-2" />
        Continue with Google
      </button>
    </div>
    <div className="col-12 col-md-6 col-lg-4 mb-2 d-flex justify-content-center">
      <button className="AppleSignIn border-0 d-flex align-items-center  w-md-auto px-3">
        <img src={appleIcon} alt="Apple Icon" width={45} className="me-2" />
        Continue with Apple
      </button>
    </div>
  </div>
</div>
        </div>
      </Container>
    </div>
  );
}
