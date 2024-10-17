import React, { useState, useEffect } from 'react';
import { Container, Row, Button, Modal, Form } from 'react-bootstrap';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestoreDb } from '../firebaseConfig';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import trashBtn from '../assets/trash.svg';
import editIcon from '../assets/pencil-square.svg';
import playstoreIcon from '../assets/playstore_black.png';
import AppStoreIcon from '../assets/appstore_blackk.svg';
import '../App.css';
export default function Registration() {
    const [Regdata, setRegData] = useState({ cards: [] });
    const [loading, setLoading] = useState(true);
    const [newBannerImg, setNewBannerImg] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
    const [currentCardIndex, setCurrentCardIndex] = useState(null);
    const [newCardData, setNewCardData] = useState({
        logo: '',
        title: '',
        paragraph: '',
        buttonLabel: '',
        buttonLink: '',
        appstoreUrl: '',
        playstoreUrl: ''
    });
    const navigate = useNavigate();
    const fetchData = async () => {
        const docRef = doc(firestoreDb, 'wevents', 'Plans');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setRegData({
                bannerImg: data.bannerImg || '',
                cards: data.cards || []
            });
        } else {
            console.error("No such document!");
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleClose = () => {
        navigate('/');
    };
    const handleModalShow = () => {
        setNewBannerImg(Regdata.bannerImg || '');
        setShowModal(true);
    };
    const handleModalClose = () => setShowModal(false);
    const saveBannerImage = async () => {
        const docRef = doc(firestoreDb, 'wevents', 'Plans');
        try {
            await updateDoc(docRef, { bannerImg: newBannerImg });
            setRegData((prevData) => ({ ...prevData, bannerImg: newBannerImg }));
            handleModalClose();
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };
    const handleCardModalShow = (index = null) => {
        setCurrentCardIndex(index);
        if (index !== null) {
            const cardData = Regdata.cards[index];
            setNewCardData(cardData);
        } else {
            setNewCardData({
                logo: '',
                title: '',
                paragraph: '',
                buttonLabel: '',
                buttonLink: '',
                appstoreUrl: '',
                playstoreUrl: ''
            });
        }
        setShowCardModal(true);
    };
    const handleCardModalClose = () => setShowCardModal(false);
    const saveCardData = async () => {
        const updatedCards = Array.isArray(Regdata.cards) ? [...Regdata.cards] : [];
        if (currentCardIndex !== null) {
            updatedCards[currentCardIndex] = newCardData; // Update existing card
        } else {
            updatedCards.push(newCardData); // Add new card
        }
        const docRef = doc(firestoreDb, 'wevents', 'Plans');
        try {
            await updateDoc(docRef, { cards: updatedCards });
            setRegData((prevData) => ({ ...prevData, cards: updatedCards }));
            handleCardModalClose();
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };
    const handleDeleteCardShow = (index) => {
        setCurrentCardIndex(index);
        setShowDeleteModal(true);
    };
    const handleDeleteModalClose = () => setShowDeleteModal(false);
    const deleteCardData = async () => {
        const updatedCards = [...Regdata.cards];
        updatedCards.splice(currentCardIndex, 1); // Remove the card at the specified index
        const docRef = doc(firestoreDb, 'EPlans', 'Plans');
        try {
            await updateDoc(docRef, { cards: updatedCards });
            setRegData((prevData) => ({ ...prevData, cards: updatedCards }));
            handleDeleteModalClose();
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };
    const handleCardDataChange = (key, value) => {
        setNewCardData((prevData) => {
            if (prevData[key] !== value) {
                return { ...prevData, [key]: value };
            }
            return prevData;
        });
    };
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline','strike'],
            [{ 'lineheight': ['1', '1.5', '2', '2.5', '3'] }],
            ['link'],
            [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
            ['clean']
        ],
        clipboard: { matchVisual: false }
    };
    const formats = [
        'header', 'font',
        'list', 'bullet',
        'bold', 'italic', 'underline','strike',
        'link',
        'align',
        'color', 'background'
    ];
    const [deviceType, setDeviceType] = useState('');
    // useEffect(() => {
    //   const getDeviceType = () => {
    //     const userAgent = navigator.userAgent;
    //     if (/android/i.test(userAgent)) {
    //       setDeviceType('Android');
    //     } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    //       setDeviceType('iPhone/iPad');
    //     } else if (window.innerWidth <= 768) {
    //       setDeviceType('Mobile');
    //     } else {
    //       setDeviceType('Laptop/Desktop');
    //     }
    //   };
    //   getDeviceType();
    // }, []);
    return (
        <>
            <Container fluid className="position-relative">
                <Row className="justify-content-center mt-3">
                    {loading ? (
                        <Skeleton count={5} />
                    ) : (
                        <div className="position-relative">
                            <button
                                type="button"
                                className="btn-close btn-close-white position-absolute border-0 shadow-none"
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
                            {localStorage.getItem('Auth') === 'true' && (
                                <Button
                                    variant="secondary"
                                    className="btn"
                                    onClick={handleModalShow}
                                >
                                    Edit Banner
                                </Button>
                            )}
                        </div>
                    )}
                </Row>
                <>
                    <Row className="mt-3 w-100 mb-5">
                        <div className='w-100 h-auto d-flex justify-content-center align-items-start flex-wrap'>
                            {Regdata.cards && Regdata.cards.map((card, index) => (
                                <div key={index} className="card m-2 border-0 Registration-card-style  mt-3" style={{ width: '25rem', height: 'auto' }}>
                                    <div className='text-center'>
                                        <img src={card.logo} className="card-img-top pt-2" alt="Logo" style={{ width: '100px' }} />
                                    </div>
                                    <div className="card-body d-flex flex-column justify-content-between ">
                                        <div>
                                            <h5 className="card-title Registration-title" dangerouslySetInnerHTML={{ __html: card.title }} />
                                            <p className="card-text Registration-para" dangerouslySetInnerHTML={{ __html: card.paragraph }} />
                                        </div>
                                        {card.buttonLabel?.length > 0 && (
                                            <div className='text-center mb-3'>
                                                <a href={card.buttonLink} className="btn btn-primary px-5 register-button" style={{ paddingLeft: '30px' }}>{card.buttonLabel}</a>
                                            </div>
                                        )}
                                        <div className='text-center'>
                                            {card.playstoreUrl?.length > 0 && (
                                                <a href={card.playstoreUrl} className="me-2" target='_blank' rel="noreferrer" ><img src={playstoreIcon} alt="Play Store Icon" width={100} /></a>
                                            )}
                                            {card.appstoreUrl?.length > 0 && (
                                                <a href={card.appstoreUrl} target='_blank' rel="noreferrer" ><img src={AppStoreIcon} alt="App Store Icon" width={100} /></a>
                                            )}
                                        </div>
                                    </div>
                                    <div className='position-absolute' style={{ top: '10px', right: '10px' }}>
                                        {localStorage.getItem('Auth') === 'true' && (
                                            <>
                                                <Button variant="link" onClick={() => handleCardModalShow(index)}>
                                                    <img src={editIcon} alt="Edit icon" />
                                                </Button>
                                                <Button variant="link" onClick={() => handleDeleteCardShow(index)}>
                                                    <img src={trashBtn} alt='Delete icon' />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {localStorage.getItem('Auth') === 'true' && (
                                <div className="card m-2 d-flex justify-content-center text-center align-content-center" onClick={() => handleCardModalShow()} style={{ width: '18rem', height: '350px', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '150px', opacity: '.2', fontWeight: '100' }}>+</span>
                                </div>
                            )}
                        </div>
                    </Row>
                </>
                {/* <h1>Device Type: {deviceType}</h1> */}
            </Container>
            {/* Modal for editing banner image */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-black-50'>Banner Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Enter Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={newBannerImg}
                                onChange={(e) => setNewBannerImg(e.target.value)}
                                placeholder="Enter image URL"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={saveBannerImage}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal for editing card data */}
            <Modal show={showCardModal} onHide={handleCardModalClose} className='modal-lg'>
                <Modal.Header closeButton>
                    <Modal.Title className='text-black-50'>Edit Card</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Logo URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCardData.logo}
                                onChange={(e) => handleCardDataChange('logo', e.target.value)}
                                placeholder="Enter logo URL"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <ReactQuill
                                theme="snow"
                                modules={modules}
                                formats={formats}
                                value={newCardData.title}
                                onChange={(value) => handleCardDataChange('title', value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Paragraph</Form.Label>
                            <ReactQuill
                                theme="snow"
                                modules={modules}
                                formats={formats}
                                value={newCardData.paragraph}
                                onChange={(value) => handleCardDataChange('paragraph', value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Button Label</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCardData.buttonLabel}
                                onChange={(e) => handleCardDataChange('buttonLabel', e.target.value)}
                                placeholder="Enter button label"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Button Link</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCardData.buttonLink}
                                onChange={(e) => handleCardDataChange('buttonLink', e.target.value)}
                                placeholder="Enter button link"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='pt-3'><img src={playstoreIcon} width={25} alt='playstoreIcon' /></Form.Label>
                            <Form.Control
                                type="text"
                                value={newCardData.playstoreUrl}
                                onChange={(e) => handleCardDataChange('playstoreUrl', e.target.value)}
                                placeholder="Enter PlayStore Url"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='pt-3'><img src={AppStoreIcon} width={25} alt='AppStoreIcon' /></Form.Label>
                            <Form.Control
                                type="text"
                                value={newCardData.appstoreUrl}
                                onChange={(e) => handleCardDataChange('appstoreUrl', e.target.value)}
                                placeholder="Enter AppStore Url"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCardModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={saveCardData}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal for delete confirmation */}
            <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='text-danger'>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this card ? This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteModalClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteCardData}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
