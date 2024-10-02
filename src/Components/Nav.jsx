import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Modal, Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import appLogo from './assets/GemLogo.png'
import { auth } from './firebaseConfig';
import { getDocs, doc, updateDoc, collection, getDoc } from 'firebase/firestore';
import { firestoreDb } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import AOS from 'aos';
import 'aos/dist/aos.css';
// import { useLocation } from 'react-router-dom';
import { faPen, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Switch from 'react-switch';
import { Link } from 'react-router-dom';

// fetch Footer data
const fetchfooterContent = async () => {
  try {
    const footerCollection = collection(firestoreDb, 'FooterItems'); // Reference to the Firestore collection
    const footerSnapshot = await getDocs(footerCollection); // Fetch all documents from the collection
    const footerList = footerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map the documents to their data
    return footerList; // Return the fetched data
  } catch (error) {
    console.error("Error fetching nav items:", error); // Handle any errors
    return [];
  }
};
const updatefooterItem = async (id, updatedItem) => {
  try {
    const itemDoc = doc(firestoreDb, 'FooterItems', id); // Corrected the collection name to 'About'
    await updateDoc(itemDoc, updatedItem);
    // console.log('Document updated with ID: ', id);
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};
// Fetching Terms and con data
const fetchTncItems = async () => {
  try {
    const TncCollection = collection(firestoreDb, 'Policy');
    const TncSnapshot = await getDocs(TncCollection);
    const TncList = TncSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return TncList;
  } catch (error) {
    console.error("Error fetching Policy", error);
    return [];
  }
};
export default function MyNavBar() {
  const [authState, setAuthState] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  // footer usestate
  const [TncItems, setTncItems] = useState([]);
  const [editTncContent, seteditTncContent] = useState('');
  const [currentTNCItemId, setcurrentTNCItemId] = useState(null);
  const [footerItems, setfooterItems] = useState([]);
  const [footercurrentItem, setfooterCurrentItem] = useState(null);
  const [localChanges, setLocalChanges] = useState({});
  // home 
  const [Homedata, setHomeData] = useState({});
  const [editableHomeData, seteditableHomeData] = useState({
    Txt1: '',
    Txt2: '',
    // RegistrationItem: '',
    BgImg: '', // Default value for BgImg
    RegistrationLink: ''
  });
  const [Footerlistdata, setFooterListData] = useState({});
  const [FooterformData, setFooterFormData] = useState({
    Footeritem1: {},
    FooterItem2: {},
    Footeritem3: {},
    Footeritem4: {}
  });
  // Fetch data from Firestore
  const fetchfooterlistData = async () => {
    const docRef = doc(firestoreDb, 'Home', 'HomePageData');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setFooterListData(docSnap.data());
      setFooterFormData(docSnap.data());  // Initialize formData with fetched data
    } else {
      console.error("No such document!");
    }
  };
  const handlefooterListInputChange = (e, section, key) => {
    const updatedSection = { ...FooterformData[section], [key]: e.target.value };
    setFooterFormData({ ...FooterformData, [section]: updatedSection });
  };
  const [openDropdown, setOpenDropdown] = useState(null);
  const toggleDropdown = (dropdown) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null); // Close the dropdown if it's already open
    } else {
      setOpenDropdown(dropdown); // Open the clicked dropdown
    }
  };
  // Fetch data from Firestore
  const fetchData = async () => {
    const docRef = doc(firestoreDb, 'Home', 'HomePageData');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setHomeData(docSnap.data());
      seteditableHomeData(docSnap.data()); // Initialize editableHomeData
    } else {
      console.error("No such document!");
    }
  };
  useEffect(() => {
    fetchData();
    fetchfooterlistData();
  }, []);
  // Handle changes in modal input fields
  const handleHomeInputChange = (e) => {
    const { name, value } = e.target;
    seteditableHomeData({ ...editableHomeData, [name]: value });
  };
  const handleEditClick = (itemId, content) => {
    setcurrentTNCItemId(itemId);
    seteditTncContent(content);
    setShowModal(true);
  };
  useEffect(() => {
    AOS.init({ duration: 1000 });
    const getTncItems = async () => {
      const items = await fetchTncItems();
      setTncItems(items);
    };
    getTncItems();
  }, []);
  useEffect(() => {
    const getfooterItems = async () => {
      const items = await fetchfooterContent();
      setfooterItems(items);
    };
    getfooterItems();
  }, []); // Empty dependency array ensures this effect runs only once
  // Function to handle the toggle and store changes locally
  const editfooterContent = (item, field, newValue) => {
    if (!item || !footerItems) {
      console.error("Invalid item or footerItems.");
      return;
    }
    if (newValue && newValue !== item[field]) {
      // Optimistic UI Update
      const updatedItem = { ...item, [field]: newValue };
      // Update the UI immediately
      setfooterItems(prevItems =>
        prevItems.map(aboutItem => (aboutItem.id === item.id ? updatedItem : aboutItem))
      );
      // Store the changes locally
      setLocalChanges(prevChanges => ({
        ...prevChanges,
        [item.id]: updatedItem,
      }));
    }
  };
  const handleInputChange = (field, index, value) => {
    setfooterCurrentItem(prevItem => ({
      ...prevItem,
      [field]: prevItem[field] ? [
        ...prevItem[field].slice(0, index),
        value,
        ...prevItem[field].slice(index + 1)
      ] : prevItem[field]
    }));
  };
  const handleInputChangecopyright = (field, value) => {
    setfooterCurrentItem(prevItem => ({
      ...prevItem,
      Copuright: {
        ...prevItem.Copuright,
        [field]: value
      }
    }));
  };
  const handleInputChangepvt = (field, value) => {
    setfooterCurrentItem(prevItem => ({
      ...prevItem,
      PvtPolicy: {
        ...prevItem.PvtPolicy,
        [field]: value
      }
    }));
  };
  // const location = useLocation();
  // useEffect(() => {
  //   if (location.pathname === '/') {
  //     localStorage.clear();
  //   }
  // }, [location.pathname]);
  useEffect(() => {
    const auth = localStorage.getItem('Auth');
    if (auth === 'true') {
      setAuthState(true);
    }
  }, []);
  function handleSignOut() {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('Auth');
        // setAuthState(false);
        window.location.assign('/admin');
        window.location.reload();
        // signOutSuccess();
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  }
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  let handleEditButtonClick = () => {
    TncItems.forEach((item, index) => {
      handleEditClick(item.id, item.PolicyContent)
    })
    footerItems.forEach((footeritem, index) => {
      setfooterCurrentItem(footeritem);
    })
    setShowModal(true);
  }
  let handlePublish = async () => {
    if (!footercurrentItem) return; // Ensure footercurrentItem is defined
    try {
      // Validate fields before update
      if (!footercurrentItem.Copuright) {
        console.error('Invalid data format for update: Copuright is missing');
        return;
      }
      // Fields can be empty, so no need to check for CRText or CRUrl presence
      await updatefooterItem(footercurrentItem.id, footercurrentItem); // Implement updateAboutItem to save changes in Firestore
      console.log('footer updated successfully.');
    } catch (error) {
      console.error('Failed to save changes:', error);
      // Optionally handle error or display message to user
    }
    try {
      // Update Firestore with the locally stored changes
      await Promise.all(
        Object.entries(localChanges).map(([id, updatedItem]) =>
          updatefooterItem(id, updatedItem)
        )
      );
      // Clear local changes after successful update
      setLocalChanges({});
    } catch (error) {
      console.error("Failed to update Firestore:", error);
    }
    try {
      const docRef = doc(firestoreDb, 'Policy', currentTNCItemId);
      await updateDoc(docRef, { PolicyContent: editTncContent });
      setShowModal(false);
      // Optionally, refetch items to reflect changes immediately
      const updatedItems = await fetchTncItems();
      setTncItems(updatedItems);
    } catch (error) {
      console.error("Error updating document:", error);
    }
    try {
      // Home data updates
      const docRef = doc(firestoreDb, 'Home', 'HomePageData');
      // Filter out undefined values for Home data
      const updateData = {};
      if (editableHomeData.Txt1 !== undefined) updateData.Txt1 = editableHomeData.Txt1;
      if (editableHomeData.Txt2 !== undefined) updateData.Txt2 = editableHomeData.Txt2;
      if (editableHomeData.RegistrationItem !== undefined) updateData.RegistrationItem = editableHomeData.RegistrationItem;
      if (editableHomeData.BgImg !== undefined) updateData.BgImg = editableHomeData.BgImg;
      if (editableHomeData.RegistrationLink !== undefined) updateData.RegistrationLink = editableHomeData.RegistrationLink;
      // Update Home data in Firestore
      await updateDoc(docRef, updateData); // Update only fields with valid values
      setHomeData(editableHomeData); // Update local state for Home data
      // Footer data updates
      const footerUpdateData = {};
      // Ensure only valid fields are updated
      if (FooterformData.Footeritem1 !== undefined) footerUpdateData.Footeritem1 = FooterformData.Footeritem1;
      if (FooterformData.FooterItem2 !== undefined) footerUpdateData.FooterItem2 = FooterformData.FooterItem2;
      if (FooterformData.Footeritem3 !== undefined) footerUpdateData.Footeritem3 = FooterformData.Footeritem3;
      if (FooterformData.Footeritem4 !== undefined) footerUpdateData.Footeritem4 = FooterformData.Footeritem4;
      // Update Footer data in Firestore
      await updateDoc(docRef, footerUpdateData);  // Use the same docRef, as both Home and Footer are in 'HomePageData'
      // Fetch and refresh updated footer data
      await fetchfooterlistData();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
    //footer item list 
    console.log('hi vadaki')
    setShowModal(false);
    handleClose()
    window.location.reload();
  }
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
  // const quillModules = {
  //   toolbar: [
  //     [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }, { 'font': [] }],
  //     ['bold', 'italic', 'underline', 'strike'],
  //     ['blockquote', 'code-block'],
  //     ['link'],
  //     [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  //     [{ 'indent': '-1' }, { 'indent': '+1' }],
  //     [{ 'direction': 'rtl' }],
  //     [{ 'size': ['small', false, 'large', 'huge'] }],
  //     [{ 'color': [] }, { 'background': [] }],
  //     [{ 'align': [] }],
  //     ['clean']
  //   ],
  //   clipboard: { matchVisual: false }
  // };
  return (
    <>
      <Navbar expand="lg" id='Navbar' className='sticky-top'>
        <Container id='nav-container'>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <img src={appLogo} alt="img" width={'170px'} className="me-2 brand-logo" />
            {/* <span className=' brand-title
          '>Go Extra Mile</span> */}
          </Navbar.Brand>
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" className='toggle-btn outline-none border-0 shadow-none' />
        <Navbar.Collapse id="basic-navbar-nav"> */}
          <Nav className="ms-auto">
            <Link to='/ForBusiness'  target='_blank' className='px-2' style={{textDecoration:'none' ,color:'black', fontWeight:'500',fontSize:'18px'}}> For Business</Link>
          </Nav>
          {/* </Navbar.Collapse> */}
          {
            authState && (
              <Button className=' bg-transparent border-0 shadow-none' onClick={handleEditButtonClick}><FontAwesomeIcon icon={faPen} /></Button>
            )
          }
          {
            localStorage.getItem('Auth') === 'true' && (
              <span onClick={() => handleSignOut()} className='px-3 pt-2 text-white btn  border-1 btn-primary logout-btn'>LogOut</span>
              // <FontAwesomeIcon style={{color:'white',cursor:'pointer'}} values='logout' icon={faRightFromBracket}/>
            )
          }
        </Container>
      </Navbar>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" dialogClassName='modal-fullscreen'>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='section5-hover'>
            {/* //Home  */}
            <>
              <Modal.Header >
                <Modal.Title>Edit Home Page Content</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Title Text (Txt1)</Form.Label>
                        <Form.Control
                          type="text"
                          name="Txt1"
                          value={editableHomeData.Txt1}
                          onChange={handleHomeInputChange}
                          placeholder="Enter title text"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Subtitle Text (Txt2)</Form.Label>
                        <Form.Control
                          type="text"
                          name="Txt2"
                          value={editableHomeData.Txt2}
                          onChange={handleHomeInputChange}
                          placeholder="Enter subtitle text"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    {/* <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Registration Item</Form.Label>
                        <Form.Control
                          type="text"
                          name="RegistrationItem"
                          value={editableHomeData.RegistrationItem}
                          onChange={handleHomeInputChange}
                          placeholder="Enter registration item"
                        />
                      </Form.Group>
                    </Col> */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Background Image URL (BgImg)</Form.Label>
                        <Form.Control
                          type="text"
                          name="BgImg"
                          value={editableHomeData.BgImg}
                          onChange={handleHomeInputChange}
                          placeholder="Enter background image URL"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Registration Link</Form.Label>
                    <Form.Control
                      type="text"
                      name="RegistrationLink"
                      value={editableHomeData.RegistrationLink}
                      onChange={handleHomeInputChange}
                      placeholder="Enter registration link"
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
            </>
            <>
              <Row>
                <h4 className='pb-4'>Footer Components</h4>
                <Col>
                  {/* Edit Footer Item 1 */}
                  <Form.Group controlId="footerItem1">
                    <Form.Label className='text-black-50'>{FooterformData?.Footeritem1?.Heading}</Form.Label>
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.Footeritem1?.Heading || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'Footeritem1', 'Heading')}
                    />
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.Footeritem1?.SubTitle1 || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'Footeritem1', 'SubTitle1')}
                    />
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.Footeritem1?.SubTitle2 || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'Footeritem1', 'SubTitle2')}
                    />
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.Footeritem1?.SubTitle3 || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'Footeritem1', 'SubTitle3')}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  {/* Footer Item 2 */}
                  <Form.Group controlId="footerItem2">
                    <Form.Label className='text-black-50'>{FooterformData?.FooterItem2?.Heading}</Form.Label>
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.FooterItem2?.Heading || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'FooterItem2', 'Heading')}
                    />
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.FooterItem2?.SubTitle1 || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'FooterItem2', 'SubTitle1')}
                    />
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.FooterItem2?.SubTitle2 || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'FooterItem2', 'SubTitle2')}
                    />
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.FooterItem2?.SubTitle3 || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'FooterItem2', 'SubTitle3')}
                    />
                         <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.FooterItem2?.SubTitle4 || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'FooterItem2', 'SubTitle4')}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  {/* Footer Item 3 */}
                  <Form.Group controlId="footerItem2">
                    <Form.Label className='text-black-50'>{FooterformData?.Footeritem3?.Heading}</Form.Label>
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.Footeritem3?.Heading || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'Footeritem3', 'Heading')}
                    />
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.Footeritem3?.SubTitle1 || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'Footeritem3', 'SubTitle1')}
                    />
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.Footeritem3?.AndroidUrl || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'Footeritem3', 'AndroidUrl')}
                    />
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.Footeritem3?.SubTitle2 || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'Footeritem3', 'SubTitle2')}
                    />
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.Footeritem3?.IOSUrl || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'Footeritem3', 'IOSUrl')}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  {/* Footer Item 4 */}
                  <Form.Group controlId="footerItem2">
                    <Form.Label className='text-black-50'>{FooterformData?.Footeritem4?.Heading}</Form.Label>
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.Footeritem4?.Heading || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'Footeritem4', 'Heading')}
                    />
                    <Form.Control
                      type="text"
                      className='mt-2 border-2 outline-none shadow-none'
                      value={FooterformData?.Footeritem4?.SubTitle1 || ''}
                      onChange={(e) => handlefooterListInputChange(e, 'Footeritem4', 'SubTitle1')}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
            <h5>Footer</h5>
            {footerItems.length > 0 &&
              footerItems.map((item, index) => (
                footercurrentItem && (
                  <div key={index}>
                    <div>
                      {/* row one  */}
                      <Row>
                        {/* Instagram icon controls */}
                        <Col md={4}>
                          <Button className="p-0  bg-gray px-2 borderradius-bottomNone-Left-right mb-2 " onClick={() => toggleDropdown('instagram')}>
                            <label htmlFor='instagramLink' className='form-label pt-3'>
                              <i className='bi bi-instagram'></i> <span>Instagram
                                {openDropdown === 'instagram' ? (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretUp} />
                                ) : (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretDown} />
                                )}
                              </span>
                            </label>
                          </Button>
                          {
                            openDropdown === 'instagram' && (
                              <div className='mb-3 bg-light p-2'>
                                <input
                                  type='text'
                                  className='form-control shadow-none bg-transparent border-1'
                                  id='instagramLink'
                                  value={footercurrentItem.socialmediaLink[0]}
                                  onChange={(e) => handleInputChange('socialmediaLink', 0, e.target.value)}
                                />
                                <div className=' float-end pt-2'>
                                  <Switch
                                    onChange={(checked) => editfooterContent(item, 'instagramLIveUnlive', checked ? 'block' : 'none')}
                                    checked={item.instagramLIveUnlive === 'block'}
                                    onColor="#183153"
                                    offColor="#183153"
                                    handleDiameter={20}
                                    onHandleColor='#00d26a'
                                    offHandleColor='#f8312f'
                                  />
                                </div>
                              </div>
                            )
                          }
                        </Col>
                        {/* facebook icon controls  */}
                        <Col md={4}>
                          <Button className="p-0  bg-gray px-2 borderradius-bottomNone-Left-right mb-2 " onClick={() => toggleDropdown('facebook')}>
                            <label htmlFor='facebookLink' className='form-label pt-3'>
                              <i className='bi bi-facebook'></i> <span>Facebook
                                {openDropdown === 'facebook' ? (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretUp} />
                                ) : (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretDown} />
                                )}
                              </span>
                            </label>
                          </Button>
                          {
                            openDropdown === 'facebook' && (
                              <div className='mb-3 p-2 bg-light-subtle'>
                                <input
                                  type='text'
                                  className='form-control shadow-none bg-transparent border-1'
                                  id='facebookLink'
                                  value={footercurrentItem.socialmediaLink[1]}
                                  onChange={(e) => handleInputChange('socialmediaLink', 1, e.target.value)}
                                />
                                <div className=' float-end pt-2'>
                                  <Switch
                                    onChange={(checked) => editfooterContent(item, 'FacebookLIveUnlive', checked ? 'block' : 'none')}
                                    checked={item.FacebookLIveUnlive === 'block'}
                                    onColor="#183153"
                                    offColor="#183153"
                                    handleDiameter={20}
                                    onHandleColor='#00d26a'
                                    offHandleColor='#f8312f'
                                  />
                                </div>
                              </div>
                            )
                          }
                        </Col>
                        {/* linkedIn icon controls  */}
                        <Col md={4}>
                          <Button className="p-0  bg-gray px-2 borderradius-bottomNone-Left-right  mb-2" onClick={() => toggleDropdown('linkedin')}>
                            <label htmlFor='linkedinLink' className='form-label pt-3'>
                              <i className='bi bi-linkedin'></i> <span>linkedin
                                {openDropdown === 'linkedin' ? (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretUp} />
                                ) : (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretDown} />
                                )}
                              </span>
                            </label>
                          </Button>
                          {
                            openDropdown === 'linkedin' && (
                              <div className='mb-3'>
                                <input
                                  type='text'
                                  className='form-control shadow-none bg-transparent border-1'
                                  id='linkedinLink'
                                  value={footercurrentItem.socialmediaLink[2]}
                                  onChange={(e) => handleInputChange('socialmediaLink', 2, e.target.value)}
                                />
                                <div className='float-end pt-2'>
                                  <Switch
                                    onChange={(checked) => editfooterContent(item, 'LinkedinLIveUnlive', checked ? 'block' : 'none')}
                                    checked={item.LinkedinLIveUnlive === 'block'}
                                    onColor="#183153"
                                    offColor="#183153"
                                    handleDiameter={20}
                                    onHandleColor='#00d26a'
                                    offHandleColor='#f8312f'
                                  />
                                </div>
                              </div>
                            )
                          }
                        </Col>
                      </Row>
                      {/* section-2 */}
                      <Row>
                        {/* Twitter-X icon controls */}
                        <Col md={4}>
                          <Button className="p-0  bg-gray px-2 borderradius-bottomNone-Left-right mb-2 " onClick={() => toggleDropdown('twitter')}>
                            <label htmlFor='twitterLink' className='form-label pt-3'>
                              <i className='bi bi-twitter-x'></i> <span>Twitter-X
                                {openDropdown === 'twitter' ? (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretUp} />
                                ) : (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretDown} />
                                )}
                              </span>
                            </label>
                          </Button>
                          {
                            openDropdown === 'twitter' && (
                              <div className='mb-3'>
                                <input
                                  type='text'
                                  className='form-control shadow-none bg-transparent border-1'
                                  id='twitterLink'
                                  value={footercurrentItem.socialmediaLink[3]}
                                  onChange={(e) => handleInputChange('socialmediaLink', 3, e.target.value)}
                                />
                                <div className=' float-end pt-2'>
                                  <Switch
                                    onChange={(checked) => editfooterContent(item, 'tweeterLIveUnlive', checked ? 'block' : 'none')}
                                    checked={item.tweeterLIveUnlive === 'block'}
                                    onColor="#183153"
                                    offColor="#183153"
                                    handleDiameter={20}
                                    onHandleColor='#00d26a'
                                    offHandleColor='#f8312f'
                                  />
                                </div>
                              </div>
                            )
                          }
                        </Col>
                        {/* WhatsApp icon controls */}
                        <Col md={4}>
                          <Button className="p-0  bg-gray px-2 borderradius-bottomNone-Left-right mb-2 " onClick={() => toggleDropdown('WhatsApp')}>
                            <label htmlFor='whatsappLink' className='form-label pt-3'>
                              <i className='bi bi-whatsapp'></i> <span>WhatsApp
                                {openDropdown === 'WhatsApp' ? (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretUp} />
                                ) : (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretDown} />
                                )}
                              </span>
                            </label>
                          </Button>
                          {
                            openDropdown === 'WhatsApp' && (
                              <div className='mb-3'>
                                <input
                                  type='text'
                                  className='form-control shadow-none bg-transparent border-1'
                                  id='WhatsAppLink'
                                  value={footercurrentItem.socialmediaLink[4]}
                                  onChange={(e) => handleInputChange('socialmediaLink', 4, e.target.value)}
                                />
                                <div className=' float-end pt-2'>
                                  <Switch
                                    onChange={(checked) => editfooterContent(item, 'WhatsAppLIveUnlive', checked ? 'block' : 'none')}
                                    checked={item.WhatsAppLIveUnlive === 'block'}
                                    onColor="#183153"
                                    offColor="#183153"
                                    handleDiameter={20}
                                    onHandleColor='#00d26a'
                                    offHandleColor='#f8312f'
                                  />
                                </div>
                              </div>
                            )
                          }
                        </Col>
                        {/* Snapchat icon controls */}
                        <Col md={4}>
                          <Button className="p-0  bg-gray px-2 borderradius-bottomNone-Left-right mb-2 " onClick={() => toggleDropdown('SnapChat')}>
                            <label htmlFor='whatsappLink' className='form-label pt-3'>
                              <i className='bi bi-snapchat'></i> <span>SnapChat
                                {openDropdown === 'SnapChat' ? (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretUp} />
                                ) : (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretDown} />
                                )}
                              </span>
                            </label>
                          </Button>
                          {
                            openDropdown === 'SnapChat' && (
                              <div className='mb-3'>
                                <input
                                  type='text'
                                  className='form-control shadow-none bg-transparent border-1'
                                  id='SnapchatLink'
                                  value={footercurrentItem.socialmediaLink[5]}
                                  onChange={(e) => handleInputChange('socialmediaLink', 5, e.target.value)}
                                />
                                <div className=' float-end pt-2'>
                                  <Switch
                                    onChange={(checked) => editfooterContent(item, 'SnapChatLIveUnlive', checked ? 'block' : 'none')}
                                    checked={item.SnapChatLIveUnlive === 'block'}
                                    onColor="#183153"
                                    offColor="#183153"
                                    handleDiameter={20}
                                    onHandleColor='#00d26a'
                                    offHandleColor='#f8312f'
                                  />
                                </div>
                              </div>
                            )
                          }
                        </Col>
                      </Row>
                      <Row>
                        {/* Youtube icon controls */}
                        <Col md={4}>
                          <Button className="p-0  bg-gray px-2 borderradius-bottomNone-Left-right mb-2 " onClick={() => toggleDropdown('Youtube')}>
                            <label htmlFor='twitterLink' className='form-label pt-3'>
                              <i className='bi bi-youtube'></i> <span>YouTube
                                {openDropdown === 'Youtube' ? (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretUp} />
                                ) : (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretDown} />
                                )}
                              </span>
                            </label>
                          </Button>
                          {
                            openDropdown === 'Youtube' && (
                              <div className='mb-3'>
                                <input
                                  type='text'
                                  className='form-control shadow-none bg-transparent border-1'
                                  id='YoutubeLink'
                                  value={footercurrentItem.socialmediaLink[6]}
                                  onChange={(e) => handleInputChange('socialmediaLink', 6, e.target.value)}
                                />
                                <div className=' float-end pt-2'>
                                  <Switch
                                    onChange={(checked) => editfooterContent(item, 'YouTubeLIveUnlive', checked ? 'block' : 'none')}
                                    checked={item.YouTubeLIveUnlive === 'block'}
                                    onColor="#183153"
                                    offColor="#183153"
                                    handleDiameter={20}
                                    onHandleColor='#00d26a'
                                    offHandleColor='#f8312f'
                                  />
                                </div>
                              </div>
                            )
                          }
                        </Col>
                        {/* Pinterest icon controls */}
                        <Col md={4}>
                          <Button className="p-0  bg-gray px-2 borderradius-bottomNone-Left-right mb-2 " onClick={() => toggleDropdown('Pinterest')}>
                            <label htmlFor='whatsappLink' className='form-label pt-3'>
                              <i className='bi bi-pinterest'></i> <span>Pinterest
                                {openDropdown === 'Pinterest' ? (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretUp} />
                                ) : (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretDown} />
                                )}
                              </span>
                            </label>
                          </Button>
                          {
                            openDropdown === 'Pinterest' && (
                              <div className='mb-3'>
                                <input
                                  type='text'
                                  className='form-control shadow-none bg-transparent border-1'
                                  id='WhatsAppLink'
                                  value={footercurrentItem.socialmediaLink[7]}
                                  onChange={(e) => handleInputChange('socialmediaLink', 7, e.target.value)}
                                />
                                <div className=' float-end pt-2'>
                                  <Switch
                                    onChange={(checked) => editfooterContent(item, 'PinterestLIveUnlive', checked ? 'block' : 'none')}
                                    checked={item.PinterestLIveUnlive === 'block'}
                                    onColor="#183153"
                                    offColor="#183153"
                                    handleDiameter={20}
                                    onHandleColor='#00d26a'
                                    offHandleColor='#f8312f'
                                  />
                                </div>
                              </div>
                            )
                          }
                        </Col>
                        {/* Telegram icon controls */}
                        <Col md={4}>
                          <Button className="p-0  bg-gray px-2 borderradius-bottomNone-Left-right mb-2 " onClick={() => toggleDropdown('telegram')}>
                            <label htmlFor='whatsappLink' className='form-label pt-3'>
                              <i className='bi bi-telegram'></i> <span>Telegram
                                {openDropdown === 'telegram' ? (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretUp} />
                                ) : (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretDown} />
                                )}
                              </span>
                            </label>
                          </Button>
                          {
                            openDropdown === 'telegram' && (
                              <div className='mb-3 ' style={{ zIndex: '9999' }}>
                                <input
                                  type='text'
                                  className='form-control shadow-none bg-transparent border-1'
                                  id='telegramLink'
                                  value={footercurrentItem.socialmediaLink[8]}
                                  onChange={(e) => handleInputChange('socialmediaLink', 8, e.target.value)}
                                />
                                <div className=' float-end pt-2'>
                                  <Switch
                                    onChange={(checked) => editfooterContent(item, 'TelegramLIveUnlive', checked ? 'block' : 'none')}
                                    checked={item.TelegramLIveUnlive === 'block'}
                                    onColor="#183153"
                                    offColor="#183153"
                                    handleDiameter={20}
                                    onHandleColor='#00d26a'
                                    offHandleColor='#f8312f'
                                  />
                                </div>
                              </div>
                            )
                          }
                        </Col>
                      </Row>
                      <Row>
                        {/* TikTok icon controls */}
                        <Col md={4}>
                          <Button className="p-0  bg-gray px-2 borderradius-bottomNone-Left-right mb-2 " onClick={() => toggleDropdown('tiktok')}>
                            <label htmlFor='TikTokLink' className='form-label pt-3'>
                              <i className='bi bi-tiktok'></i> <span>TikTok
                                {openDropdown === 'tiktok' ? (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretUp} />
                                ) : (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretDown} />
                                )}
                              </span>
                            </label>
                          </Button>
                          {
                            openDropdown === 'tiktok' && (
                              <div className='mb-3'>
                                <input
                                  type='text'
                                  className='form-control shadow-none bg-transparent border-1'
                                  id='TikTokLink'
                                  value={footercurrentItem.socialmediaLink[9]}
                                  onChange={(e) => handleInputChange('socialmediaLink', 9, e.target.value)}
                                />
                                <div className='float-end pt-2'>
                                  <Switch
                                    onChange={(checked) => editfooterContent(item, 'TikTokLIveUnlive', checked ? 'block' : 'none')}
                                    checked={item.TikTokLIveUnlive === 'block'}
                                    onColor="#183153"
                                    offColor="#183153"
                                    handleDiameter={20}
                                    onHandleColor='#00d26a'
                                    offHandleColor='#f8312f'
                                  />
                                </div>
                              </div>
                            )
                          }
                        </Col>
                        {/*REDDIT icon controls */}
                        <Col md={4}>
                          <Button className="p-0  bg-gray px-2 borderradius-bottomNone-Left-right mb-2 " onClick={() => toggleDropdown('reddit')}>
                            <label htmlFor='redditLink' className='form-label pt-3'>
                              <i className='bi bi-reddit'></i> <span>Reddit
                                {openDropdown === 'reddit' ? (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretUp} />
                                ) : (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretDown} />
                                )}
                              </span>
                            </label>
                          </Button>
                          {
                            openDropdown === 'reddit' && (
                              <div className='mb-3'>
                                <input
                                  type='text'
                                  className='form-control shadow-none bg-transparent border-1'
                                  id='redditLink'
                                  value={footercurrentItem.socialmediaLink[10]}
                                  onChange={(e) => handleInputChange('socialmediaLink', 10, e.target.value)}
                                />
                                <div className='float-end pt-2'>
                                  <Switch
                                    onChange={(checked) => editfooterContent(item, 'redditLIveUnlive', checked ? 'block' : 'none')}
                                    checked={item.redditLIveUnlive === 'block'}
                                    onColor="#183153"
                                    offColor="#183153"
                                    handleDiameter={20}
                                    onHandleColor='#00d26a'
                                    offHandleColor='#f8312f'
                                  />
                                </div>
                              </div>
                            )
                          }
                        </Col>
                        {/*REDDIT icon controls */}
                        <Col md={4}>
                          <Button className="p-0  bg-gray px-2 borderradius-bottomNone-Left-right mb-2 " onClick={() => toggleDropdown('Thread')}>
                            <label htmlFor='ThreadLink' className='form-label pt-3'>
                              <i className='bi bi-threads'></i> <span>Threads
                                {openDropdown === 'Thread' ? (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretUp} />
                                ) : (
                                  <FontAwesomeIcon color='grey' width={20} icon={faCaretDown} />
                                )}
                              </span>
                            </label>
                          </Button>
                          {
                            openDropdown === 'Thread' && (
                              <div className='mb-3'>
                                <input
                                  type='text'
                                  className='form-control shadow-none bg-transparent border-1'
                                  id='ThreadLink'
                                  value={footercurrentItem.socialmediaLink[11]}
                                  onChange={(e) => handleInputChange('socialmediaLink', 11, e.target.value)}
                                />
                                <div className='float-end pt-2'>
                                  <Switch
                                    onChange={(checked) => editfooterContent(item, 'ThreadLIveUnlive', checked ? 'block' : 'none')}
                                    checked={item.ThreadLIveUnlive === 'block'}
                                    onColor="#183153"
                                    offColor="#183153"
                                    handleDiameter={20}
                                    onHandleColor='#00d26a'
                                    offHandleColor='#f8312f'
                                  />
                                </div>
                              </div>
                            )
                          }
                        </Col>
                      </Row>
                      {/* coptright  */}
                      <Row>
                        <Col sm={6} md={6}>
                          <div>
                            <span className='model-content-title'>CopyRight</span>
                            <input
                              type="text"
                              className="form-control mb-3 shadow-none bg-transparent border-1"
                              value={footercurrentItem.Copuright.CRText}
                              onChange={(e) => handleInputChangecopyright('CRText', e.target.value)}
                            />
                          </div>
                        </Col>
                        {/* <Col sm={6} md={6}>
                          <div>
                            <span>Url <span><FontAwesomeIcon color='grey' width={17} icon={faLink} /></span></span>
                            <input
                              type="text"
                              className="form-control mb-3 shadow-none bg-transparent border-1"
                              value={footercurrentItem.Copuright.CRUrl}
                              onChange={(e) => handleInputChangecopyright('CRUrl', e.target.value)}
                            />
                          </div>
                        </Col> */}
                      </Row>
                    </div>
                    {/*terms and condition */}
                    <Row>
                      <Col sm={6} md={6}>
                        <div>
                          <span className='model-content-title'>Term&condition</span>
                          <input
                            type="text"
                            className="form-control mb-3 shadow-none bg-transparent border-1"
                            value={footercurrentItem.PvtPolicy.PvtText}
                            onChange={(e) => handleInputChangepvt('PvtText', e.target.value)}
                          />
                        </div>
                      </Col>
                      {/* <Col sm={6} md={6}>
                        <div>
                          <span className='model-content-title'>Url <span><FontAwesomeIcon width={17} color='grey' icon={faLink} /></span></span>
                          <input
                            type="text"
                            className="form-control mb-3 shadow-none bg-transparent border-1"
                            value={footercurrentItem.PvtPolicy.PvtUrl}
                            onChange={(e) => handleInputChangepvt('PvtUrl', e.target.value)}
                          />
                        </div>
                      </Col> */}
                      <h3>Edit Terms and Conditions.</h3>
                      <ReactQuill
                        value={editTncContent}
                        onChange={seteditTncContent}
                        modules={modules}
                        formats={formats}
                        className='mt-3  bg-transparent border-1'
                      />
                    </Row>
                  </div>
                )
              ))
            }
          </Row>
        </Modal.Body>
        <Modal.Footer >
          <Button variant="secondary" className='close-btn px-3' onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" className='Publish-btn px-5' onClick={() => { handlePublish(); handleOpen(); }}>
            Publish
          </Button>
        </Modal.Footer>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Modal>
    </>
  );
}
