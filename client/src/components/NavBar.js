import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar">
      <NavLink
      to="/"
      className="nav-link">
        Home
      </NavLink>
      <NavLink
      to="/clients"
      className="nav-link">
        Clients
      </NavLink>
      <NavLink
      to="/stylists"
      className="nav-link">
        Stylists
      </NavLink>
      <NavLink
      to="/appointments"
      className="nav-link">
        Appointments
      </NavLink>
    </nav>
  )
}

export default NavBar;