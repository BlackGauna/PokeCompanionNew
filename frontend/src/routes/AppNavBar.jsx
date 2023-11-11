import React, { Component } from "react"
import {
  Navbar,
  Nav,
  Container,
  NavDropdown

} from 'react-bootstrap'
import { Outlet } from 'react-router-dom';

class AppNavBar extends Component {
  state = {
    isOpen: false

  }

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark" expand="md" className="mb-5">
        <Container>
          <Navbar.Brand href="/">Pokémon Companion</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse >
            <Nav className="container-fluid" >
              <NavDropdown title="Games">
                <NavDropdown.Item href="/FRLG/map">FireRed/LeafGreen</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link className="ms-auto" href="https://github.com/BlackGauna">GitHub</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet/>
      </div>
    )

  }

}



export default AppNavBar