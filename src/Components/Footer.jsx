import { React, useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import '../Components/App.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { collection, getDocs } from 'firebase/firestore';
import { firestoreDb } from './firebaseConfig'; // Adjust the import path as necessary
import Instagram from './assets/social_media_icon/instagram.png';
import facebook from './assets/social_media_icon/facebook.png';
import twitter from './assets/social_media_icon/logo.svg';
import linkedin from './assets/social_media_icon/linkedin.png';
import WhatsApp from './assets/social_media_icon/whatsapp.png';
import Youtube from './assets/social_media_icon/youtube.png';
import Snapchat from './assets/social_media_icon/social.png';
import pinterest from './assets/social_media_icon/pinterest.png';
import Telegram from './assets/social_media_icon/telegram.png';
import TikTok from './assets/social_media_icon/tiktok.png';
import reddit from './assets/social_media_icon/reddit.png';
import thread from './assets/social_media_icon/threads.png'
// import WhatsApp from './images/WhatsApp.svg';
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router-dom';
//fetching  footer data from firestore
const fetchfooterContent = async () => {
    try {
        const footerCollection = collection(firestoreDb, 'wfooter'); // Reference to the Firestore collection
        const footerSnapshot = await getDocs(footerCollection); // Fetch all documents from the collection
        const footerList = footerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map the documents to their data
        return footerList; // Return the fetched data
    } catch (error) {
        console.error("Error fetching footer items:", error); // Handle any errors
        return [];
    }
};
export default function Footer() {
    const [footerItems, setfooterItems] = useState([]);
    useEffect(() => {
        const getfooterItems = async () => {
            const items = await fetchfooterContent();
            setfooterItems(items);
        };
        getfooterItems();
    }, []); // Empty dependency array ensures this effect runs only once
    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration
        });
    }, []);
    const date = new Date().getFullYear();
    return (
        <>
            <div id='footer' className='Footer'>
                {footerItems.length > 0 ? (
                    footerItems.map((item, index) => (
                        <Container className=' ' key={index}>
                            <hr className='mt-0' />
                            <Row>
                                {/* icons  */}
                                <Col xs={12} md={{ span: 4, order: 1 }} className=" mt2  S-icons d-flex flex-wrap justify-content-center  gap-4 order-lg  ">
                                    <a className='showAuthIcon' href={item.socialmediaLink[0]} rel="noopener noreferrer" target='_blank' style={{ display: item.instagramLIveUnlive }}>
                                        <img width={38} src={Instagram} alt="instagram" />
                                    </a>
                                    <a href={item.socialmediaLink[1]} target='_blank' rel="noopener noreferrer" style={{ display: item.FacebookLIveUnlive }}>
                                        <img width={38} src={facebook} alt="facebook" />
                                    </a>
                                    <a href={item.socialmediaLink[2]} target='_blank' rel="noopener noreferrer" style={{ display: item.LinkedinLIveUnlive }}><img width={38} src={linkedin} alt="linkedin" /></a>
                                    <a href={item.socialmediaLink[3]} target='_blank' rel="noopener noreferrer" style={{ display: item.tweeterLIveUnlive }}><img src={twitter} alt="twitter" /></a>
                                    <a href={item.socialmediaLink[4]} target='_blank' rel="noopener noreferrer" style={{ display: item.WhatsAppLIveUnlive }}><img className='pt-1' width={35} src={WhatsApp} alt="WhatsApp" /></a>
                                    <a href={item.socialmediaLink[5]} target='_blank' rel="noopener noreferrer" style={{ display: item.SnapChatLIveUnlive }}><img width={25} src={Snapchat} alt="Snapchat" /></a>
                                    <a href={item.socialmediaLink[6]} target='_blank' rel="noopener noreferrer" style={{ display: item.YouTubeLIveUnlive }}><img width={30} src={Youtube} alt="Youtube" /></a>
                                    <a href={item.socialmediaLink[7]} target='_blank' rel="noopener noreferrer" style={{ display: item.PinterestLIveUnlive }}><img width={30} src={pinterest} alt="pinterest" /></a>
                                    <a href={item.socialmediaLink[8]} target='_blank' rel="noopener noreferrer" style={{ display: item.TelegramLIveUnlive }}><img width={30} src={Telegram} alt="Telegram" /></a>
                                    <a href={item.socialmediaLink[9]} target='_blank' rel="noopener noreferrer" style={{ display: item.TikTokLIveUnlive }}><img width={30} src={TikTok} alt="TikTok" /></a>
                                    <a href={item.socialmediaLink[10]} target='_blank' rel="noopener noreferrer" style={{ display: item.redditLIveUnlive }}><img width={30} src={reddit} alt="reddit" /></a>
                                    <a href={item.socialmediaLink[11]} target='_blank' rel="noopener noreferrer" style={{ display: item.ThreadLIveUnlive }}><img width={30} src={thread} alt="thread" /></a>
                                </Col>
                                {/* copyright  */}
                                <Col xs={12} md={{ span: 4, order: 0 }} className="  mt-2 d-flex copyrt-Col order-md-2 order-lg-0  ">
                                    <small>
                                        {/* href={item.Copuright.CRUrl} */}
                                        <span className='F-disable-link-style'>
                                            <b>{date} &copy; {item.Copuright.CRText}</b>
                                        </span>
                                    </small>
                                </Col>
                                {/* T&C  */}
                                <Col xs={12} md={{ span: 4, order: 2 }} className='Pvt-col mt-2 d-flex  order-lg-2 '>
                                    <Link to="/Terms&Conditions" target='_blank' className='F-disable-link-style'>
                                        <small><b>{item.PvtPolicy.PvtText}</b></small>
                                    </Link>
                                </Col>
                            </Row>
                        </Container>
                    ))
                ) : (
                    <Skeleton width={'100%'} height={'80px'} />
                )}
            </div>
        </>
    );
}
