import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { Container, Row, Col, Button, Modal, Navbar } from 'react-bootstrap';
import { firestoreDb } from '../firebaseConfig'; // Firestore configuration
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import './footerDec.css';
import 'react-quill/dist/quill.snow.css'; // Quill editor styles
import editIcon from '../assets/pencil-square.svg';
import deleteIcon from '../assets/trash.svg';
import addIcon from '../assets/pencil-square.svg';
import '../Policys/policy.css';
export default function ReleaseNotes() {
  const [releaseNotes, setReleaseNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState({ RNTitle: '', NotesContent: '', id: null });
  const navigate = useNavigate();
  // Fetch data from Firestore
  const fetchData = async () => {
    const docRef = doc(firestoreDb, 'wreleasenotes', 'ReleaseNotesData');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setReleaseNotes(data.releaseNotes || []); // Ensure releaseNotes is an array
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
  // Function to handle save changes
  const handleSaveChanges = async () => {
    const updatedNotes = [...releaseNotes];
    if (currentNote.id !== null) {
      // Edit existing note
      updatedNotes[currentNote.id] = {
        RNTitle: currentNote.RNTitle,
        NotesContent: currentNote.NotesContent,
      };
    } else {
      // Add new note
      updatedNotes.push({
        RNTitle: currentNote.RNTitle,
        NotesContent: currentNote.NotesContent,
      });
    }
    const docRef = doc(firestoreDb, 'wreleasenotes', 'ReleaseNotesData');
    await updateDoc(docRef, {
      releaseNotes: updatedNotes,
    });
    setReleaseNotes(updatedNotes);
    setShowModal(false);
    setCurrentNote({ RNTitle: '', NotesContent: '', id: null });
  };
  // Function to handle edit button click
  const handleEdit = (note, index) => {
    setCurrentNote({
      RNTitle: note.RNTitle,
      NotesContent: note.NotesContent,
      id: index,
    });
    setShowModal(true);
  };
  // Function to handle delete button click
  const handleDelete = async (index) => {
    const updatedNotes = [...releaseNotes];
    updatedNotes.splice(index, 1);
    const docRef = doc(firestoreDb, 'ReleaseNotes', 'ReleaseNotesData');
    await updateDoc(docRef, {
      releaseNotes: updatedNotes,
    });
    setReleaseNotes(updatedNotes);
  };
  // Function to handle add new release note button click
  const handleAddNew = () => {
    setCurrentNote({ RNTitle: '', NotesContent: '', id: null });
    setShowModal(true);
  };
  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
      ['clean'],
    ],
  };
  const formats = [
    'header', 'font',
    'list', 'bullet',
    'bold', 'italic', 'underline',
    'link', 'image',
    'align',
  ];
  return (
    <div>
      <Navbar className='mt-5 d-flex justify-content-center align-items-center sticky-top glass-bg' style={{ borderRadius: '0 0 20px 20px' }}>
        <button
          type="button"
          className="btn-close btn-close-black position-absolute border-0 shadow-none"
          style={{ left: '40px', color: 'black' }}
          aria-label="Close"
          onClick={handleClose}
        ></button>
        <Col xs={12} className="d-flex align-items-center justify-content-center">
          <h2 className='text-center'>Release Notes</h2>
          {localStorage.getItem('Auth') === 'true' && (
            <Button variant='primary' className=' ms-2' onClick={handleAddNew}>
              Add New Release
            </Button>
          )}
        </Col>
      </Navbar>
      <Container className='ReleaseNotes'>
        {loading ? (
          <Skeleton count={5} />
        ) : (
          releaseNotes.map((note, index) => (
            <div key={index} className='pt-5'>
              <div className='d-flex align-items-center justify-content-between'>
                <h3 dangerouslySetInnerHTML={{ __html: note.RNTitle }} />
                {localStorage.getItem('Auth') === 'true' && (
                  <div>
                    <Button className='border-0 shadow-none bg-transparent me-2' onClick={() => handleEdit(note, index)}>
                      <img className='p-1' src={editIcon} alt="Edit Icon" />
                    </Button>
                    <Button className='border-0 shadow-none bg-transparent ' onClick={() => handleDelete(index)}>
                      <img className='p-1' src={deleteIcon} alt="Delete Icon" />
                    </Button>
                  </div>
                )}
              </div>
              <div dangerouslySetInnerHTML={{ __html: note.NotesContent }} />
            </div>
          ))
        )}
      </Container>
      {/* Modal for editing Title and Paragraph */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" dialogClassName='modal-fullscreen'>
        <Modal.Header closeButton>
          <Modal.Title>Release Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>Title</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              value={currentNote.RNTitle}
              onChange={(value) => setCurrentNote({ ...currentNote, RNTitle: value })}
            />
          </div>
          <div className="mb-3">
            <label>Paragraph</label>
            <ReactQuill
              modules={modules}
              formats={formats}
              value={currentNote.NotesContent}
              onChange={(value) => setCurrentNote({ ...currentNote, NotesContent: value })}
            />
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
