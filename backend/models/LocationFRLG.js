const mongoose = require('mongoose');
const Pokemon = require('./Pokemon');

// old
const details = new mongoose.Schema({
  chance: Number,
  condition_values: mongoose.SchemaTypes.Mixed,
  min_level: Number,
  max_level: Number,
  method: {
    name: String, url: String
  },
  versions: [String]
}, { _id: false })

const encounter_details = new mongoose.Schema({
  // encounter_details: [details],
  chance: Number,
  condition_values: mongoose.SchemaTypes.Mixed,
  min_level: Number,
  max_level: Number,
  method: {
    name: String, url: String
  },
  versions: [String] // versions[0] is for FR and versions[1] for LG
}, { _id: false })

const encounters = new mongoose.Schema({
  encounter_details: [encounter_details],
  max_chance: Number
}, { _id: false })

const pokemonEncounters = new mongoose.Schema({
  encounters: { type: mongoose.SchemaTypes.Mixed },
  pokemon: String,
}, {
  _id: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})


const LocationSchema = new mongoose.Schema({
  name: String,
  pokemonEncounters: [pokemonEncounters],

}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// virtual Population to get pokemon info from Pokemon collection
LocationSchema.virtual('pokemonEncounters.species', {
  ref: 'Pokemon',
  localField: 'pokemonEncounters.pokemon',
  foreignField: 'name',
  justOne: true
})


module.exports = Location = mongoose.model('Location', LocationSchema, 'LocationsFRLG')