/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import { Button, Container } from 'react-bootstrap'
import Table from "../components/Table.jsx"
import axios from '../api.jsx'
import DexEntryModal from './PokemonModal.jsx'


import 'bootstrap/dist/css/bootstrap.min.css'
import tableStyle from '../styles/table.module.css'
import '../styles/types.css'


// component for testing the api and getting pokemon in a table,
// with key infos like species name in different languages, stats, etc.
function PokeList() {

  const [pokemon, setPokemon] = useState([])
  const [tableData, setTableData] = useState([])
  // loading mode, so that site renders when finished loading data
  const [isLoading, setLoading] = useState(true)

  // state variable and function to toggle modal
  const [showModal, setShowModal] = useState(false)
  const toggleShowModal = () => {
    setShowModal(!showModal)
    console.log(tableData)
  }

  const [levelUpMoves, setLevelUpMoves] = useState([])
  const [machineMoves, setMachineMoves] = useState([])


  const hasBeenCalled = useRef(true)
  useEffect(() => {
    if (hasBeenCalled.current) {
      // get pokemon info
      axios.get('/api/pokemon/133')
        .then((res) => {
          setPokemon(res.data)
          setLoading(false) // set loading mode to false after getting data

        })
        .catch(err => { console.log(err) })

    } else {
      console.log(`axios.get has already been called!!!`)
    }
  }, [hasBeenCalled])

  useEffect(() => {
    return () => {
      hasBeenCalled.current = false
    }
  })

  // prepare pokemon table data
  useEffect(() => {
    if (Object.keys(pokemon).length != 0) {
      // pokemon != null && pokemon.id != null
      let image = (<img className={tableStyle.pokemonIcon}
        src={pokemon.sprite}
      />)

      // Setup types prototype
      let types = <span className={"typeText"}>Type: </span>
      pokemon.types.forEach(type => {
        types = <>{types}<span className={"type " + type.name}>{type.name}</span></>
      })


      const nameInLang = getNameinLang(pokemon.names, "en", pokemon.name)

      let tableElement = {
        image: image,
        id: pokemon.id,
        name: nameInLang,
        types: types
      }

      setLevelUpMoves(pokemon.moves.level_up)
      setMachineMoves(pokemon.moves.machine)

      console.log(pokemon)
      setTableData([tableElement])
    }
  }, [pokemon])


  // parse names field created in backend for current language
  // TODO: check site language, need to create site language changer
  const getNameinLang = (names, languageCode, fallback) => {
    let name = fallback
    name = fallback[0].toUpperCase() + fallback.slice(1)

    // names.forEach(namesElement => {
    //   if (namesElement.language === languageCode) {
    //     name = namesElement.name
    //   }
    // })

    if (names?.language === languageCode) {
      name = names?.name
    }

    return name
  }



  function MyButton({ click, }) {

    const handleOnClick = (() => {
      console.log(click)
    })
    return (
      (<Button className='linkButton' onClick={handleOnClick}>Test</Button>)
    )
  }

  // Table columns
  const columns = React.useMemo(
    () => [
      {
        Header: 'Sprite',
        accessor: 'image'
      },
      {
        Header: 'Name',
        id: 'name', // id needed when accessor is function. data is id='name' field
        accessor: data => <MyButton click={tableData} />,
      },
      // {
      //   Header: 'German',
      //   accessor: 'species.names[5].name'
      // }
    ],
    [tableData]
  )

  if (isLoading) {
    return <div></div>
  }

  return (

    <Container>
      <Button className='linkButton' onClick={toggleShowModal}>test</Button>
      {!tableData.length ? (<div>Loading...</div>) : (<Table columns={columns} data={tableData} />)}

      <DexEntryModal pokemonData={pokemon} show={showModal} toggleShow={toggleShowModal} />
    </Container >
  )
}

export default PokeList