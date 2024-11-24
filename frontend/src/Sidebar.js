import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <nav>
      <ul className="list-unstyled">
        <li className="mb-3">
          <Link to="/" className="text-white text-decoration-none">
            Home
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/contact" className="text-white text-decoration-none">
            Contacts
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/add-contact" className="text-white text-decoration-none">
            Add Contact
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/deletecontact" className="text-white text-decoration-none">
            Delete Contact
          </Link>
        </li>
        <li className="mb-3">
          <Link to="/searchContacts" className="text-white text-decoration-none">
            Search Contacts
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
