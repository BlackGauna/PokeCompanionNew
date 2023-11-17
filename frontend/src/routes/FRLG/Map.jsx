import React, { } from 'react'
import { Container } from 'react-bootstrap'

import Map from './map.svg?react'
import '../../styles/svg.css'
import '../../styles/Map.css'

function FRLGMap() {


  return (
    <Container>
      <div className='MapContainer'>
        <Map className="Map" ></Map>
      </div>
    </Container>
  )


}

export default FRLGMap