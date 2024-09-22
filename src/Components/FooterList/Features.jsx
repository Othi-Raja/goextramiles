import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestoreDb } from '../firebaseConfig';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
export default function Features() {
    const [Featuredata, setFeatureData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [currentFeature, setCurrentFeature] = useState({ featureKey: '', content: '', image: '' });
    const [isEditing, setIsEditing] = useState(false);
    // Fetch data from Firestore
    const fetchData = async () => {
        const docRef = doc(firestoreDb, 'Features', 'FeaturesData');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setFeatureData(docSnap.data());
        } else {
            console.error("No such document!");
        }
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
        return features.map((key, index) => {
            const { Image, Content } = Featuredata[key];
            const isImageLeft = index % 2 === 0;
            return (
                <Row key={key} className='my-4'>
                    {isImageLeft ? (
                        <>
                            <Col sm={12} md={4}>
                                <img src={Image} alt='Feature' className='img-fluid' />
                            </Col>
                            <Col sm={12} md={8}>
                                <div className='feature-content-controls'>{Content}</div>
                                {
                                    localStorage.getItem('Auth') === 'true' && (
                                        <>
                                            <Button variant="warning" className='mx-3' onClick={() => openModal(key, Content, Image)}>Edit</Button>
                                            <Button variant="danger" onClick={() => deleteFeature(key)}>Delete</Button>
                                        </>
                                    )
                                }
                            </Col>
                        </>
                    ) : (
                        <>
                            <Col sm={12} md={8} >
                                <div className='feature-content-controls'>{Content}</div>
                                {
                                    localStorage.getItem('Auth') === 'true' && (
                                        <>
                                            <Button variant="warning" className='mx-3' onClick={() => openModal(key, Content, Image)}>Edit</Button>
                                            <Button variant="danger" onClick={() => deleteFeature(key)}>Delete</Button>
                                        </>
                                    )
                                }
                            </Col>
                            <Col sm={12} md={4}>
                                <img src={Image} alt='Feature' className='img-fluid' />
                            </Col>
                        </>
                    )}
                </Row>
            );
        });
    };
    return (
        <div className='text-center pt-5'>
            <Container>
                {renderFeatures()}
                {
                    localStorage.getItem('Auth') === 'true' && (
                        <>
                            <Button variant="primary" onClick={() => openModal()}>Add New Feature</Button>
                        </>
                    )
                }
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
                            <Form.Control
                                type="text"
                                value={currentFeature.content}
                                onChange={(e) => setCurrentFeature({ ...currentFeature, content: e.target.value })}
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
                    <Button variant="secondary"  onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={saveFeature}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
