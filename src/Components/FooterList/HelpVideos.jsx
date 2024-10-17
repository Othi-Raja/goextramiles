import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestoreDb } from '../firebaseConfig';
import { Col, Row, Navbar, Button, Modal, Form } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import editIcon from '../assets/pencil-square.svg';
import deleteIcon from '../assets/trash.svg';

export default function HelpVideos() {
  const [Homedata, setHomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const navigate = useNavigate();

  // Fetch data from Firestore
  const fetchData = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(firestoreDb, 'whelpdeskvideo'));
    const videos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setHomeData(videos);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle the close button click
  const handleClose = () => {
    navigate('/');
  };

  // Open modal for adding or editing
  const handleShowModal = (video = null) => {
    if (video) {
      setCurrentVideoId(video.id);
      setPreviewImage(video.previewImage || '');
      setLink(video.link || '');
      setDescription(video.description || '');
    } else {
      setCurrentVideoId(null);
      setPreviewImage('');
      setLink('');
      setDescription('');
    }
    setShowModal(true);
  };

  // Save new or updated video
  const handleSaveChanges = async () => {
    if (currentVideoId) {
      const docRef = doc(firestoreDb, 'HelpdeskVedio', currentVideoId);
      await updateDoc(docRef, {
        previewImage,
        link,
        description,
      });
    } else {
      const collectionRef = collection(firestoreDb, 'HelpdeskVedio');
      await addDoc(collectionRef, {
        previewImage,
        link,
        description,
      });
    }
    setShowModal(false);
    fetchData();
  };

  // Delete video
  const handleDelete = async (id) => {
    const docRef = doc(firestoreDb, 'HelpdeskVedio', id);
    await deleteDoc(docRef);
    fetchData();
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
      ['clean']
    ]
  };

  const formats = [
    'header', 'list', 'bullet',
    'bold', 'italic', 'underline',
    'link', 'image',
    'align'
  ];

  return (
    <div>
      <Navbar className='d-flex justify-content-between align-items-center sticky-top glass-bg' style={{ borderRadius: '0 0 20px 20px' }}>
        <button
          type="button"
          className="btn-close btn-close-black position-absolute border-0 shadow-none"
          style={{ left: '40px', color: 'black' }}
          aria-label="Close"
          onClick={handleClose}
        ></button>
        {loading ? (
          <Skeleton count={1} height={30} />
        ) : (
          <Col xs={12} className="d-flex justify-content-between align-items-center">
          <h2 className='text-center flex-grow-1'>Help Videos</h2>
          {localStorage.getItem('Auth') === 'true' && (
            <Button className='btn btn-primary mx-5 px-4' style={{borderRadius:'100px'}} onClick={() => handleShowModal()}>
              Add
            </Button>
          )}
        </Col>
        
        )}
      </Navbar>
      <div className='container mt-5'>
        {loading ? (
          <Row>
            {Array.from({ length: 3 }).map((_, index) => (
              <Col md={4} key={index} className='my-3'>
                <Skeleton height={200} />
                <Skeleton count={3} />
              </Col>
            ))}
          </Row>
        ) : (
          <Row>
            {Homedata.map((video) => (
              <Col md={4} key={video.id} className='my-3'>
                <div className='video-item'>
                  <a href={video.link} target="_blank" rel="noopener noreferrer">
                    <img src={video.previewImage} alt="Preview" className="img-fluid rounded-3 shadow-sm" />
                  </a>
                  {localStorage.getItem('Auth') === 'true' && (
                    <div className='text-end'>
                      <Button className='border-0 shadow-none bg-transparent' onClick={() => handleShowModal(video)}>
                        <img src={editIcon} alt="Edit Icon" />
                      </Button>
                      <Button className='border-0 shadow-none bg-transparent ms-2' onClick={() => handleDelete(video.id)}>
                        <img src={deleteIcon} alt="Delete Icon" />
                      </Button>
                    </div>
                  )}
                  <p className='px-2 pt-3' dangerouslySetInnerHTML={{ __html: video.description }} />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentVideoId ? 'Edit Video' : 'Add New Video'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className='text-black-50'>Preview Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image link"
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
              />
              {previewImage && <img src={previewImage} alt="Preview" width="100" className="mt-2" />}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className='text-black-50'>Video Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter video link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className='text-black-50'>Description</Form.Label>
              <ReactQuill
                modules={modules}
                formats={formats}
                value={description}
                onChange={setDescription}
              />
            </Form.Group>
          </Form>
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
