import { Location } from '../models/LocationFRLG.js'
import { Router } from 'express'
const router = Router()

import pokemonRoute, { getPokemonByName } from './pokemon.route.js'

import Pokedex from 'pokedex-promise-v2'
const options = {
  cacheLimit: 1 * 1000
}
var pokedex = new Pokedex(options)

// location saved for backup if area has no name
let location = {}
let areaUrls = []
let areas = []

// TODO: reimplement routes and DB Schema of location for cleaner json, 
// unneeded layers in encounters removed. Other changes needed?

// @route GET pokemon
// @desc Test route
// TODO: add .catch blocks with send error status
router.get('/:id', (req, res) => {
  const id = req.params.id

  areaUrls = []
  areas = []

  // delete all documents in collection
  // for testing purposes
  // Location.deleteMany({}).then()

  // Pokemon.deleteMany({}).then()

  // get location from DB and populate pokemon info for encounters
  let locationTest = Location.findOne({ name: id })
    .populate('pokemonEncounters.species').then((location) => {
      if (location == null || location.length == 0) {
        console.log('Location response was empty...')
        getNewLocation(id, res)
      } else {
        res.send(location)
      }

    }).catch(err => {
      console.log(err)
    })



})

// get never before requested location info from pokeAPI and add to DB
const getNewLocation = (id, parentRes) => {
  // get location info and then push all area urls to array
  console.log('Creating new location DB entry...')

  pokedex.getLocationByName(id)
    .then(loc => {
      location = loc
      location.areas.forEach(area => {
        areaUrls.push(area.url)
        console.log(area.url)
      })
    })
    .then(() => {
      // then get json of all areas
      pokedex.resource(areaUrls)
        .then((area) => {
          areas = area

        })
        .then(() => {
          // then get encounters of all areas

          // console.log(JSON.stringify(areas[0]));

          // use only first location area for now, because encounters seem to be the same 
          getAreaEncounters(areas[0]).then((areasGot) => {
            // parentRes.send(areasGot[0])

            // send location data as JSON to mongoDB
            // areasGot[0] because result is an array for possible multiple areas in one location
            // TODO: change for locations with multiple areas, eg. caves
            var locationDB = new Location(areasGot[0])
            locationDB.save().then((location) => {
              location.populate('pokemonEncounters.species').then((final) => {
                parentRes.send(final)
              })
            })
          })

          // res.send(getAreaEncountersNew(areas[0]))
        })
    })
}

const getAreaEncounters = (area) => {

  // store results for each area in
  let encounters = []
  // array of all promises that are used to wait for them finishing at the end
  var promises = []

  let areaData = {}

  // if area has encounters
  if (area.pokemon_encounters) {

    // TODO: get specific language name, if available
    // areaData.name = getAreaNameinLang(area, "en")

    areaData.name = area.location.name

    // initialize array for this area
    areaData.pokemonEncounters = []

    // for each pokemon encounter in encounters
    area.pokemon_encounters.forEach(encounter => {
      // species name e.g. "bulbasaur"
      let species = encounter.pokemon.name

      // object holding infos for current species
      let poke = {}
      poke.encounters = []
      poke.pokemon = species

      encounter.version_details.forEach(detail => {
        // only get encounters for FRLG

        // safety check for previous results already in encounters array
        // when cached by pokedex api
        if ("version" in detail) {
          if (detail.version.name == "firered" || detail.version.name == "leafgreen") {

            poke.encounters.push(detail)

          }
        } else {
          poke.encounters.push(detail)
        }
      })
      if (poke.encounters.length != 0) {
        areaData.pokemonEncounters.push(poke)
      }

    })

    areaData.pokemonEncounters.forEach(pokemon => {

      combinePokemonEncounters(pokemon.encounters)
      if (pokemon.pokemon == "psyduck") {
        console.log(JSON.stringify(pokemon.encounters))
      }
      pokemon.encounters = combineVersionEncounters(pokemon.encounters)

      // if (pokemon.pokemon == "metapod") {
      //   console.log("metapod: ");
      //   console.log(JSON.stringify(pokemon));
      // }

      // Get pokemon info and save into DB
      promises.push(getPokemonByName(pokemon.pokemon).then(res => {

      }))
      // getMethodItem(areaData.areaEncounters[pokemon].encounters)
    })

    // only push areaData if there are any encounters
    if (Object.keys(areaData.pokemonEncounters).length != 0) {

      encounters.push(areaData)
    }
  }

  // return promise so that method can finish. Use .then when calling method!
  return new Promise((resolve, reject) => {
    // wait for all promises to finish
    Promise.allSettled(promises)
      .then(() => {
        resolve(encounters)
      })
  })

}


// get area name in specific language,
// if not available search location name and fall back on "name" variable
const getAreaNameinLang = (area, lang) => {
  let name = ""
  area.names.forEach(translation => {
    if (translation.language.name == lang) {
      name = translation.name
    }
  })

  if (name == "") {
    location.names.forEach(translation => {
      if (translation.language.name == lang) {
        name = translation.name
      }
    })
  }
  return name

}

// combine encounters of one pokemon and add up rates and level ranges
const combinePokemonEncounters = (encountersArray) => {

  encountersArray.forEach((versionEncounters, index) => {
    const encounterDetails = versionEncounters.encounter_details
    for (let encIndex = encounterDetails.length - 1; encIndex > 0; encIndex--) {
      const encounter = encounterDetails[encIndex]
      const compEncounter = encounterDetails[encIndex - 1]

      // check if values are the same, excluding chance and level, and summarize
      if (JSON.stringify(encounter.condition_values) == JSON.stringify(compEncounter.condition_values)
        && JSON.stringify(encounter.method) == JSON.stringify(compEncounter.method)
        && JSON.stringify(encounter?.versions) == JSON.stringify(compEncounter?.versions)) {

        // sum up encounter rates
        compEncounter.chance = parseInt(compEncounter.chance) + parseInt(encounter.chance)

        // set new min and max level
        if (parseInt(compEncounter.min_level) > parseInt(encounter.min_level)) {
          compEncounter.min_level = encounter.min_level
        }
        if (parseInt(compEncounter.max_level) < parseInt(encounter.max_level)) {
          compEncounter.max_level = encounter.max_level
        }

        // delete encounter, because all information is now in compEncounter
        encounterDetails.splice(encIndex, 1)
      }

    }
  })
}

// combines encounters available in both version into one encounter and adds versions key to encounter
const combineVersionEncounters = (encountersArray) => {
  // save changed details to newArray, so that eventual separate arrays for version exclusive encounters are combined
  let newArray = []

  // for each encounter detail in first version compare enc.-details in second version
  encountersArray.forEach((encounters, i) => {
    for (let index = encounters.encounter_details.length - 1; index >= 0; index--) {
      const encDetail = encounters.encounter_details[index]

      // safety check for results already in object (when cached by pokedex api)
      if ("version" in encounters) {
        // version handler key
        let versions = encDetail.versions?.length > 0 ? encDetail.versions : ["", ""]
        // add version to encounter
        if (encounters.version.name == 'firered') {
          versions[0] = 'FR'
        } else {
          versions[1] = 'LG'
        }

        // delete version object
        /* TODO: commented delete command out because of false data for some locations. 
        Seems to have fixed it, but further investigation may be needed*/

        // delete encounters.version

        // if encounters in multiple versions check second version encounters
        if (encountersArray[i + 1]) {
          for (let detailIndex = encountersArray[i + 1].encounter_details.length - 1; detailIndex >= 0; detailIndex--) {
            // if encounters are completely the same,
            // add info in first version and delete second
            const compDetail = encountersArray[i + 1].encounter_details[detailIndex]
            if (JSON.stringify(encDetail) == JSON.stringify(compDetail)) {
              if (encountersArray[i + 1].version.name == 'firered') {
                versions[0] = 'FR'
              } else {
                versions[1] = 'LG'
              }
              // delete encountersArray[i + 1].version
              encountersArray[i + 1].encounter_details.splice(detailIndex, 1)
            }

          }
        }
        encDetail.versions = versions
      }

      // get method item names.
      // Convenient here because we are already iterating through all filtered encounters
      getMethodItem(encDetail)
      newArray.push(encDetail)
    }

    // if all encounters in version are deleted, delete parent array
    if (encounters.encounter_details.length == 0) {
      encountersArray.splice(i, 1)
    }
  })

  return newArray
}

// get names of encounter method, if it is an item encounter e.g. good rod
const getMethodItem = async (encounterDetail) => {

  // wait until all promises resolve
  await new Promise(() => {
    // if method is an item, get item names array. Otherwise falls in catch block and ignore
    pokedex.getItemByName(encounterDetail.method.name)
      .then((item) => {
        encounterDetail.method["names"] = item.names
      })
      .catch(() => { })
  })

}


// filter moves from unrelated games. 
// shrink final json size greatly by upto 10x (from 2+MB to ~200KB in pallet town w/o extra pokemon info)
const filterMoves = (movesArray) => {
  // go through all moves
  for (let movesIndex = movesArray.length - 1; movesIndex >= 0; movesIndex--) {
    const movesElement = movesArray[movesIndex]

    // check all version details of move
    let versionGroups = movesElement.version_group_details
    for (let versionIndex = versionGroups.length - 1; versionIndex >= 0; versionIndex--) {
      const versionElement = versionGroups[versionIndex]

      // delete if detail if not from relevant games
      if (versionElement.version_group.name != "firered-leafgreen") {
        movesElement.version_group_details.splice(versionIndex, 1)
      }
    }

    // if move is not learnable in games, then delete move from array
    if (movesElement.version_group_details.length == 0) {
      movesArray.splice(movesIndex, 1)
    }
  }

  return movesArray
}

export default router