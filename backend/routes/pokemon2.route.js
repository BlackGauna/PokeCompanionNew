import { Router } from 'express'
const router = Router()

import PokeApi from 'pokedex-promise-v2'
import { Pokemon } from '../models/Pokemon.js'

const options = {
  cacheLimit: 1 * 1000,
  timeout: 5 * 1000
}
var Pokedex = new PokeApi(options)

// IS only for FRLG pokemon (moves, etc. are filtered for FRLG)

router.delete('/:id(\\d+)', async (req, res) => {
  const id = req.params.id
  console.log(`Deleting pokemon with id: ${id}`)

  // Pokemon.deleteMany({}).then()

  try {
    const deletedPokemon = await Pokemon.deleteOne({ id: id })
    res.send(`Deleted pokemon with id #${id}`)
  } catch (error) {
    console.log(`Could not delete pokemon with id #${id}`)
    console.error(error)
  }

})

// @route GET pokemon
// @desc Get pokemon from DB or add to DB from pokeAPI
router.get('/:id(\\d+)', (req, res) => {
  const id = req.params.id
  console.log(`Route for getting pokemon by id with id: ${id}`)

  // Pokemon.deleteMany({}).then()

  getPokemon(id).then((pokemon) => {
    res.send(pokemon)
  })

})

router.get('/:name(\\w+)', async (req, res) => {
  const name = req.params.name
  console.log(`Route for getting pokemon by name with name: ${name}`)

  // Pokemon.deleteMany({}).then()

  const pokemon = await getPokemonByName(name)
  res.send(pokemon)

})

// get a pokemon from DB or call the API and save new entry
const getPokemon = async (id) => {
  console.log("start getting pokemon with id " + id)

  try {
    const pokemon = await Pokemon.findOne({ id: id })
    // .populate('evolves_to.pokemon')

    // console.log(pokemon)

    if (pokemon != null) {
      console.log(`Pokemon #${id}: ${pokemon.name} found in DB!`)
      return pokemon
    } else {
      console.log(`id #${id} not found in DB, getting from pokeAPI...`)


      const newPokemon = getOnce(getNewPokemon)

      return await newPokemon(id)

    }


  } catch (error) {
    console.error(error)

  }
}
// wrapper to only call getNewPokemon once
// but usefulness is not clear
// was used to restrict double invocation by react strict mode, but did not help
function getOnce(callback) {
  const processedIds = new Set()

  const locks = new Map()

  return async function (id) {
    if (!processedIds.has(id)) {
      if (!locks.has(id)) {
        locks.set(id, true)
        processedIds.add(id)

        try {
          const newPokemon = await callback(id)
          return newPokemon

        } catch (error) {
          console.error(error)
        } finally {
          locks.delete(id)
        }
      } else {
        console.log(`Pokemon #${id} is already being processed.`)
      }


    } else {
      console.log(`Pokemon #${id} has already been processed!`)
    }
  }

}


async function getNewPokemon(id) {
  try {
    let searchPokemon = await Pokedex.getPokemonByName(id)
    let searchPokemonSpecies = await Pokedex.getPokemonSpeciesByName(searchPokemon.name)

    let newPokemon = await trimPokemonData(searchPokemon, searchPokemonSpecies)

    let newPokemonDB = new Pokemon(newPokemon)

    await newPokemonDB.save()

    return newPokemonDB

  } catch (error) {
    console.error(error)
  }
}

const getPokemonByName = async (name) => {
  console.log("start getting pokemon with name " + name)

  try {
    const pokemon = await Pokemon.findOne({ name: name })
    // .populate('evolves_to.pokemon')

    if (pokemon != null) {
      console.log(`Pokemon ${pokemon.name} found in DB!`)
      return pokemon
    } else {
      console.log(`Pokemon #${name} not found in DB, getting from pokeAPI...`)

      const newPokemon = getOnce(getNewPokemonByName)

      return await newPokemon(name)

    }

  } catch (error) {
    console.error(error)
  }
}

const getNewPokemonByName = async (name) => {
  try {
    console.log(`start getting pokemon with name ${name} from pokeAPI`)
    let searchPokemon = await Pokedex.getPokemonByName(name)
    let searchPokemonSpecies = await Pokedex.getPokemonSpeciesByName(searchPokemon.name)

    let newPokemon = await trimPokemonData(searchPokemon, searchPokemonSpecies)

    let newPokemonDB = new Pokemon(newPokemon)

    await newPokemonDB.save()

    return newPokemonDB

  } catch (error) {
    console.log(`Pokemon ${name} not found`)
    console.error(error)
  }
}

// Returns a Promise that resolves after "ms" Milliseconds
// TODO: need to rewrite if needed, because trimPokemonData function has changed to return promise without saving to DB
const timer = ms => new Promise(res => setTimeout(res, ms))

async function loadAll(res) { // We need to wrap the loop into an async function for this to work
  for (let index = 1; index < 151; index++) {

    Pokedex.getPokemonByName(index).then((pokemonData) => {
      Pokedex.getPokemonSpeciesByName(pokemonData.name).then((speciesData) => {
        trimPokemonData(pokemonData, speciesData)
      })
    })
    await timer(3000)
  }
}

router.post('/all', (req, res) => {
  // Pokemon.deleteMany({}).then()

  loadAll(res)

})

const trimPokemonData = async (pokemonData, speciesData) => {
  // console.log(pokemonData);
  let pokemon = {}

  // set ordinary info
  pokemon.name = pokemonData.name
  pokemon.id = pokemonData.id
  pokemon.sprite = pokemonData.sprites.front_default

  // trim abilities
  let abilities = []
  pokemonData.abilities.forEach(abilityElement => {
    let ability = {}
    ability.name = abilityElement.ability.name
    ability.url = abilityElement.ability.url
    ability.is_hidden = abilityElement.is_hidden
    ability.slot = abilityElement.slot
    abilities.push(ability)
  })

  delete pokemonData.abilities

  // trim held_items
  let held_items = []
  pokemonData.held_items.forEach(itemElement => {
    let item = {}
    item.name = itemElement.item.name
    item.url = itemElement.item.url
    item.version_details = []

    itemElement.version_details.forEach(versionElement => {
      let version = {}
      version.rarity = versionElement.rarity
      version.name = versionElement.version.name
      version.url = versionElement.version.url
      item.version_details.push(version)
    })
    held_items.push(item)
  })
  delete pokemonData.held_items

  // trim moves
  // let rawMoves = []
  // pokemonData.moves.forEach(moveElement => {
  //   let move = {}
  //   move.name = moveElement.move.name
  //   move.version_group_details = []

  //   moveElement.version_group_details.forEach(groupElement => {
  //     let group_detail = {}
  //     group_detail.level_learned_at = groupElement.level_learned_at
  //     group_detail.move_learn_method = groupElement.move_learn_method.name
  //     group_detail.version_group = groupElement.version_group.name

  //     move.version_group_details.push(group_detail)
  //   })
  //   rawMoves.push(move)
  // })

  // delete pokemonData.moves

  // trim stats
  // TODO: add names field from stat's API page (maybe unneeded if hardcoded in frontend, as not dynamic it seems)
  let stats = []
  pokemonData.stats.forEach(statElement => {
    let stat = {}
    stat.name = statElement.stat.name
    stat.base_stat = statElement.base_stat
    stat.effort = statElement.effort
    stats.push(stat)
  })

  delete pokemonData.stats

  // trim types
  let types = []
  pokemonData.types.forEach(typeElement => {
    let type = {}
    type.name = typeElement.type.name
    types.push(type)
  })

  delete pokemonData.types



  // TODO: get additional resource from pokeAPI from urls in JSON and combine, or additional Schemas and populate()
  // e.g. species info for international names of pokemon, moves info, etc.

  // speciesData
  pokemon.capture_rate = speciesData.capture_rate
  pokemon.is_baby = speciesData.is_baby
  pokemon.is_legendary = speciesData.is_legendary
  pokemon.is_mythical = speciesData.is_mythical
  pokemon.hatch_counter = speciesData.hatch_counter
  pokemon.evolves_from = speciesData.evolves_from_species ? speciesData.evolves_from_species.name : null

  /* TODO: add evolves_to from evolution_chain API, with filtering for partially evolved pokemon
            and maybe also needed for evolves_from when second evolution or beyond to get previous evolution(s)*/

  // test for todo above
  let evolution_chain = await getEvolutions(speciesData.evolution_chain.url)

  let names = trimNames(speciesData.names)

  console.log(`get moves for ${pokemonData.name}`)
  // console.log(pokemonData)
  const moves = await newgetMoves(pokemonData.moves)
  pokemon = { abilities, moves, held_items, names, stats, types, evolution_chain, ...pokemon }
  // console.log(pokemon)

  return new Promise((resolve, reject) => {
    resolve(pokemon)
  })

}


const trimNames = (namesArray) => {
  let names = {}
  namesArray.forEach(nameElement => {
    names[nameElement.language.name] = nameElement.name
  })
  return names
}

/*
  Create new moves object, filtered by version-group

  moves{
    red-blue: [move]
    ...
    ruby-sapphire: [move]
    ...
  }
*/
const newgetMoves = async (movesArray) => {
  // console.log(movesArray)
  let moveByVersion = {}

  for (const rawMove of movesArray) {

    let moveName = rawMove.move.name
    let asyncMoveCall
    let moveInfo
    try {

      asyncMoveCall = Pokedex.getMoveByName(moveName) // get move info from pokeapi

    } catch (error) {
      console.log("Error getting move async")
    }



    const rawVersionGroup = rawMove.version_group_details
    for (const group of rawVersionGroup) {
      let move = {} // new move to be added to array/s
      move.name = moveName

      const groupId = parseInt(group.version_group.url.match(new RegExp("/(\\d+)"))[1])
      const groupName = group.version_group.name

      move.level_learned_at = group.level_learned_at
      if (move.name === "water-gun" && groupName === "firered-leafgreen") {
        console.log(`level ${move.level_learned_at}`)
      }
      move.moveLearnMethod = group.move_learn_method.name

      try {
        moveInfo = moveInfo || (await asyncMoveCall) // wait for api call to finish
        // write additional info to move object
        move.names = trimNames(moveInfo.names)
        move.accuracy = moveInfo.accuracy
        move.power = moveInfo.power
        move.type = moveInfo.type.name

        // check if there are past values
        for (const pastValue of moveInfo.past_values) {
          const targetGroupId = parseInt(pastValue.version_group.url.match(new RegExp("/(\\d+)"))[1])
          if (groupId < targetGroupId) {
            move.accuracy = pastValue.accuracy ?? move.accuracy
            move.power = pastValue.power ?? move.power
            move.type = pastValue.type?.name ?? move.type
            break // jump out of loop because the first found value should be the oldest one
          }
        }
      } catch (error) {
        console.log(`Error getting move info for ${move.name}`)
        console.error(error)
      }

      // if field not created yet, create empty array for version
      if (moveByVersion[groupName] === undefined) {
        moveByVersion[groupName] = {}
        moveByVersion[groupName].level_up = []
        moveByVersion[groupName].machine = []
        moveByVersion[groupName].other = []

      }

      // add move to array
      switch (move.moveLearnMethod) {
        case "level-up":
          moveByVersion[groupName].level_up.push(move)
          break
        case "machine":
          moveByVersion[groupName].machine.push(move)
          break
        default:
          moveByVersion[groupName].other.push(move)
          break
      }

      // moveByVersion[groupName].push(move)
    }
  }

  for (const versionMoves in moveByVersion) {
    if (Object.hasOwnProperty.call(moveByVersion, versionMoves)) {
      let movesArray = moveByVersion[versionMoves].level_up
      console.log(movesArray)
      // movesArray = Array.from(movesArray)
      movesArray = sortMovesByLevel(movesArray)
    }
  }

  return moveByVersion
}

const sortMovesByLevel = (movesArray) => {
  movesArray.sort((a, b) => {
    if (a.level_learned_at < b.level_learned_at) {
      return -1
    } else if (a.level_learned_at > b.level_learned_at) {
      return 1
    }

    return a.name.localeCompare(b.name)
  })

  return movesArray
}

/* TODO: update function to get all moves in separate fields for editions. 
        So that the pokedex is relatively general. But what about evolutions and types?*/
// get moves for FRLG in trimmed array
const getMoves = async (movesArray) => {
  let moves = {}
  let level_up = []
  let machine = []
  let other = []

  let promises = []

  movesArray.forEach(movesElement => {

    movesElement.version_group_details.forEach(groupElement => {
      if (groupElement.version_group == 'firered-leafgreen') {
        let move = {}

        // console.log(`Move ${movesElement.name} is in FRLG`)
        move.name = movesElement.name
        move.level_learned_at = groupElement.level_learned_at
        // move.move_learn_method = groupElement.move_learn_method

        // promises to get move info from api asynchronously
        promises.push(Pokedex.getMoveByName(move.name).then((res) => {
          move.power = res.power
          move.accuracy = res.accuracy
          move.type = res.type.name
          move.names = trimNames(res.names)

          switch (groupElement.move_learn_method) {
            case "level-up":
              level_up.push(move)
              break
            case "machine":
              machine.push(move)
              break
            default:
              other.push(move)
              break
          }
        }))


      }
    })
  })

  return new Promise((resolve, reject) => {
    // wait for all promises to finish
    Promise.allSettled(promises)
      .then(() => {
        Promise.allSettled(promises)
          .then(() => {
            level_up.sort(
              function (a, b) {
                return a.level_learned_at - b.level_learned_at
              }
            )
            moves.level_up = level_up
            moves.machine = machine
            moves.other = other
            // console.log(JSON.stringify(moves));
            resolve(moves)
          })
      })
  })

}


// get moves for FRLG in raw api result
// unfinished
const getMovesRaw = (movesArray) => {
  let moves = []

  movesArray.forEach(movesElement => {
    let move = {}

    movesElement.version_group_details.forEach(groupElement => {
      if (groupElement.version_group.name == 'firered-leafgreen') {
        console.log("Move in FRLG")
      }
    })
  })
}

// test implementation for getting evolutions of species
// TODO: rethink structure of array/object, and filter to evolves_from and evolves_to when appropriate
const getEvolutions = async (url) => {
  try {
    const evolutions = await Pokedex.getResource(url)
    return filterEvolutionChain(evolutions.chain)

  } catch (error) {
    console.log("Could not find evolution")
    console.error(error)
  }
}

const filterEvolutionChain = (evolutionChain) => {
  console.log("getting evolutions...")
  const baseEvolution = {
    name: evolutionChain.species.name,
    method: "base",
    trigger: null,
    evolves_to: []
  }
  if (evolutionChain.evolves_to === null) {
    return newEvoChain
  } else {

    evolutionChain.evolves_to.forEach(evolution => {
      const evolutionElement = recursiveEvoChain(evolution)
      baseEvolution.evolves_to.push(evolutionElement ? evolutionElement : null)
    })
  }

  return baseEvolution
}

// get all nested evolutions and append
const recursiveEvoChain = (chainElement) => {
  console.log("getting new (sub-)evolution")

  const evolution = {}

  evolution.name = chainElement.species.name
  console.log(`Pokemon evolves to ${evolution.name}`)

  // TODO: edit for multiple methods
  const details = chainElement.evolution_details[0]

  switch (details.trigger.name) {
    case "use-item":
      evolution.method = "use-item"
      evolution.trigger = details.name
      break

    case "level-up":
      evolution.method = "level-up"
      evolution.trigger = details.min_level
      break

    default:
      break
  }

  // if evolution also evolves, recursively get those as well
  if (chainElement.evolves_to !== null) {
    evolution.evolves_to = []
    chainElement.evolves_to.forEach(subChainElement => {
      const sub_evolves_to = recursiveEvoChain(subChainElement)
      evolution.evolves_to.push(sub_evolves_to ? sub_evolves_to : null)
    })
  }

  return evolution
}

// get pokemon with all names (pokemon, moves, types, etc.) filtered for one language
router.get("/:id/:lang", (req, res) => {

  // gets array of an object with names array only having the english entry
  // need to pass array[0], because always only one result
  // TODO: need to match id. Currently getting all pokemon in DB???
  const id = req.params.id
  const lang = req.params.lang
  // Pokemon
  //   .aggregate()
  //   .match({ id: parseInt(id) })
  //   .unwind("names")
  //   .match({ "names.language": { $in: [lang] } })
  //   .then((data) => {
  //     let filtered = JSON.parse(JSON.stringify(data[0]));
  //     getMoves(filtered.moves).then((moves) => {
  //       filtered.moves = moves
  //       res.send(filtered)
  //     })
  //     // res.send(data[0])
  //   })

  Pokemon.find({ id: id }).then((data) => {
    getMoves(filtered.moves).then((res) => {
      let filtered = JSON.parse(JSON.stringify(data))
      filtered.moves = res
      parentRes.send(filtered)
    })
    res.send(data)
  })
})


export default router
export { getPokemonByName }