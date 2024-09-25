import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestoreDb } from '../firebaseConfig';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton styles
import './footerDec.css';
import './feature.css'
export default function Features() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Add loading state
    const [Featuredata, setFeatureData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [currentFeature, setCurrentFeature] = useState({ featureKey: '', content: '', image: '' });
    const [isEditing, setIsEditing] = useState(false);
    // Function to handle close button click
    const handleClose = () => {
        navigate('/');
    };
    // Fetch data from Firestore
    const fetchData = async () => {
        const docRef = doc(firestoreDb, 'Features', 'FeaturesData');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setFeatureData(docSnap.data());
        } else {
            console.error("No such document!");
        }
        setLoading(false); // Set loading to false after data is fetched
    };
    // Save or update feature data
    const saveFeature = async () => {
        const updatedData = { ...Featuredata, [currentFeature.featureKey]: { Content: currentFeature.content, Image: currentFeature.image } };
        await setDoc(doc(firestoreDb, 'Features', 'FeaturesData'), updatedData);
        setFeatureData(updatedData);
        setShowModal(false);
    };
    // Delete feature
    const deleteFeature = async (key) => {
        const updatedData = { ...Featuredata };
        delete updatedData[key];
        await setDoc(doc(firestoreDb, 'Features', 'FeaturesData'), updatedData);
        setFeatureData(updatedData);
    };
    // Open modal for editing/adding
    const openModal = (featureKey = '', content = '', image = '') => {
        setCurrentFeature({ featureKey, content, image });
        setIsEditing(!!featureKey);
        setShowModal(true);
    };
    useEffect(() => {
        fetchData();
    }, []);
    const renderFeatures = () => {
        const features = Object.keys(Featuredata || {});
        return (
            <>
                {/* <h3>{Featuredata.FeatureText}</h3> */}
                {loading ? (
                    <Skeleton count={5} />
                ) : (
                    <Row>
                        <button
                            type="button"
                            className="btn-close btn-close-black position-absolute border-0 shadow-none outlin-none"
                            style={{ left: '40px', color: 'black' }}
                            aria-label="Close"
                            onClick={handleClose}
                        ></button>
                        <h3>Feature</h3>
                    </Row>
                )}
                {features.map((key, index) => {
                    const { Image, Content } = Featuredata[key];
                    const isImageLeft = index % 2 === 0;
                    return (
                        <Row key={key} className='my-4 pt-4'>
                            {loading ? (
                                <Skeleton count={5} />
                            ) : (
                                <>
                                    {isImageLeft ? (
                                        <>
                                            <Col sm={12} md={4}>
                                                <img src={Image} alt='Feature' className='img-fluid feature-Img' />
                                            </Col>
                                            <Col sm={12} md={8}>
                                                <div className='feature-content-controls Feature-Text' dangerouslySetInnerHTML={{ __html: Content }} />
                                                {localStorage.getItem('Auth') === 'true' && (
                                                    <>
                                                        <Button variant="warning" className='mx-3' onClick={() => openModal(key, Content, Image)}>Edit</Button>
                                                        <Button variant="danger" onClick={() => deleteFeature(key)}>Delete</Button>
                                                    </>
                                                )}
                                            </Col>
                                        </>
                                    ) : (
                                        <>
                                            <Col sm={12} md={8} className='pt-3'>
                                                <div className='feature-content-controls Feature-Text' dangerouslySetInnerHTML={{ __html: Content }} />
                                                {localStorage.getItem('Auth') === 'true' && (
                                                    <>
                                                        <Button variant="warning" className='mx-3' onClick={() => openModal(key, Content, Image)}>Edit</Button>
                                                        <Button variant="danger" onClick={() => deleteFeature(key)}>Delete</Button>
                                                    </>
                                                )}
                                            </Col>
                                            <Col sm={12} md={4}>
                                                <img src={Image} alt='Feature' className='img-fluid feature-Img' />
                                            </Col>
                                        </>
                                    )}
                                </>
                            )
                            }
                        </Row>
                    );
                })}
            </>
        );
    };
    return (
        <div className='text-center pt-5'>
            <Container>
                {renderFeatures()}
                {localStorage.getItem('Auth') === 'true' && (
                    <>
                        <Button variant="primary" onClick={() => openModal()}>Add New Feature</Button>
                    </>
                )}
            </Container>
            {/* Modal for adding/editing feature */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Feature' : 'Add New Feature'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="featureKey">
                            <Form.Label>Feature Key</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentFeature.featureKey}
                                onChange={(e) => setCurrentFeature({ ...currentFeature, featureKey: e.target.value })}
                                disabled={isEditing} // Disable key editing if already existing
                            />
                        </Form.Group>
                        <Form.Group controlId="featureContent">
                            <Form.Label>Content</Form.Label>
                            {/* Replace text input with ReactQuill text editor */}
                            <ReactQuill
                                value={currentFeature.content}
                                onChange={(content) => setCurrentFeature({ ...currentFeature, content })}
                            />
                        </Form.Group>
                        <Form.Group controlId="featureImage">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentFeature.image}
                                onChange={(e) => setCurrentFeature({ ...currentFeature, image: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={saveFeature}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
