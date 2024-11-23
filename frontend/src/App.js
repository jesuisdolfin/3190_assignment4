import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Contacts from "./Contacts.js";
import AddContact from "./AddContacts.js";

function App() {
  const [contacts, setContacts] = useState([]);

  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-3">
          <h1 className="text-center">Phone Contacts App</h1>
          <Routes>
            <Route path="/" element={<div>Welcome to the Contacts App!</div>} />
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;
