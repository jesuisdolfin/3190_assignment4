import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const handleImageChange = (e) => {
  const file = e.target.files[0];
  setImage(file);
  setPreview(URL.createObjectURL(file)); // Show preview
};

const handleSubmit = (e) => {
    e.preventDefault();
    // Call this function to fetch backend with method POST
    addOneContact();
    // Clean hooks to start again
    setContactName('');
    setPhoneNumber('');
    setMessage('');
    setImage(null);
    setPreview(null);
};

const addOneContact = async () => {
    try {
    // Create a FormData object to hold the fields and the file
    const formData = new FormData();
    formData.append("contact_name", contactName);
    formData.append("phone_number", phoneNumber);
    formData.append("message", message);
    formData.append("image", image); // Add the file to the form data
    // Send the FormData object to the backend
    const response = await fetch("http://localhost:8081/contact", {
    method: "POST",
    body: formData, // No need to set Content-Type; fetch will handle it
    });
    if (!response.ok) {
    // Handle errors (status code 4xx or 5xx)
    const errorData = await response.json(); // Parse JSON error response
    alert("Error: " + errorData.error);
    } else {
    // Status code 201 indicates success
    const successMessage = await response.text(); // Handle plain text response
    alert(successMessage);
    }
    } catch (err) {
    alert("An error occurred :"+err)
    }
};

const AddContact = () => {
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
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
            onChange={(e) => setContactName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
          {preview && (
            <img
              src={preview}
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
