/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Table as RTable, Modal, Container, Button } from 'react-bootstrap'
import Table from "./Table.jsx";

// import tableStyle from '../styles/table.module.css'
import '../styles/types.css'
import dexStyle from '../styles/dexEntry.module.css'

import styled from 'styled-components'


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

const DexEntryModal = (props) => {

  const [pokemonData, setPokemonData] = useState({})

  // loading mode, so that modal renders when finished loading data
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    console.log("drawing modal");
    setPokemonData(props.pokemonData)
    setLoading(false)
  }, [props.pokemonData])

  useEffect(() => {
    console.log("pokemonData");

    console.log(props.pokemonData);
  }, [pokemonData])

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
    let types = <span className={"typeText"}>Type: </span>
    typesArray?.forEach(type => {
      types = <>{types}<span className={"type " + type.name}>{type.name}</span></>
    })

    return types
  }

  // const reloadData = useCallback(() => {
  //   console.log("reloadData");
  //   setPokemonData(props.pokemonData)
  //   console.log(pokemonData);
  // }, [pokemonData])

  if (isLoading || Object.keys(pokemonData).length === 0) {
    return <div></div>
  }
  return (
    <Modal show={props.show} onHide={props.toggleShow}>
      <Modal.Header closeButton>
        <Modal.Title>#{pokemonData.id} - {pokemonData.names.en} </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <Container >
          <RTable className={dexStyle.dexTable} variant={"dark"}>
            <tbody>
              {/* general info of pokemon at the top */}
              <tr role={"row"} className={dexStyle.generalInfo}>
                <td variant="auto" role={'cell'} className={dexStyle.icon}>
                  {/* pokemon image */}
                  <img style={{ width: "100%" }} src={pokemonData.sprite} />
                </td>
                <td>
                  <RTable style={{ marginBottom: "0rem" }}>
                    <tr>
                      {/* pokemon number and name */}
                      <div className={dexStyle.info}>
                        #{pokemonData.id} {pokemonData.names.en}
                      </div>
                    </tr>
                    <tr>
                      {/* pokemon types */}
                      <div className={dexStyle.info}>
                        {buildPokemonTypesElement(pokemonData.types)}
                      </div>
                    </tr>
                    <tr>
                      {/* pokemon stats */}
                      <div className={dexStyle.info}>
                        Stats:
                      </div>
                      <RTable className={dexStyle.statsTable}>
                        <tr>
                          <td className={dexStyle.statName}><div>HP</div></td>
                          <td>
                            <div style={{ float: 'left', width: "100%" }}>
                              <div className={dexStyle.statsBar} style={{ backgroundColor: "red", width: calcStatBarLength(pokemonData.stats[0].base_stat) + "%" }}></div>
                              <div style={{ whiteSpace: "pre" }}>  {pokemonData.stats[0].base_stat}</div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className={dexStyle.statName}><div>Attack</div></td>
                          <td>
                            <div style={{ float: 'left', width: "100%" }}>
                              <div className={dexStyle.statsBar} style={{ backgroundColor: "orange", width: calcStatBarLength(pokemonData.stats[1].base_stat) + "%" }}></div>
                              <div style={{ whiteSpace: "pre" }}>  {pokemonData.stats[1].base_stat}</div>
                            </div>

                          </td>
                        </tr>
                        <tr>
                          <td className={dexStyle.statName}><div>Defense</div></td>
                          <td>
                            <div style={{ float: 'left', width: "100%" }}>
                              <div className={dexStyle.statsBar} style={{ backgroundColor: "gold", width: calcStatBarLength(pokemonData.stats[2].base_stat) + "%" }}></div>
                              <div style={{ whiteSpace: "pre" }}>  {pokemonData.stats[2].base_stat}</div>
                            </div>

                          </td>
                        </tr>
                        <tr>
                          <td className={dexStyle.statName}><div>Sp. Atk.</div></td>
                          <td>
                            <div style={{ float: 'left', width: "100%" }}>
                              <div className={dexStyle.statsBar} style={{ backgroundColor: "skyblue", width: calcStatBarLength(pokemonData.stats[3].base_stat) + "%" }}></div>
                              <div style={{ whiteSpace: "pre" }}>  {pokemonData.stats[3].base_stat}</div>
                            </div>

                          </td>
                        </tr>
                        <tr>
                          <td className={dexStyle.statName}><div>Sp. Def.</div></td>
                          <td>
                            <div style={{ float: 'left', width: "100%" }}>
                              <div className={dexStyle.statsBar} style={{ backgroundColor: "darkviolet", width: calcStatBarLength(pokemonData.stats[4].base_stat) + "%" }}></div>
                              <div style={{ whiteSpace: "pre" }}>  {pokemonData.stats[4].base_stat}</div>
                            </div>

                          </td>
                        </tr>
                        <tr>
                          <td className={dexStyle.statName}><div>Speed</div></td>
                          <td>
                            <div style={{ float: 'left', width: "100%" }}>
                              <div className={dexStyle.statsBar} style={{ backgroundColor: "green", width: calcStatBarLength(pokemonData.stats[5].base_stat) + "%" }}></div>
                              <div style={{ whiteSpace: "pre" }}>  {pokemonData.stats[5].base_stat}</div>
                            </div>

                          </td>
                        </tr>
                      </RTable>
                    </tr>
                  </RTable>
                </td>
              </tr>
            </tbody>
          </RTable>
          <RTable>
            <tr>
              {/* pokemon's moves divided in level up and machine tables */}
              <td style={{ verticalAlign: "top", width: "50%" }}>
                <Container className={dexStyle.attackTableContainer}>
                  <h6>Attacks by level-up:</h6>
                  <Style>
                    <Table columns={levelUpTable} data={pokemonData.moves.level_up} />
                  </Style>
                </Container>
              </td>
              <td style={{ verticalAlign: "top", width: "50%" }}>
                <Container className={dexStyle.attackTableContainer}>
                  <h6>Attacks by HM/TM:</h6>
                  <Style>
                    <Table columns={machineTable} data={pokemonData.moves.machine} />
                  </Style>
                </Container>

              </td>

            </tr>
          </RTable>
        </Container >

      </Modal.Body >
      <Modal.Footer>
        <Button variant='secondary' onClick={props.toggleShow}>Close</Button>
      </Modal.Footer>
    </Modal >
  )



}



export default DexEntryModal