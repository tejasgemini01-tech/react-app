import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapDisplay from './MapDisplay'; // Import the component you just created

// Make sure this URL matches your running API
const API_URL = 'https://testapi-2izu.onrender.com/api/Submissions';

function ContactForm() {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  
  // State for the list of submissions
  const [submissions, setSubmissions] = useState([]);

  // Fetch existing submissions when the component loads
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(API_URL);
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };
    fetchSubmissions();
  }, []);

  // Handler for the file input
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handler for the location button
   const handleGetLocation = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true, // Request a more accurate position
        timeout: 5000,           // Wait 5 seconds before timing out
        maximumAge: 0            // Don't use a cached position
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
             acc: position.coords.accuracy
          });
          setLocationError('');
        },
        () => {
          setLocationError('Unable to retrieve your location.');
        },
        options // Pass the options object here
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all data to the FormData object
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    if (location) {
      formData.append('latitude', location.lat);
      formData.append('longitude', location.lng);
    }
    
    try {
      const response = await axios.post(API_URL, formData);
      setSubmissions([...submissions, response.data]);
      
      // Clear form fields after submission
      setName('');
      setEmail('');
      setMessage('');
      setImageFile(null);
      setLocation(null);
      e.target.reset(); // Resets file input
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Check the console for details.');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Report Us</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <textarea placeholder="Your Message" value={message} onChange={(e) => setMessage(e.target.value)} required ></textarea>
          
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          
          <div className="location-section">
            <button type="button" onClick={handleGetLocation}>Get My Location</button>
            {location && <p>✅ Location captured!</p>}
            {locationError && <p style={{color: 'red'}}>{locationError}</p>}
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="submissions-container">
        <h3>Previous Submissions</h3>
        <ul>
          {submissions.map((sub) => (
            <li key={sub.id}>
              {sub.imageUrl && (
                <img src={sub.imageUrl} alt={sub.name} style={{ maxWidth: '100px', float: 'right', marginLeft: '10px' }} />
              )}
              <strong>{sub.name}</strong> ({sub.email})
              <p>{sub.message}</p>
              {sub.latitude && sub.longitude && (
                <MapDisplay lat={sub.latitude} lng={sub.longitude} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ContactForm;