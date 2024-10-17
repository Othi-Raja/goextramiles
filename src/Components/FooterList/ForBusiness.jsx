import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton styles
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './footerDec.css';
import { firestoreDb } from '../firebaseConfig'; // Firestore configuration
import editIcon from '../assets/pencil-square.svg';
export default function ForBusiness() {
  const [Businesdata, setBusinesData] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ Btitle: '', Bpara: '', BImg: '' });
  const navigate = useNavigate();
  // Fetch data from Firestore
  const fetchData = async () => {
    const docRef = doc(firestoreDb, 'wbusiness', 'forbusiness');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setBusinesData(docSnap.data());
      setFormData(docSnap.data());
    } else {
      console.error('No such document!');
    }
    setLoading(false); // Set loading to false after data is fetched
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleClose = () => {
    navigate('/');
  };
  const handleSaveChanges = async () => {
    try {
      const docRef = doc(firestoreDb, 'wbusiness', 'forbusiness');
      await setDoc(docRef, formData);
      setBusinesData(formData);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };
  return (
    <>
      <Container>
        <Row className="align-items-center mb-4 mt-4">
          <Col xs="auto">
            {loading ? (
              <Skeleton count={5} />
            ) : (
              <button
                type="button"
                className="btn-close btn-close-black border-0 shadow-none"
                style={{ color: 'black' }}
                aria-label="Close"
                onClick={handleClose}
              ></button>
            )}
          </Col>
          <Col xs="auto" className="mx-auto">
            <h1 className="text-center">
              {loading ? <Skeleton width={200} /> : Businesdata.Btitle}
            </h1>
          </Col>
        </Row>
        <Container>
          <Row className="mt-5 ">
            <Col sm={12} md={4}>
              {loading ? (
                <Skeleton width={350} height={200} />
              ) : (
                <img src={Businesdata.BImg} alt="Business" width={'100%'} className="B-image mb-4" />
              )}
            </Col>
            <Col sm={12} md={8}>
              {loading ? (
                <Skeleton count={5} />
              ) : (
                <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: Businesdata.Bpara }} />
              )}
              <Row className="d-flex align-items-center mt-5">
                {loading ? (
                  <Skeleton count={5} />
                ) : (
                  Businesdata?.Blink ? (
                    <button
                      className="B-Button"
                      onClick={() => window.open(Businesdata.Blink, '_blank')}
                    >
                      Sign up/Create Business account
                    </button>
                  ) : (
                    <Link to='/CreateAccount' className="B-Button text-center text-decoration-none">Sign up/Create Business account</Link>
                  )
                )}
              </Row>
              {
                localStorage.getItem('Auth') === 'true' && (
                  <Button
                    variant="light"
                    className="ms-3 float-end  border-0 outline-none shadow-none bg-transparent mt-3 "
                    onClick={() => setShowModal(true)}
                    disabled={loading} // Disable edit while loading
                  >
                    <img src={editIcon} alt="pen Icon" />
                  </Button>
                )
              }
            </Col>
          </Row>
        </Container>
      </Container>
      {/* Bootstrap Modal for editing */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" dialogClassName='modal-fullscreen'>
        <Modal.Header closeButton>
          <Modal.Title>Business</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="Btitle">
              <Form.Label className='text-black-50'>Business Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.Btitle}
                onChange={(e) => setFormData({ ...formData, Btitle: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="Bpara" className="mt-3">
              <Form.Label className='text-black-50'>Business Description</Form.Label>
              <ReactQuill
                theme="snow"
                value={formData.Bpara}
                onChange={(content) => setFormData({ ...formData, Bpara: content })}
              />
            </Form.Group>
            <Form.Group controlId="BImg" className="mt-3">
              <Form.Label className='text-black-50'>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={formData.BImg}
                onChange={(e) => setFormData({ ...formData, BImg: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="BImg" className="mt-3">
              <Form.Label className='text-black-50'>Sign up/Create Business account</Form.Label>
              <Form.Control
                type="text"
                value={formData.Blink}
                onChange={(e) => setFormData({ ...formData, Blink: e.target.value })}
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
    </>
  );
}
