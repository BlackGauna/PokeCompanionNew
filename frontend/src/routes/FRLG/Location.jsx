import React, { useCallback, useEffect, useState } from 'react'
import { Container, Button, Table as RTable } from 'react-bootstrap'
import { useParams } from 'react-router'
import Table from "../../components/Table.jsx"
import axios from '../../api.jsx'
import styled from 'styled-components'

import Icon from '../../assets/FRLG/svg/viridian-forest.jsx'

import '../../styles/location.css'
import '../../styles/svg.css'
import DexEntryModal from '../PokemonModal.jsx'

import encounterStyle from '../../styles/encounterTable.module.css'

const folderPath = '/images/FRLG/'
let location

// has to be outside of FRLGLocation apparently, or else warning is shown in browser console
// TODO: look for alternative implementation, eg. in its own component/file
const TableStyle = styled.div`
  td,
  thead {
    width: auto;
    text-align: center;
    vertical-align: middle;
    font-size: medium;
    line-height: 0.5em !important;
  }

  td {
    padding:0.1em;
    padding-left: 0.5em;
  }

  .pokemonCol {
    min-width:160px;
    max-width:250px;
    display:flex;
  }
  `
/* TODO: need to reimplement everything in here, because state is kinda fucked up.
          Especially the useCallback inside PokemonButton seems fishy */
function FRLGLocation() {
  const [imagePath, setImagePath] = useState('')
  const [areasData, setAreasData] = useState([])
  const [tableData, setTableData] = useState([])

  const [pokemonModal, setPokemonModal] = useState({})

  // loading mode, so that site renders when finished loading data
  const [isLoading, setLoading] = useState(true)


  // state variable and function to toggle modal
  const [showModal, setShowModal] = useState(false)
  const toggleShowModal = (data) => {
    setShowModal(!showModal)
    setPokemonModal(data ? data : {})
    console.log("toggle")
  }
  useEffect(() => {
    console.log("showmodal: " + showModal)
  }, [showModal])

  useEffect(() => {

    console.log("tableData: ")
    console.log(tableData)

  }, [tableData])

  // when pokemon is updated, i.e. button is clicked
  useEffect(() => {

  }, [pokemonModal])


  //param.id is name in pokeapi and filename of image
  let param = useParams()

  // test conditional loading of svg component
  // TODO: make for all locations
  if (param.id === "viridian-forest") {
    location = <Icon style={{ width: "100%" }}></Icon>
  } else {
    location = <img style={{ width: "100%" }} src={imagePath} alt="location" ></img>
  }

  // main entry point, get location data
  useEffect(() => {
    console.log(encounterStyle.encounterCell)
    // setup AbortController to cancel an axios call, e.g. when called twice by react strict mode
    // but react strict mode is still at least beginning call
    const abortController = new AbortController()
    const abortSignal = abortController.signal

    console.log("Loading data...")

    if (param.id === null) {
      console.error("Location not found!")
    } else {
      setImagePath(folderPath + param.id + ".png")

      // get info for area from backend/api
      axios.get('/api/location/' + param.id, { signal: abortSignal })
        .then((res) => {
          setAreasData(res.data)

          console.log("res.data: ")
          console.log(res.data)
        })
        .catch(err => {
          // Check if the error is due to an aborted request
          if (abortController.signal.aborted) {
            console.log('Multiple requests aborted, likely because of React Strict Mode:', err.message)
          } else {

            console.log(err)
          }
        })
        .finally(setLoading(false))

    }

    // cleanup routine for hook
    return () => {
      abortController.abort()
    }
  }, [])

  // do work on areasData and fill tableArray for presentation in a react-table
  useEffect(() => {

    const pokemonEncounters = areasData.pokemonEncounters

    if (pokemonEncounters != null) {
      // console.log(pokemonEncounters);

      areasData.pokemonEncounters.forEach(pokemon => {
        // let name = getNameinLang(pokemon.names, "en", pokemon.pokemon)
        // let id = pokemon.species.id

        setupTableElements(pokemon.encounters, pokemon.species)
      })
    }
  }, [areasData])

  // get name from names array in specified language(as language code e.g. "en")
  // optional fallbackName param for "name" value if no real name is found in array
  const getNameinLang = (namesArray, langCode, fallbackName = "") => {
    let name = fallbackName
    if (namesArray) {
      namesArray.forEach(nameElement => {
        if (nameElement.language.name === langCode) {
          name = nameElement.name
        }
      })
    }
    return name
  }


  const setupTableElements = (encountersArray, species) => {
    encountersArray.forEach(detail => {

      let methodName = getNameinLang(detail.method.names, "en", detail.method.name)

      // if level is a range construct string accordingly
      let levelRange = detail.min_level
      if (detail.max_level !== detail.min_level) {
        levelRange = detail.min_level + "-" + detail.max_level
      }

      let tableElement = {
        pokemon: species,
        level: levelRange,
        method: methodName,
        rate: detail.chance,
        versions: detail.versions,
      }

      setTableData(oldTable => [...oldTable, tableElement])

    })

  }


  // custom button which handles setting the state, otherwise no access to states
  const PokemonButton = ({ data }) => {
    const onClick = useCallback(() => {

      // if same pokemon is clicked, state will not update, so manually toggle modal
      // if (pokemonModal === data) {
      //   toggleShowModal()
      // } else {
      //   setPokemonModal(data)

      toggleShowModal(data)

    }, [pokemonModal, data, setPokemonModal, toggleShowModal])

    return (
      <Button className='linkButton' onClick={onClick}>{data.names.en}</Button>
    )
  }

  // Table columns for react-table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Encounter info',
        columns: [
          {
            Header: 'id',
            accessor: 'pokemon.id',
            show: false
          },
          {
            Header: 'Pokémon',
            id: 'pokemon',
            accessor: data => (
              <div style={{ display: "table-cell", textAlign: "left", whiteSpace: "nowrap", }}>
                <img className="pokemonIcon" alt='icon' src={"/images/pokemon/" + data.pokemon?.id + ".png"} />
                <PokemonButton data={data.pokemon} />
              </div>
            ),
            className: 'pokemonCol'
          },
          {
            Header: 'Level',
            accessor: 'level'
          },
          {
            Header: 'Method',
            accessor: 'method',
            sortType: (rowA, rowB) => sortbyMethod(rowA, rowB)
          },
          {
            Header: 'Rate',
            accessor: 'rate',
            Cell: props => <div>{props.value} %</div>
          }
        ]
      },
      {
        Header: 'Games',
        columns: [
          {
            Header: 'FR',
            accessor: 'versions[0]',
            style: { backgroundColor: " #fb8c00 " },
            className: 'gameVersion'
          },
          {
            Header: 'LG',
            accessor: 'versions[1]',
            style: { backgroundColor: "lawngreen" },
            className: 'gameVersion'
          }
        ]
      }
    ],
    []
  )

  const sortbyMethod = (rowA, rowB) => {
    const methodArray = ['gift', 'walk', 'surf',
      'old-rod', 'Old Rod',
      'good-rod', 'Good Rod',
      'super-rod', 'Super Rod']

    const aIndex = methodArray.indexOf(rowA.original.method)
    const bIndex = methodArray.indexOf(rowB.original.method)
    if (aIndex > bIndex) {
      return 1
    } else {
      return -1
    }


  }

  // create initialState with sorting method for react-table
  let initialState = {}
  initialState.sortBy = React.useMemo(
    () => [

      {
        id: 'method',
      },
      {
        id: 'id'
      }
    ], []
  )

  // hide columns used only for sorting
  initialState.hiddenColumns = React.useMemo(
    () => [
      "pokemon.id"
    ], []
  )



  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  } else {
    return (
      <Container className="locationContainer borderless" >

        <RTable borderless style={{ tableLayout: "fixed", marginBottom: "0rem" }}>
          <tbody>
            <tr style={{ verticalAlign: "top" }}>
              <td className={encounterStyle.encounterCell} style={{ width: "50%" }} >
                {location}
              </td>
              <td className={encounterStyle.encounterCell} style={{ width: "50%" }}>
                <TableStyle>
                  <Table columns={columns} data={tableData} initialState={initialState} />
                </TableStyle>
              </td>
            </tr>
          </tbody>
        </RTable>


        {/* <Row>
          <Col xs={5}>
            {location}
          </Col>
  
          <Col>
            <TableStyle>
              <Table columns={columns} data={tableData} initialState={initialState} />
            </TableStyle>
          </Col>
        </Row> */}


        <DexEntryModal pokemonData={pokemonModal} show={showModal} toggleShow={toggleShowModal} />
      </Container>

    )
  }




}



export default FRLGLocation