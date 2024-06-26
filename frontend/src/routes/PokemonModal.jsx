/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Table as RTable, Modal, Container, Button } from 'react-bootstrap'
import Table from "../components/Table.jsx"
import { isEmpty } from '../utils/Object.js'

// import tableStyle from '../styles/table.module.css'
import '../styles/types.css'
import dexStyle from '../styles/dexEntry.module.css'

import styled from 'styled-components'
import EvolutionChain from '../components/EvolutionChain.jsx'
// setup style for react-table with style-components
const Style = styled.div`
    
margin-left: 0rem;
padding: 0rem;

.level{
  width:1em;        
}
.move{
  width:5em;
}
.typeCol{
  width:2em;
  display:table-cell;
}
.power{
  width:1.5em;
  padding-left:1px;
  padding-right:1px;
}
.accuracy{
  width:1.5em;
}

td,th{
  line-height:1em;
  padding-left:1px;
  padding-right:1px;
}

table {
table-layout:fixed;
width:100%;
min-width:300px;

thead {
  tr{
    th {
      font-size: 0.85em;
      font-weight: normal;
      text-align:center;
      font-family:sans-serif;
      line-height:0.5em;
    }
  }
}

tr {
  background-color: transparent;
  td{
    background-color:inherit;
    font-size:0.8em;
    text-align:center;
  }
}
}


`

const DexEntryModal = ({ pokemon, show, toggleShow }) => {

  const [pokemonData, setPokemonData] = useState({})

  // loading mode, so that modal renders when finished loading data
  const [isLoading, setLoading] = useState(true)

  const [evolutions, setEvolutions] = useState([])

  useEffect(() => {
    // check if props not empty
    if (pokemon !== null & !isEmpty(pokemon)) {
      console.log("drawing modal")
      setPokemonData(pokemon)
      // buildEvolutions(props.pokemonData.evolution_chain)
      setLoading(false)
    }

    return () => {
      setPokemonData({})
      setLoading(true)
    }
  }, [pokemon])

  useEffect(() => {
    if (!isEmpty(pokemonData)) {
      console.log("pokemonData:")
      console.log(pokemon)
    }
  }, [pokemon])

  // columns for level-up moves in modal
  const levelUpTable = React.useMemo(() => [
    {
      Header: 'Lvl',
      id: 'level',
      accessor: 'level_learned_at',
      className: "level"
    },
    {
      Header: 'Move',
      accessor: 'names.en',
      className: "move"
    },
    {
      Header: 'Type',
      id: 'type',
      className: 'typeCol',
      accessor: move => (<span className={"type " + move.type}>{move.type}</span>)
    },
    {
      Header: 'Power',
      accessor: 'power',
      className: 'power',
    },
    {
      Header: 'Acc',
      accessor: 'accuracy',
      className: 'accuracy',
    }
  ])

  // columns for machine moves in modal
  const machineTable = React.useMemo(() => [
    {
      Header: 'Move',
      accessor: 'names.en',
      className: "move"
    },
    {
      Header: 'Type',
      id: 'type',
      className: 'typeCol',
      accessor: move => (<span className={"type " + move.type}>{move.type}</span>)
    },
    {
      Header: 'Power',
      accessor: 'power',
      className: 'power',
    },
    {
      Header: 'Acc',
      accessor: 'accuracy',
      className: 'accuracy',
    }
  ])


  const calcStatBarLength = (stat) => {
    return 1.25 * 50 / 255 * stat
    // return (1 / Math.sqrt(stat) + 0.2) * stat
  }

  // Setup types prototype
  const buildPokemonTypesElement = (typesArray) => {
    // let types = <span className={"typeText"}>Type: </span>
    let types = <span style={{ marginLeft: "0.5em" }}></span>
    typesArray?.forEach(type => {
      types = <>{types}<span className={"type " + type.name}>{type.name}</span></>
    })

    return types
  }

  const updatePokemonFromEvoChain = (pokemon) => {
    setPokemonData(pokemon)
  }

  if (isLoading || Object.keys(pokemonData).length === 0) {
    return <div></div>
  }
  return (
    <Modal show={show} onHide={() => { toggleShow({}) }}>
      <Modal.Header className={dexStyle.modalHeader} closeButton>
        <Modal.Title>#{pokemonData.id} - {pokemonData.names.en} </Modal.Title>
      </Modal.Header>
      <Modal.Body className={dexStyle.modalContent}>

        <Container >
          <RTable className={dexStyle.dexTable}>
            <tbody>
              {/* general info of pokemon at the top */}
              <tr role={"row"} className={dexStyle.generalInfo}>
                <td variant="auto" role={'cell'} className={`${dexStyle.icon} ${dexStyle.darkBackground}`}>
                  {/* pokemon image */}
                  <img style={{ width: "100%" }} src={"/images/pokemon/" + pokemonData.id + ".png"} />
                </td>
                <td className={dexStyle.darkBackground}>
                  <RTable style={{ marginBottom: "0rem" }}>
                    <tbody>
                      <tr>
                        <td className={dexStyle.darkBackground}>
                          {/* pokemon number and name */}
                          <div className={dexStyle.info}>
                            #{pokemonData.id} - {pokemonData.names.en}{buildPokemonTypesElement(pokemonData.types)}
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className={dexStyle.darkBackground} style={{ borderBottomWidth: "0px" }}>{/* remove ugly border */}
                          {/* pokemon stats */}
                          <div className={dexStyle.info}>
                            Stats:
                          </div>
                          <RTable className={dexStyle.statsTable + " borderless"}>
                            <tbody>
                              <tr >
                                <td className={`${dexStyle.statName} ${dexStyle.darkBackground}`}><div>HP</div></td>
                                <td className={dexStyle.darkBackground}>
                                  <div style={{ float: 'left', width: "100%" }}>
                                    <div className={dexStyle.statsBar} style={{ backgroundColor: "red", width: calcStatBarLength(pokemonData.stats[0].base_stat) + "%" }}></div>
                                    <div style={{ whiteSpace: "pre" }}>  {pokemonData.stats[0].base_stat}</div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className={`${dexStyle.statName} ${dexStyle.darkBackground}`}><div>Attack</div></td>
                                <td className={dexStyle.darkBackground}>
                                  <div style={{ float: 'left', width: "100%" }}>
                                    <div className={dexStyle.statsBar} style={{ backgroundColor: "orange", width: calcStatBarLength(pokemonData.stats[1].base_stat) + "%" }}></div>
                                    <div style={{ whiteSpace: "pre" }}>  {pokemonData.stats[1].base_stat}</div>
                                  </div>

                                </td>
                              </tr>
                              <tr>
                                <td className={`${dexStyle.statName} ${dexStyle.darkBackground}`}><div>Defense</div></td>
                                <td className={dexStyle.darkBackground}>
                                  <div style={{ float: 'left', width: "100%" }}>
                                    <div className={dexStyle.statsBar} style={{ backgroundColor: "gold", width: calcStatBarLength(pokemonData.stats[2].base_stat) + "%" }}></div>
                                    <div style={{ whiteSpace: "pre" }}>  {pokemonData.stats[2].base_stat}</div>
                                  </div>

                                </td>
                              </tr>
                              <tr>
                                <td className={`${dexStyle.statName} ${dexStyle.darkBackground}`}><div>Sp. Atk.</div></td>
                                <td className={dexStyle.darkBackground}>
                                  <div style={{ float: 'left', width: "100%" }}>
                                    <div className={dexStyle.statsBar} style={{ backgroundColor: "skyblue", width: calcStatBarLength(pokemonData.stats[3].base_stat) + "%" }}></div>
                                    <div style={{ whiteSpace: "pre" }}>  {pokemonData.stats[3].base_stat}</div>
                                  </div>

                                </td>
                              </tr>
                              <tr>
                                <td className={`${dexStyle.statName} ${dexStyle.darkBackground}`}><div>Sp. Def.</div></td>
                                <td className={dexStyle.darkBackground}>
                                  <div style={{ float: 'left', width: "100%" }}>
                                    <div className={dexStyle.statsBar} style={{ backgroundColor: "darkviolet", width: calcStatBarLength(pokemonData.stats[4].base_stat) + "%" }}></div>
                                    <div style={{ whiteSpace: "pre" }}>  {pokemonData.stats[4].base_stat}</div>
                                  </div>

                                </td>
                              </tr>
                              <tr>
                                <td className={`${dexStyle.statName} ${dexStyle.darkBackground}`}><div>Speed</div></td>
                                <td className={dexStyle.darkBackground}>
                                  <div style={{ float: 'left', width: "100%" }}>
                                    <div className={dexStyle.statsBar} style={{ backgroundColor: "green", width: calcStatBarLength(pokemonData.stats[5].base_stat) + "%" }}></div>
                                    <div style={{ whiteSpace: "pre" }}>  {pokemonData.stats[5].base_stat}</div>
                                  </div>

                                </td>
                              </tr>
                            </tbody>
                          </RTable>
                        </td>
                      </tr>
                    </tbody>
                  </RTable>
                </td>
              </tr>
            </tbody>
          </RTable>

          {/* Evolutions */}
          <Container>
            <span>Evolutions:</span>
            {pokemonData.name.length > 1 &&
              <EvolutionChain pokemonData={pokemonData} showNewPokemon={updatePokemonFromEvoChain} />
            }
          </Container>
          {/* Pokemon Moves */}
          <RTable className='gx-0 mb-0' borderless style={{ borderTop: "1rem" }}>
            <tbody className='gx-0'>
              <tr className='gx-0'>
                {/* pokemon's moves divided in level up and machine tables */}
                <td className={dexStyle.darkBackground} style={{ verticalAlign: "top", width: "50%" }}>
                  {/* gx-0 to  remove padding from added tbody and tr to table structure  */}
                  <Container className={'gx-0 ' + dexStyle.attackTableContainer}>
                    <h6>Attacks by level-up:</h6>
                    <Style>
                      <Table columns={levelUpTable} data={pokemonData.moves["firered-leafgreen"]?.level_up ?? []} />
                    </Style>
                  </Container>
                </td>
                <td className={dexStyle.darkBackground} style={{ verticalAlign: "top", width: "50%" }}>
                  <Container className={'gx-0 ' + dexStyle.attackTableContainer}>
                    <h6>Attacks by HM/TM:</h6>
                    <Style>
                      <Table columns={machineTable} data={pokemonData.moves["firered-leafgreen"]?.machine ?? []} />
                    </Style>
                  </Container>

                </td>

              </tr>
            </tbody>
          </RTable>
        </Container >

      </Modal.Body >
      <Modal.Footer className={dexStyle.modalHeader}>
        <Button variant='secondary' onClick={() => { toggleShow({}) }}>Close</Button>
      </Modal.Footer>
    </Modal >
  )



}



export default DexEntryModal