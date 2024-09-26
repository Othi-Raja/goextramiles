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
export default function Careers() {
  const [Careerdata, setCareerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [careerTitle, setCareerTitle] = useState('');
  const [careerPara, setCareerPara] = useState('');
  const [careersUrl, setCareersUrl] = useState('');
  const navigate = useNavigate();
  // Fetch data from Firestore
  const fetchData = async () => {
    const docRef = doc(firestoreDb, 'Careers', 'CareersPage');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setCareerData(data);
      setCareerTitle(data.Title); // Set initial values for editing
      setCareerPara(data.CareerPara); // Set initial values for editing
      setCareersUrl(data.CareersUrl); // Set initial values for editing
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
    const docRef = doc(firestoreDb, 'Careers', 'CareersPage');
    await updateDoc(docRef, {
      Title: careerTitle,
      CareerPara: careerPara,
      CareersUrl: careersUrl,
    });
    setCareerData({
      Title: careerTitle,
      CareerPara: careerPara,
      CareersUrl: careersUrl,
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
            <h2 className='text-center' dangerouslySetInnerHTML={{ __html: Careerdata.Title }} />
          )}
        </Row>
        {loading ? (
          <Skeleton count={5} />
        ) : (
          <div className='pt-5' dangerouslySetInnerHTML={{ __html: Careerdata.CareerPara }} />
        )}
        <Row className='d-flex justify-content-center pt-5'>
          <button className=' career-edit-btn' onClick={() => window.open(Careerdata.CareersUrl, '_blank')}>Apply</button>
        </Row>
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
          <Modal.Title>Career</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>Career Title</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              value={careerTitle}
              onChange={setCareerTitle}
            />
          </div>
          <div className="mb-3">
            <label>Career Paragraph</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              value={careerPara}
              onChange={setCareerPara}
            />
          </div>
          <div className="mb-3">
            <label>Career URL</label>
            <input
              type="text"
              className="form-control"
              value={careersUrl}
              onChange={(e) => setCareersUrl(e.target.value)}
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
