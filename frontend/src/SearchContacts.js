import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const SearchContact = ({ contacts, setContacts }) => {
  const [contactName, setContactName] = useState("");
  const [contactsQuery, setContactsQuery] = useState([]);
  const fetchContacts = async () => {
    if (!contactName.trim()) {
      alert("Please enter a contact name");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8081/contact/name?contact_name=${encodeURIComponent(
          contactName
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      setContactsQuery(data);
    } catch (err) {
      alert("There was an Error loading one contact " + err);
    }
  };
  return (
    <div className="container">
      <h2 className="text-center mt-4">Search Contact</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter contact name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value.toLowerCase())}
        />
        <button className="btn btn-primary" onClick={fetchContacts}>
          Search
        </button>
      </div>
      {/* List the result */}
      <ul className="list-group">
        {contactsQuery.map((contact) => (
          <li
            key={contact.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center">
              {contact.image_url && (
                <img
                  src={`http://localhost:8081${contact.image_url}`}
                  alt={contact.contact_name}
                  style={{
                    width: "50px",
                    height: "50px",
                    marginRight: "15px",
                    objectFit: "cover",
                  }}
                />
              )}
              <div>
                <strong>{contact.contact_name}</strong> - {contact.phone_number}
                <p>{contact.message}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default SearchContact;
