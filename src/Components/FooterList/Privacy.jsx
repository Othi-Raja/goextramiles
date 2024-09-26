import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { firestoreDb } from '../firebaseConfig'; // Firestore configuration
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import './footerDec.css';
import 'react-quill/dist/quill.snow.css'; // Quill editor styles
import editIcon from '../assets/pencil-square.svg';
export default function Privacy() {
  const [Pdata, setprivacyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [PvtTitle, setprivacyTitle] = useState('');
  const [pvtPara, setprivacyPara] = useState('');
  const navigate = useNavigate();
  // Fetch data from Firestore
  const fetchData = async () => {
    const docRef = doc(firestoreDb, 'Privacy', 'PrivacyPg');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setprivacyData(data);
      setprivacyTitle(data.pvtTitle); // Set initial values for editing
      setprivacyPara(data.pvtPara); // Set initial values for editing
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
    const docRef = doc(firestoreDb, 'Privacy', 'PrivacyPg');
    await updateDoc(docRef, {
      PvtTitle: PvtTitle,
      pvtPara: pvtPara,
    });
    setprivacyData({
      PvtTitle: PvtTitle,
      pvtPara: pvtPara,
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
            // Align the title and the edit button on the same row
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <h2 className='text-center' dangerouslySetInnerHTML={{ __html: Pdata.PvtTitle }} />
              {/* Show edit button only if authenticated */}
              {localStorage.getItem('Auth') === 'true' && (
                <Button className='border-0 shadow-none bg-transparent ms-2' onClick={() => setShowModal(true)}>
                  <img src={editIcon} alt="pen Icon" />
                </Button>
              )}
            </Col>
          )}
        </Row>
        {loading ? (
          <Skeleton count={5} />
        ) : (
          <div className='pt-5' dangerouslySetInnerHTML={{ __html: Pdata.pvtPara }} />
        )}
      </Container>
      {/* Modal for editing Title and Paragraph */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" dialogClassName='modal-fullscreen'>
        <Modal.Header closeButton>
          <Modal.Title className='text-black-50'>Privacy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>Title</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              value={PvtTitle}
              onChange={setprivacyTitle}
            />
          </div>
          <div className="mb-3">
            <label className='text-black-50'>Paragraph</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              value={pvtPara}
              onChange={setprivacyPara}
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
