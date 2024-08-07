import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar">
      <NavLink
      to="/">
        Home
      </NavLink>
      <NavLink
      to="/clients">
        Clients
      </NavLink>
      <NavLink
      to="/stylists">
        Stylists
      </NavLink>
      <NavLink
      to="/appointments">
        Appointments
      </NavLink>
    </nav>
  )
}

export default NavBar;