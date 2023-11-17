import { Schema, SchemaTypes, model } from 'mongoose'
// const Pokemon = require('./Pokemon')

// old
const details = new Schema({
  chance: Number,
  condition_values: SchemaTypes.Mixed,
  min_level: Number,
  max_level: Number,
  method: {
    name: String, url: String
  },
  versions: [String]
}, { _id: false })

const encounter_details = new Schema({
  // encounter_details: [details],
  chance: Number,
  condition_values: SchemaTypes.Mixed,
  min_level: Number,
  max_level: Number,
  method: {
    name: String, url: String
  },
  versions: [String] // versions[0] is for FR and versions[1] for LG
}, { _id: false })

const encounters = new Schema({
  encounter_details: [encounter_details],
  max_chance: Number
}, { _id: false })

const pokemonEncounters = new Schema({
  encounters: { type: SchemaTypes.Mixed },
  pokemon: String,
}, {
  _id: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})


const LocationSchema = new Schema({
  name: { type: String, unique: true },
  pokemonEncounters: [pokemonEncounters],

}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// virtual Population to get pokemon info from Pokemon collection when getting location
LocationSchema.virtual('pokemonEncounters.species', {
  ref: 'Pokemon',
  localField: 'pokemonEncounters.pokemon',
  foreignField: 'name',
  justOne: true
})


export const Location = model('Location', LocationSchema, 'LocationsFRLG')