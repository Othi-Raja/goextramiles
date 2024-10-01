import React, { useState, useEffect } from 'react';
import { Container, Row, Table, Button, Form, Col, Modal } from 'react-bootstrap';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestoreDb } from '../firebaseConfig'; // Firestore configuration
import { Link, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill'; // Quill Text Editor
import 'react-quill/dist/quill.snow.css'; // Quill CSS
import '../App.css'; // Custom CSS if needed.
import '../Policys/policy.css';
import appstoreIcon from '../assets/appstore_icon.png';
import googleplayIcon from '../assets/googleplay_icon.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
export default function Registration() {
    const navigate = useNavigate();
    const [Regdata, setRegData] = useState({});
    const [editMode, setEditMode] = useState(false); // Toggle edit mode
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false); // Show modal for editing URLs
    const [appStoreUrl, setAppStoreUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [PaymentRegLink, setPaymentRegLinkUrl] = useState('');
    const [playStoreUrl, setPlayStoreUrl] = useState('');
    const [showAppStore, setShowAppStore] = useState(true); // Toggle AppStore URL visibility
    const [showPlayStore, setShowPlayStore] = useState(true); // Toggle PlayStore URL visibility
    // Fetch data from Firestore
    const fetchData = async () => {
        const docRef = doc(firestoreDb, 'EPlans', 'Plans');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setTableData(docSnap.data().plansData || []);
            setRegData(docSnap.data());
            setAppStoreUrl(docSnap.data().appStoreUrl || '');
            setPaymentRegLinkUrl(docSnap.data().PaymentRegLink || '');
            setPlayStoreUrl(docSnap.data().playStoreUrl || '');
            setShowAppStore(docSnap.data().showAppStore !== false); // Default to true if not present
            setShowPlayStore(docSnap.data().showPlayStore !== false); // Default to true if not present
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
    // Handle edit button toggle
    const handleEdit = () => {
        setEditMode(!editMode);
    };
    // Handle table input change
    const handleInputChange = (index, field, value) => {
        const newTableData = [...tableData];
        newTableData[index][field] = value;
        setTableData(newTableData);
    };
    // Add a new row
    const addRow = () => {
        setTableData([...tableData, { description: '', mobile: '', web: '' }]);
    };
    // Delete a row
    const deleteRow = (index) => {
        const newTableData = [...tableData];
        newTableData.splice(index, 1);
        setTableData(newTableData);
    };
    // Save data to Firestore
    const saveData = async () => {
        const docRef = doc(firestoreDb, 'EPlans', 'Plans');
        try {
            await updateDoc(docRef, {
                plansData: tableData,
                appStoreUrl,
                playStoreUrl,
                showAppStore,
                showPlayStore,
                PaymentRegLink
            });
            console.log("Document successfully updated!");
            handleModalClose();
        } catch (error) {
            console.error("Error updating document: ", error);
        }
        // Exit edit mode after saving
    };
    const handleModalShow = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);
    // console.log(Regdata);
    return (
        <>
            <Container fluid className="position-relative">
                <Row className="justify-content-center mt-3">
                    {loading ? (
                        <Skeleton count={5} /> // Show a sketch loader with 5 lines
                    ) : (
                        // Responsive banner with close button inside 
                        <div className="position-relative">
                            <button
                                type="button"
                                className="btn-close btn-close-white position-absolute border-0 shadow-none "
                                style={{ top: '30px', left: '40px', color: 'white' }}
                                aria-label="Close"
                                onClick={handleClose}
                            ></button>
                            <img
                                src={Regdata.bannerImg}
                                alt="banner"
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                                className="img-fluid img-thumbnail"
                            />
                        </div>
                    )
                    }
                    {/* Editable Table */}
                    <Container>
                        {loading ? (
                            <Skeleton count={5} /> // Show a sketch loader with 5 lines
                        ) : (
                            <Table className='mt-3'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th className='bg-black text-white text-center' style={{ fontWeight: '500' }}>REGISTER FROM MOBILE</th>
                                        <th className='text-center text-gray' style={{ fontWeight: '500', background: '#C8C8C8' }}>REGISTER FROM WEB</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row, index) => (
                                        <tr key={index}>
                                            <td>
                                                {editMode && (
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => deleteRow(index)}
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </td>
                                            <td className='pt-4'>
                                                {editMode ? (
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={row.description}
                                                        onChange={(value) => handleInputChange(index, 'description', value)}
                                                    />
                                                ) : (
                                                    <div dangerouslySetInnerHTML={{ __html: row.description }} />
                                                )}
                                            </td>
                                            <td className='text-center pt-4' style={{ background: '#D4D4D4' }}>
                                                {editMode ? (
                                                    <Form.Control
                                                        type="text"
                                                        value={row.mobile}
                                                        onChange={(e) => handleInputChange(index, 'mobile', e.target.value)}
                                                    />
                                                ) : (
                                                    row.mobile
                                                )}
                                            </td>
                                            <td className='text-center pt-4'>
                                                {editMode ? (
                                                    <Form.Control
                                                        type="text"
                                                        value={row.web}
                                                        onChange={(e) => handleInputChange(index, 'web', e.target.value)}
                                                    />
                                                ) : (
                                                    row.web
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )
                        }
                    </Container>
                    {localStorage.getItem('Auth') === 'true' && (
                        <>
                            <>
                                <Col style={{ display: editMode ? 'none' : 'block' }}>
                                    <Button variant="primary" className='px-5' onClick={handleEdit}>
                                        {editMode ? 'Save Changes' : 'Edit'}
                                    </Button>
                                </Col>
                            </>
                            {editMode && (
                                <>
                                    <Col>
                                        <Button variant="success" onClick={saveData} className="mx-3">
                                            Save Changes
                                        </Button>
                                        <Button variant="secondary" onClick={addRow}>
                                            Add Row
                                        </Button>
                                        <Button variant="secondary" className="px-3 ms-2 btn" onClick={handleModalShow}>
                                            Edit Apps
                                        </Button>
                                    </Col>
                                </>
                            )}
                        </>
                    )}
                </Row>
                {loading ? (
                    <Skeleton count={5} /> // Show a sketch loader with 5 lines
                ) : (
                    // Download the App Section with Pen Icon 
                    <Row className='text-center pt-4'>
                        <span className='text-black-50'>Download the App</span>
                    </Row>
                )
                }
                {loading ? (
                    <Skeleton count={5} /> // Show a sketch loader with 5 lines
                ) : (
                    // Download the App Section with Pen Icon
                    <Row className='w-100 d-flex justify-content-center pt-4'>
                        <Col sm={2}></Col>
                        <Col
                            sm={6}
                            className="d-flex justify-content-center align-items-center mb-3 mb-sm-0 "
                            style={{ textAlign: 'center' }} // Ensures the content is centered even if flex doesn't apply in certain cases
                        >
                            {showAppStore && (
                                <img
                                    onClick={() => window.open(Regdata.appStoreUrl, '_blank')}
                                    src={appstoreIcon}
                                    alt="AppStore"
                                    style={{ width: '150px', height: '100%', marginRight: '10px' }} // Optional: Adds space between images
                                />
                            )}
                            {showPlayStore && (
                                <img
                                    onClick={() => window.open(Regdata.playStoreUrl, '_blank')}
                                    src={googleplayIcon}
                                    alt="PlayStore"
                                    style={{ width: '150px' }}
                                />
                            )}
                        </Col>
                        <Col
                            sm={2}
                            className="d-flex justify-content-sm-end justify-content-center align-items-center"
                            style={{ textAlign: 'center' }} // Optional: Keeps the text centered on mobile if needed
                        >
                            <span className='register-pg'>
                                {Regdata.PaymentRegLink ? (
                                    <a
                                        href={Regdata.PaymentRegLink}
                                        target='_blank'
                                        rel="noreferrer"
                                        className='Feature-reg-btn btn'
                                        style={{ position: 'relative', right: '0', marginTop: '-25px' }} // Adjusted to be relative, so it aligns properly
                                    >
                                        REGISTER
                                    </a>
                                ) : (
                                    <Link
                                        to="/Verification"
                                        className='Feature-reg-btn btn'
                                        style={{ position: 'relative', right: '0' }}
                                    >
                                        REGISTER
                                    </Link>
                                )}
                            </span>
                        </Col>
                    </Row>
                )}
                <Col className='pb-4 mb-4 mt-4'>
                </Col>
            </Container>
            {/* Modal for Editing URLs */}
            <Modal show={showModal} onHide={handleModalClose} size="lg" dialogClassName='modal-fullscreen'>
                <Modal.Header closeButton>
                    <Modal.Title>AppStore and PlayStore</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="appStoreUrl">
                        <Form.Label>AppStore URL</Form.Label>
                        <Form.Control
                            type="text"
                            value={appStoreUrl}
                            onChange={(e) => setAppStoreUrl(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="playStoreUrl" className="mt-3">
                        <Form.Label>PlayStore URL</Form.Label>
                        <Form.Control
                            type="text"
                            value={playStoreUrl}
                            onChange={(e) => setPlayStoreUrl(e.target.value)}
                        />
                    </Form.Group>
                    {/* Toggle Buttons for Showing/Hiding URLs */}
                    <Form.Group controlId="showAppStore" className="mt-3">
                        <Form.Check
                            type="switch"
                            label="Show AppStore"
                            checked={showAppStore}
                            onChange={() => setShowAppStore(!showAppStore)}
                        />
                    </Form.Group>
                    <Form.Group controlId="showPlayStore" className="mt-3">
                        <Form.Check
                            type="switch"
                            label="Show PlayStore"
                            checked={showPlayStore}
                            onChange={() => setShowPlayStore(!showPlayStore)}
                        />
                    </Form.Group>
                    <Modal.Title className='pt-4'>Registration Link</Modal.Title>
                    <Form.Group controlId="playStoreUrl" className="mt-3">
                        <Form.Label>PlayStore URL</Form.Label>
                        <Form.Control
                            type="text"
                            value={PaymentRegLink}
                            onChange={(e) => setPaymentRegLinkUrl(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={saveData}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
