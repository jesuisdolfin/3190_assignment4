import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Contacts from "./Contacts.js";
import AddContact from "./AddContacts.js";
import DeleteContact from "./DeleteContacts.js";
import Sidebar from "./Sidebar.js";
import SearchContact from "./SearchContacts.js";

function App() {
  const [contacts, setContacts] = useState([]);

  return (
    <Router>
      <div className="d-flex vh-100">
        <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
          <Sidebar />
        </div>
        <div className="flex-grow-1 bg-light p-4">
          <div className="container">
            <header className="mb-4">
              <h1 className="text-center text-primary">Phone Contacts App</h1>
              <p className="text-center text-muted">
                Manage your contacts efficiently and effortlessly.
              </p>
            </header>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="text-center text-secondary">
                    Welcome to the Contacts App!
                  </div>
                }
              />
              <Route
                path="/contact"
                element={
                  <Contacts contacts={contacts} setContacts={setContacts} />
                }
              />
              <Route
                path="/add-contact"
                element={
                  <AddContact contacts={contacts} setContacts={setContacts} />
                }
              />
              <Route
                path="/deletecontact"
                element={
                  <DeleteContact contacts={contacts} setContacts={setContacts} />
                }
              />
              <Route
                path="/searchContacts"
                element={
                  <SearchContact contacts={contacts} setContacts={setContacts} />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
