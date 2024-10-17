import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Container, Row, Button, Modal } from 'react-bootstrap';
import { firestoreDb } from '../firebaseConfig'; // Firestore configuration
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import './footerDec.css'
import 'react-quill/dist/quill.snow.css'; // Quill editor styles
import editIcon from '../assets/pencil-square.svg';
export default function Community() {
  const [Communitydata, setCommunityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [Title, setCommunityTitle] = useState('');
  const [Cpara, setCommunityPara] = useState('');
  const [Curl, setCommunityUrl] = useState('');
  const [ButtonLabel, setCommunityButtonLabel] = useState('');


  const navigate = useNavigate();
  // Fetch data from Firestore
  const fetchData = async () => {
    const docRef = doc(firestoreDb, 'wcommunity', 'CommunityPg');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setCommunityData(data);
      setCommunityTitle(data.Title); // Set initial values for editing
      setCommunityPara(data.Cpara); // Set initial values for editing
      setCommunityUrl(data.Curl); // Set initial values for editing
    } else {
      console.error("No such document!");
    }
    setLoading(false); // Set loading to false after data is fetched
  };
  useEffect(() => {
    fetchData();
  }, []);
  // Function to handle close button click
  const handleClose = () => {
    navigate('/');
  };
  // Function to save changes
  const handleSaveChanges = async () => {
    const docRef = doc(firestoreDb, 'wcommunity', 'CommunityPg');
    await updateDoc(docRef, {
      Title: Title,
      Cpara: Cpara,
      Curl: Curl,
      ButtonLabel:ButtonLabel
    });
    setCommunityData({
      Title: Title,
      Cpara: Cpara,
      Curl: Curl,
      ButtonLabel:ButtonLabel
    });
    setShowModal(false); // Close modal after saving
  };
  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      ['link'],
      [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
      ['clean']
    ]
  };
  const formats = [
    'header', 'font',
    'list', 'bullet',
    'bold', 'italic', 'underline',
    'link',
    'align'
  ];
  return (
    <div>
      <Container>
        <Row className='pt-5 d-flex justify-content-center align-items-center'>
          <button
            type="button"
            className="btn-close btn-close-black position-absolute border-0 shadow-none"
            style={{ left: '40px', color: 'black' }}
            aria-label="Close"
            onClick={handleClose}
          ></button>
          {loading ? (
            <Skeleton count={5} />
          ) : (
            <h2 className='text-center' dangerouslySetInnerHTML={{ __html: Communitydata.Title }} />
          )}
        </Row>
        {loading ? (
          <Skeleton count={5} />
        ) : (
          <div className='pt-5' dangerouslySetInnerHTML={{ __html: Communitydata.Cpara }} />
        )}
 
        {
          Communitydata.ButtonLabel && (

            <Row className='d-flex justify-content-center pt-5'>
              <button className=' community-edit-btn'  onClick={() => window.open(Communitydata.Curl, '_blank')}>{Communitydata.ButtonLabel}</button>
            </Row>
          )
        }
      

        {
          localStorage.getItem('Auth') === 'true' && (
            <Row className='text-end'>
              <Button className='border-0 shadow-none bg-transparent' onClick={() => setShowModal(true)}>
                <img src={editIcon} alt="pen Icon" />
              </Button>
            </Row>
          )}
      </Container>
      {/* Modal for editing Title, CareerPara, and CareersUrl */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" dialogClassName='modal-fullscreen'>
        <Modal.Header closeButton>
          <Modal.Title>Community</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>Title</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              value={Title}
              onChange={setCommunityTitle}
            />
          </div>
          <div className="mb-3">
            <label>Paragraph</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              value={Cpara}
              onChange={setCommunityPara}
            />
          </div>
          <div className="mb-3">
            <label>URL</label>
            <input
              type="text"
              className="form-control"
              value={Curl}
              onChange={(e) => setCommunityUrl(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Button Label</label>
            <input
              type="text"
              className="form-control"
              value={ButtonLabel}
              onChange={(e) => setCommunityButtonLabel(e.target.value)}
            />
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
