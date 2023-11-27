import axios from '../api'
import React, { useEffect, useState } from 'react'
import { Container, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap'
import DexEntryModal from './PokemonModal'

function Pokedex() {

  const [pokemonList, setPokemonList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setpageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)

  // modal states
  const [modalPokemon, setModalPokemon] = useState({})
  const [showModal, setShowModal] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {

    // setup AbortController to cancel an axios call, e.g. when called twice by react strict mode
    // but react strict mode is still at least beginning call
    const abortController = new AbortController()
    fetchData(currentPage, pageSize, abortController)

    // cleanup routine for hook
    return () => {
      abortController.abort()
    }
  }, [currentPage])

  const fetchData = async (currentPage, pageSize, abort) => {
    console.log("Loading data...")

    // get pokedex paginated
    try {
      const response = await axios.get('/api/pokemon/all',
        {
          params: { page: currentPage, pageSize },
          signal: abort.signal,
        })

      console.log(response.data)
      setPokemonList(response.data.allPokemon)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      if (abort.signal.aborted) {
        console.log('Multiple requests aborted, likely because of React Strict Mode:', error.message)

      } else {
        console.log("#### Error getting all ####")
        console.log(error)
        console.log("#### Error getting all ####")
      }
    } finally {
      setIsLoading(false)
    }
  }


  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const showPokemon = (pokemon) => {
    setModalPokemon(pokemon)
    toggleModal()
  }

  return (
    <Container className='d-flex align-content-center'>
      {isLoading && <Spinner animation='border'></Spinner>}
      {!isLoading &&

        <ListGroup className='mx-auto justify-content-center'>

          {pokemonList.map((pokemon) => {
            let imgSrc = `/images/pokemon/${pokemon.id}.png`

            return (
              <ListGroupItem key={pokemon.id} variant='dark'
                onClick={() => showPokemon(pokemon)}>
                <img src={imgSrc ? imgSrc : pokemon.sprite} style={{ width: "2rem", marginRight: "1.0rem" }} />
                <span>{pokemon.name}</span>
              </ListGroupItem>
            )
          }
          )}


        </ListGroup>
      }

      <DexEntryModal pokemon={modalPokemon} show={showModal} toggleShow={() => { showPokemon({}) }} />

    </Container>
  )
}

export default Pokedex