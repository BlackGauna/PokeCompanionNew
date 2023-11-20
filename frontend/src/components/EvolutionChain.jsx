import React, { useState, useEffect, useRef } from 'react'
import { Container } from 'react-bootstrap'
import axios from '../api'

function EvolutionChain({ pokemonData, showNewPokemon }) {

  // const [pokemonData, setPokemonData] = useState({})
  const [evolutionChain, setEvolutionChain] = useState({})
  const [evolutionHTML, setEvolutionHTML] = useState(<></>)
  const [pokemonInfoMap, setPokemonInfoMap] = useState(new Map())

  const hasBeenCalled = useRef(false)
  useEffect(() => {
    console.log(`hasbeencalled: ${hasBeenCalled.current}`)
    if (!hasBeenCalled.current) {
      setEvolutionChain(pokemonData.evolution_chain)
      buildEvolutions(pokemonData.evolution_chain)

      console.log(pokemonData)
    }

    hasBeenCalled.current = true


    return () => {
      setEvolutionChain({})
      setEvolutionHTML(<></>)
      setPokemonInfoMap(new Map())
      console.log("evo chain removed")
    }
  }, [])

  const buildEvolutions = async (evolutionChain) => {
    console.log("buildEvolutions has fired!")
    let evolutionHTML = <></>
    try {
      // console.log("getting evolution chain " + evolutionChain.name)
      const baseEvo = (await axios.get(`/api/pokemon/${evolutionChain.name}`)).data
      // console.log("baseEvo:")
      // console.log(baseEvo)

      setPokemonInfoMap(new Map(pokemonInfoMap.set(evolutionChain.name, baseEvo)))

      evolutionHTML = (
        <Container style={{ display: "flex", alignItems: "center" }}>
          <img style={{ width: "4rem" }} src={baseEvo.sprite}
            onClick={() => updateShownPokemon(baseEvo)} />
          {await getEvolutionsRecursive(evolutionChain.evolves_to)}
        </Container>
      )
    } catch (error) {
      console.log(`Error getting base evolution: ${evolutionChain.name}`)
    }

    setEvolutionHTML(evolutionHTML)
  }

  const getEvolutionsRecursive = async (chain) => {

    if (!chain || chain.length === 0) {
      return null
    }

    let evolutions = <></>

    for (const evolution of chain) {
      // console.log("Getting many evolutions")
      try {
        // console.log(`Getting info of evolution ${evolution.name}`)
        const nextEvolution = (await axios.get(`/api/pokemon/${evolution.name}`)).data
        setPokemonInfoMap(new Map(pokemonInfoMap.set(evolution.name, nextEvolution)))

        const evolutionElement = (
          <>
            {"-->"}
            < img style={{ width: "4rem" }} src={nextEvolution.sprite}
              onClick={() => updateShownPokemon(nextEvolution)} />
          </>
        )

        if (chain.length === 1) {
          evolutions = <>
            {evolutions.props.children}
            <table>
              <tbody>
                <tr>
                  <td>
                    {evolutionElement}
                  </td>
                </tr>
              </tbody>
            </table>
            {await getEvolutionsRecursive(evolution?.evolves_to)}
          </>
        } else {

          evolutions = (
            <>
              {evolutions.props.children}
              <tr>
                <td>
                  {evolutionElement}
                </td>
              </tr>
            </>
          )

        }

      } catch (error) {
        console.log("Error when trying to get evolution")
        console.error(error)
        return null
      }
    }

    if (chain.length === 1) {
      return evolutions
    } else {
      return (
        <table>
          <tbody>{evolutions}</tbody>
        </table>
      )
    }

  }

  const updateShownPokemon = (newPokemonData) => {
    showNewPokemon(newPokemonData)
    console.log("click")
  }

  return (
    <Container>
      {evolutionHTML}
    </Container>
  )
}



export default EvolutionChain