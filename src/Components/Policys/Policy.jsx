import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './policy.css';
import { collection, getDocs, firestoreDb } from '../firebaseConfig';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-quill/dist/quill.snow.css'; // or other theme css
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';
// Fetching Terms and Conditions data
const fetchTncItems = async () => {
  try {
    const TncCollection = collection(firestoreDb, 'Policy');
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
