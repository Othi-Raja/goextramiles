import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Container, Row, Col, Button, Modal, Navbar } from 'react-bootstrap';
import { firestoreDb } from '../firebaseConfig'; // Firestore configuration
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import './footerDec.css';
import 'react-quill/dist/quill.snow.css'; // Quill editor styles
import editIcon from '../assets/pencil-square.svg';
import '../Policys/policy.css'
export default function ReleaseNotes() {
  const [Rndata, setRNData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [RNTitle, setRNTitle] = useState('');
  const [RNPara, setRNPara] = useState('');
  const navigate = useNavigate();
  // Fetch data from Firestore
  const fetchData = async () => {
    const docRef = doc(firestoreDb, 'ReleaseNotes', 'ReleaseNotesData');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setRNData(data);
      setRNTitle(data.RNTitle); // Set initial values for editing
      setRNPara(data.NotesContent); // Set initial values for editing
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
    const docRef = doc(firestoreDb, 'ReleaseNotes', 'ReleaseNotesData');
    await updateDoc(docRef, {
      RNTitle: RNTitle,  // Corrected to store title
      NotesContent: RNPara,  // Corrected to store paragraph
    });
    setRNData({
      RNTitle: RNTitle,
      NotesContent: RNPara,
    });
    setShowModal(false); // Close modal after saving
  };
  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],  // Added 'image' option here
      [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
      ['clean']
    ]
  };
  const formats = [
    'header', 'font',
    'list', 'bullet',
    'bold', 'italic', 'underline',
    'link', 'image',  // Added 'image' option here
    'align'
  ];
  return (
    <div>
      <Navbar className='mt-5 d-flex justify-content-center align-items-center sticky-top  glass-bg' style={{ borderRadius: '0 0 20px 20px' }}>
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
          // Align the title and the edit button on the same row
          <Col xs={12} className="d-flex align-items-center justify-content-center">
            <h2 className='text-center' dangerouslySetInnerHTML={{ __html: Rndata.RNTitle }} />
            {/* Show edit button only if authenticated */}
            {localStorage.getItem('Auth') === 'true' && (
              <Button className='border-0 shadow-none bg-transparent ms-2' onClick={() => setShowModal(true)}>
                <img src={editIcon} alt="pen Icon" />
              </Button>
            )}
          </Col>
        )}
      </Navbar>
      <Container className='ReleaseNotes'>
        {loading ? (
          <Skeleton count={5} />
        ) : (
          <div className='pt-5' dangerouslySetInnerHTML={{ __html: Rndata.NotesContent }} />
        )}
      </Container>
      {/* Modal for editing Title and Paragraph */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" dialogClassName='modal-fullscreen'>
        <Modal.Header closeButton>
          <Modal.Title>Release Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>Title</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              value={RNTitle}
              onChange={setRNTitle}
            />
          </div>
          <div className="mb-3">
            <label>Paragraph</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              value={RNPara}
              onChange={setRNPara}
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
