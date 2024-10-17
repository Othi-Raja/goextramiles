import React, { useEffect, useState } from 'react';
import { Navbar, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import appLogo from './assets/white_gem_logo.png';
import { doc, getDoc } from 'firebase/firestore';
import { firestoreDb } from './firebaseConfig';
import { Link } from 'react-router-dom';
export default function FooterList() {
    const [Footerlistdata, setFooterListData] = useState({});
    const [isDisabled, setIsDisabled] = useState(false); // Control the disabled state
    // Fetch data from Firestore
    const fetchData = async () => {
        const docRef = doc(firestoreDb, 'whome', 'HomePageData');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setFooterListData(docSnap.data());
        } else {
            console.error("No such document!");
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div id='footer' style={{zIndex:'9999'}}>
            <Container className='footer-container' >

                <Row>
                    <Col sm={3}>
                        <Navbar.Brand href="#home" className="d-flex align-items-center">
                            <img src={appLogo} alt="img" width={'185px'} className="me-2 custm-margin-footerlist" style={{ cursor: 'default' }} />
                        </Navbar.Brand>
                    </Col>
                    {/* Footer Items Display */}
                    <Col className='z-2'  >
                        <ul className='footer-subtitle-list'>
                            <li><span className='footer-title'>{Footerlistdata?.Footeritem1?.Heading}</span></li>
                            <li>
                                {isDisabled ? (
                                    <span className="text-white-50">{Footerlistdata?.Footeritem1?.SubTitle1}</span>
                                ) : (
                                    <Link to="/Features" target="_blank" className="text-white-50">
                                        {Footerlistdata?.Footeritem1?.SubTitle1}
                                    </Link>
                                )}
                            </li>
                            <li>
                                {isDisabled ? (
                                    <span className="text-white-50">{Footerlistdata?.Footeritem1?.SubTitle2}</span>
                                ) : (
                                    <Link to="/ForBusiness" target='_blank' className='text-white-50 z-3'>
                                        {Footerlistdata?.Footeritem1?.SubTitle2}
                                    </Link>
                                )}
                            </li>
                            <li>
                                {isDisabled ? (
                                    <span className="text-white-50">{Footerlistdata?.Footeritem1?.SubTitle3}</span>
                                ) : (
                                    <Link to="/Community" target='_blank' className='text-white-50'>
                                        {Footerlistdata?.Footeritem1?.SubTitle3}
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </Col>
                    <Col className='z-2'  >
                        <ul className='footer-subtitle-list'>
                            <li><span className='footer-title'>{Footerlistdata?.FooterItem2?.Heading}</span></li>
                            <li>
                                {isDisabled ? (
                                    <span className="text-white-50">{Footerlistdata?.FooterItem2?.SubTitle1}</span>
                                ) : (
                                    <Link to="/AboutUs" target='_blank' className='text-white-50'>
                                        {Footerlistdata?.FooterItem2?.SubTitle1}
                                    </Link>
                                )}
                            </li>
                            <li>
                                {isDisabled ? (
                                    <span className="text-white-50">{Footerlistdata?.FooterItem2?.SubTitle2}</span>
                                ) : (
                                    <Link to="/Careers" target='_blank' className='text-white-50'>
                                        {Footerlistdata?.FooterItem2?.SubTitle2}
                                    </Link>
                                )}
                            </li>
                            <li>
                                {isDisabled ? (
                                    <span className="text-white-50">{Footerlistdata?.FooterItem2?.SubTitle3}</span>
                                ) : (
                                    <Link to="/Privacy" target='_blank' className='text-white-50'>
                                        {Footerlistdata?.FooterItem2?.SubTitle3}
                                    </Link>
                                )}
                            </li>
                            <li>
                                {isDisabled ? (
                                    <span className="text-white-50">{Footerlistdata?.FooterItem2?.SubTitle4}</span>
                                ) : (
                                    <Link to="/ReleaseNotes" target='_blank' className='text-white-50'>
                                        {Footerlistdata?.FooterItem2?.SubTitle4}
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </Col>
                    <Col className='z-2'sm={2} >
                        <ul className='footer-subtitle-list'>
                            <li>
                                <span className='footer-title'>{Footerlistdata?.Footeritem3?.Heading}</span>
                            </li>
                            <li>
                                {Footerlistdata?.Footeritem3?.AndroidUrl ? (
                                    <a href={Footerlistdata?.Footeritem3?.AndroidUrl} target='_blank' rel="noreferrer" className='text-white-50'>
                                        {Footerlistdata?.Footeritem3?.SubTitle1}
                                    </a>
                                ) : (
                                    <span className="text-white-50">{Footerlistdata?.Footeritem3?.SubTitle1}</span>
                                )}
                            </li>
                            <li>
                                {Footerlistdata?.Footeritem3?.IOSUrl ? (
                                    <a href={Footerlistdata?.Footeritem3?.IOSUrl} target='_blank' rel="noreferrer" className='text-white-50'>
                                        {Footerlistdata?.Footeritem3?.SubTitle2}
                                    </a>
                                ) : (
                                    <span className="text-white-50">{Footerlistdata?.Footeritem3?.SubTitle2}</span>
                                )}
                            </li>
                        </ul>
                    </Col>
                    <Col className='z-2'>
                        <ul className='footer-subtitle-list'>
                            <li><span className='footer-title'>{Footerlistdata?.Footeritem4?.Heading}</span></li>
                            <li>
                                {isDisabled ? (
                                    <span className="text-white-50">{Footerlistdata?.Footeritem4?.SubTitle1}</span>
                                ) : (
                                    <Link to="/HelpVideos" target='_blank' className='text-white-50'>
                                        {Footerlistdata?.Footeritem4?.SubTitle1}
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
