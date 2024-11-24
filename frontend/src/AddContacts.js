import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AddContact = () => {
  // Define the state variables inside the component
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file); // Set the selected image file
    setPreview(URL.createObjectURL(file)); // Set preview of the selected image
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    // Call function to send data to backend
    addOneContact();

    // Reset form fields after submission
    setContactName('');
    setPhoneNumber('');
    setMessage('');
    setImage(null);
    setPreview(null);
  };

  // Function to send the contact data to the backend
  const addOneContact = async () => {
    try {
      // Create a FormData object to hold the form data and image
      const formData = new FormData();
      formData.append("contact_name", contactName);
      formData.append("phone_number", phoneNumber);
      formData.append("message", message);
      formData.append("image", image); // Add image to formData

      // Send FormData to the backend (you should use your own API endpoint here)
      const response = await fetch("http://localhost:8081/contact", {
        method: "POST",
        body: formData, // Fetch will automatically handle the content type for FormData
      });

      if (!response.ok) {
        // Handle errors if the request fails
        const errorData = await response.json(); // Parse JSON error response
        alert("Error: " + errorData.error);
      } else {
        // Handle success (status code 201)
        const successMessage = await response.text(); // Plain text response
        alert(successMessage);
      }
    } catch (err) {
      alert("An error occurred: " + err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Add New Contact</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Contact Name</label>
          <input
            type="text"
            className="form-control"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)} // Update state on input change
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)} // Update state on input change
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)} // Update state on input change
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange} // Trigger image change
          />
          {preview && (
            <img
              src={preview} // Display the preview image if available
              alt="Preview"
              className="mt-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Add Contact
        </button>
      </form>
    </div>
  );
};

export default AddContact;
