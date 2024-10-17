import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './policy.css';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, firestoreDb } from '../firebaseConfig';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-quill/dist/quill.snow.css'; // or other theme css
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';
// Fetching Terms and Conditions data
const fetchTncItems = async () => {
  
  try {
    const TncCollection = collection(firestoreDb, 'wpolicy');
    const TncSnapshot = await getDocs(TncCollection);
    const TncList = TncSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(TncList);
    return TncList;
  } catch (error) {
    console.error("Error fetching Policy", error);
    return []; 
  } 
};

const Policy = () => {
  const [TncItems, setTncItems] = useState([]);
  const navigate = useNavigate();
    // Function to handle close button click
    const handleClose = () => {
      navigate('/');
  };
  useEffect(() => {
    const getTncItems = async () => {
      const items = await fetchTncItems();
      setTncItems(items);
    };
    getTncItems();
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  console.log(TncItems);
  return (
    <div className='bg-gray'>
      {
        TncItems.length > 0 ? (
          TncItems.map((item, index) => (
            <div key={index}>
                 <button
            type="button"
            className="btn-close btn-close-black position-absolute border-0 shadow-none"
            style={{ left: '40px',top:'25px', color: 'black' }}
            aria-label="Close"
            onClick={handleClose}
          ></button>
              <Container className=" pt-2">
                <Row className='w-100'>
                  <div
                    className='Quill-text'
                    data-aos="fade-in"
                    dangerouslySetInnerHTML={{ __html: item.PolicyContent }}
                  />
                </Row>
              </Container>
            </div>
          ))
        ) : (
          <Skeleton width={'100%'} height={'100vh'} />
        )
      }
    </div>
  );
};
export default Policy;
