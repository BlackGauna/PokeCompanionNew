import React, { useState } from "react";
import { Modal, ModalTitle, ModalHeader } from "react-bootstrap";

import '../../../styles/svg.css'
function Icon() {

  const [showModal, setShowModal] = useState(false)

  /* TODO: create database entries for locations with already pulled info (encounters)
   and add array with trainer info. 
   Then fill modal with trainer info by id, when trainer is clicked*/

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  return (
    < >
      <svg
        style={{ width: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        viewBox="0 0 864 1104"
      >
        <g id="g8">
          <image
            id="image10"
            width="864"
            height="1104"
            preserveAspectRatio="none"
            xlinkHref="/images/FRLG/viridian-forest.png"
          ></image>
        </g>
        <path
          id="rick"
          d="M750.03 715.363H770.03V735.363H750.03z"
          onClick={toggleModal}
        ></path>
      </svg>

      <Modal show={showModal} onHide={toggleModal}>
        <ModalHeader closeButton>
          <ModalTitle>Test Modal</ModalTitle>
        </ModalHeader>
      </Modal>
    </>


  );
}

export default Icon;
