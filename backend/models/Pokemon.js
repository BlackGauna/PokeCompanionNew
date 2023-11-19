import { Schema, SchemaTypes, model } from 'mongoose'

const AbilitySchema = new Schema({
  name: String,
  is_hidden: Boolean,
  slot: Number
}, { _id: false })

const PokemonSchema = new Schema({
  name: String,
  id: { type: Number, index: true, unique: true },
  names: SchemaTypes.Mixed,
  sprite: String,
  abilities: [AbilitySchema],
  held_items: [{
    _id: false,
    name: String,
    version_details: [{
      _id: false,
      rarity: Number,
      name: String,
    }]
  }],
  moves: {
    level_up: {},
    machine: {},
    other: {},
  },
  stats: [{
    _id: false,
    name: String,
    base_stat: Number,
    effort: Number
  }],
  types: [{
    _id: false,
    name: String
  }],
  capture_rate: Number,
  base_experience: Number,
  hatch_counter: Number,
  is_baby: Boolean,
  is_legendary: Boolean,
  is_mythical: Boolean,
  evolves_from: String,
  evolves_to: SchemaTypes.Mixed,



})

export const Pokemon = model('Pokemon', PokemonSchema, 'Pokemon')