import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestoreDb } from '../firebaseConfig'; // Firestore configuration
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Modal, Button, Container, Row } from 'react-bootstrap';
import ReactQuill from 'react-quill'; // Quill editor
import 'react-quill/dist/quill.snow.css'; // Quill editor styles
import editIcon from '../assets/pencil-square.svg';
import { useNavigate } from 'react-router-dom';
export default function AboutUs() {
  const [Aboutdata, setAboutData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutPara, setAboutPara] = useState('');
  const navigate = useNavigate();
  // Function to handle close button click
  const handleClose = () => {
    navigate('/');
  };
  // Fetch data from Firestore
  const fetchData = async () => {
    const docRef = doc(firestoreDb, 'About', 'aboutus');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setAboutData(data);
      setAboutTitle(data.AboutTitle); // Set initial values for editing
      setAboutPara(data.AboutPara); // Set initial values for editing
    } else {
      console.error("No such document!");
    }
    setLoading(false); // Set loading to false after data is fetched
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleSaveChanges = async () => {
    const docRef = doc(firestoreDb, 'About', 'aboutus');
    await updateDoc(docRef, {
      AboutTitle: aboutTitle,
      AboutPara: aboutPara,
    });
    setAboutData({
      AboutTitle: aboutTitle,
      AboutPara: aboutPara,
    });
    setShowModal(false); // Close modal after saving
  };
  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      [{ 'lineheight': ['1', '1.5', '2', '2.5', '3'] }],
      ['link'],
      [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
      // [{ 'color': ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f', '#000', '#fff'] }, 
      // { 'background': ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f', '#000', '#fff'] }],
      ['clean']
    ],
    clipboard: { matchVisual: false }
  };
  const formats = [
    'header', 'font',
    'list', 'bullet',
    'bold', 'italic', 'underline',
    'link',
    'align',
    'color', 'background'
  ];
  return (
    <div>
      <>
        <Container>
          <Row className='pt-5 text-center d-flex'>
            <button
              type="button"
              className="btn-close btn-close-black position-absolute border-0 shadow-none outlin-none"
              style={{ left: '40px', color: 'black' }}
              aria-label="Close"
              onClick={handleClose}
            ></button>
            {loading ? (
              <Skeleton count={5} /> // Show a sketch loader with 5 lines
            ) : (
              <div className=' d-flex justify-content-center'>
                <h2 dangerouslySetInnerHTML={{ __html: Aboutdata.AboutTitle }} />
                {localStorage.getItem('Auth') === 'true' && (
                  <Button className='border-0 shadow-none bg-transparent' style={{ marginTop: '-17px' }} onClick={() => setShowModal(true)}>
                    <img src={editIcon} alt="pen Icon" />
                  </Button>
                )
                }
              </div>
            )}
          </Row>
          {loading ? (
            <Skeleton count={5} /> // Show a sketch loader with 5 lines
          ) : (
            <div dangerouslySetInnerHTML={{ __html: Aboutdata.AboutPara }} />
          )}
        </Container>
      </>
      {/* Modal for editing AboutTitle and AboutPara */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" dialogClassName='modal-fullscreen'>
        <Modal.Header closeButton>
          <Modal.Title>About</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>About Title</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              value={aboutTitle} onChange={setAboutTitle} />
          </div>
          <div className="mb-3">
            <label>About Paragraph</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              value={aboutPara} onChange={setAboutPara} />
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
