import React, { useState, useEffect, useRef } from 'react'
import { Container } from 'react-bootstrap'
import axios from '../api'

function EvolutionChain({ pokemonData }) {

  // const [pokemonData, setPokemonData] = useState({})
  const [evolutionChain, setEvolutionChain] = useState({})
  const [evolutionHTML, setEvolutionHTML] = useState(<></>)
  const [pokemonInfoMap, setPokemonInfoMap] = useState(new Map())


  // const pokemonData = {
  //   "moves": {
  //     "level_up": [
  //       {
  //         "name": "tail-whip",
  //         "level_learned_at": 1,
  //         "power": null,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "しっぽをふる",
  //           "ko": "꼬리흔들기",
  //           "zh-Hant": "搖尾巴",
  //           "fr": "Mimi-Queue",
  //           "de": "Rutenschlag",
  //           "es": "Látigo",
  //           "it": "Colpocoda",
  //           "en": "Tail Whip",
  //           "ja": "しっぽをふる",
  //           "zh-Hans": "摇尾巴"
  //         }
  //       },
  //       {
  //         "name": "tackle",
  //         "level_learned_at": 1,
  //         "power": 40,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "たいあたり",
  //           "ko": "몸통박치기",
  //           "zh-Hant": "撞擊",
  //           "fr": "Charge",
  //           "de": "Tackle",
  //           "es": "Placaje",
  //           "it": "Azione",
  //           "en": "Tackle",
  //           "ja": "たいあたり",
  //           "zh-Hans": "撞击"
  //         }
  //       },
  //       {
  //         "name": "helping-hand",
  //         "level_learned_at": 1,
  //         "power": null,
  //         "accuracy": null,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "てだすけ",
  //           "ko": "도우미",
  //           "zh-Hant": "幫助",
  //           "fr": "Coup d’Main",
  //           "de": "Rechte Hand",
  //           "es": "Refuerzo",
  //           "it": "Altruismo",
  //           "en": "Helping Hand",
  //           "ja": "てだすけ",
  //           "zh-Hans": "帮助"
  //         }
  //       },
  //       {
  //         "name": "sand-attack",
  //         "level_learned_at": 8,
  //         "power": null,
  //         "accuracy": 100,
  //         "type": "ground",
  //         "names": {
  //           "ja-Hrkt": "すなかけ",
  //           "ko": "모래뿌리기",
  //           "zh-Hant": "潑沙",
  //           "fr": "Jet de Sable",
  //           "de": "Sandwirbel",
  //           "es": "Ataque Arena",
  //           "it": "Turbosabbia",
  //           "en": "Sand Attack",
  //           "ja": "すなかけ",
  //           "zh-Hans": "泼沙"
  //         }
  //       },
  //       {
  //         "name": "growl",
  //         "level_learned_at": 16,
  //         "power": null,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "なきごえ",
  //           "ko": "울음소리",
  //           "zh-Hant": "叫聲",
  //           "fr": "Rugissement",
  //           "de": "Heuler",
  //           "es": "Gruñido",
  //           "it": "Ruggito",
  //           "en": "Growl",
  //           "ja": "なきごえ",
  //           "zh-Hans": "叫声"
  //         }
  //       },
  //       {
  //         "name": "quick-attack",
  //         "level_learned_at": 23,
  //         "power": 40,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "でんこうせっか",
  //           "ko": "전광석화",
  //           "zh-Hant": "電光一閃",
  //           "fr": "Vive-Attaque",
  //           "de": "Ruckzuckhieb",
  //           "es": "Ataque Rápido",
  //           "it": "Attacco Rapido",
  //           "en": "Quick Attack",
  //           "ja": "でんこうせっか",
  //           "zh-Hans": "电光一闪"
  //         }
  //       },
  //       {
  //         "name": "bite",
  //         "level_learned_at": 30,
  //         "power": 60,
  //         "accuracy": 100,
  //         "type": "dark",
  //         "names": {
  //           "ja-Hrkt": "かみつく",
  //           "ko": "물기",
  //           "zh-Hant": "咬住",
  //           "fr": "Morsure",
  //           "de": "Biss",
  //           "es": "Mordisco",
  //           "it": "Morso",
  //           "en": "Bite",
  //           "ja": "かみつく",
  //           "zh-Hans": "咬住"
  //         }
  //       },
  //       {
  //         "name": "baton-pass",
  //         "level_learned_at": 36,
  //         "power": null,
  //         "accuracy": null,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "バトンタッチ",
  //           "ko": "바톤터치",
  //           "zh-Hant": "接棒",
  //           "fr": "Relais",
  //           "de": "Stafette",
  //           "es": "Relevo",
  //           "it": "Staffetta",
  //           "en": "Baton Pass",
  //           "ja": "バトンタッチ",
  //           "zh-Hans": "接棒"
  //         }
  //       },
  //       {
  //         "name": "take-down",
  //         "level_learned_at": 42,
  //         "power": 90,
  //         "accuracy": 85,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "とっしん",
  //           "ko": "돌진",
  //           "zh-Hant": "猛撞",
  //           "fr": "Bélier",
  //           "de": "Bodycheck",
  //           "es": "Derribo",
  //           "it": "Riduttore",
  //           "en": "Take Down",
  //           "ja": "とっしん",
  //           "zh-Hans": "猛撞"
  //         }
  //       }
  //     ],
  //     "machine": [
  //       {
  //         "name": "toxic",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": 90,
  //         "type": "poison",
  //         "names": {
  //           "ja-Hrkt": "どくどく",
  //           "ko": "맹독",
  //           "zh-Hant": "劇毒",
  //           "fr": "Toxik",
  //           "de": "Toxin",
  //           "es": "Tóxico",
  //           "it": "Tossina",
  //           "en": "Toxic",
  //           "ja": "どくどく",
  //           "zh-Hans": "剧毒"
  //         }
  //       },
  //       {
  //         "name": "double-team",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": null,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "かげぶんしん",
  //           "ko": "그림자분신",
  //           "zh-Hant": "影子分身",
  //           "fr": "Reflet",
  //           "de": "Doppelteam",
  //           "es": "Doble Equipo",
  //           "it": "Doppioteam",
  //           "en": "Double Team",
  //           "ja": "かげぶんしん",
  //           "zh-Hans": "影子分身"
  //         }
  //       },
  //       {
  //         "name": "rest",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": null,
  //         "type": "psychic",
  //         "names": {
  //           "ja-Hrkt": "ねむる",
  //           "ko": "잠자기",
  //           "zh-Hant": "睡覺",
  //           "fr": "Repos",
  //           "de": "Erholung",
  //           "es": "Descanso",
  //           "it": "Riposo",
  //           "en": "Rest",
  //           "ja": "ねむる",
  //           "zh-Hans": "睡觉"
  //         }
  //       },
  //       {
  //         "name": "protect",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": null,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "まもる",
  //           "ko": "방어",
  //           "zh-Hant": "守住",
  //           "fr": "Abri",
  //           "de": "Schutzschild",
  //           "es": "Protección",
  //           "it": "Protezione",
  //           "en": "Protect",
  //           "ja": "まもる",
  //           "zh-Hans": "守住"
  //         }
  //       },
  //       {
  //         "name": "attract",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "メロメロ",
  //           "ko": "헤롱헤롱",
  //           "zh-Hant": "迷人",
  //           "fr": "Attraction",
  //           "de": "Anziehung",
  //           "es": "Atracción",
  //           "it": "Attrazione",
  //           "en": "Attract",
  //           "ja": "メロメロ",
  //           "zh-Hans": "迷人"
  //         }
  //       },
  //       {
  //         "name": "return",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "おんがえし",
  //           "ko": "은혜갚기",
  //           "zh-Hant": "報恩",
  //           "fr": "Retour",
  //           "de": "Rückkehr",
  //           "es": "Retribución",
  //           "it": "Ritorno",
  //           "en": "Return",
  //           "ja": "おんがえし",
  //           "zh-Hans": "报恩"
  //         }
  //       },
  //       {
  //         "name": "frustration",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "やつあたり",
  //           "ko": "화풀이",
  //           "zh-Hant": "遷怒",
  //           "fr": "Frustration",
  //           "de": "Frustration",
  //           "es": "Frustración",
  //           "it": "Frustrazione",
  //           "en": "Frustration",
  //           "ja": "やつあたり",
  //           "zh-Hans": "迁怒"
  //         }
  //       },
  //       {
  //         "name": "hidden-power",
  //         "level_learned_at": 0,
  //         "power": 60,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "めざめるパワー",
  //           "ko": "잠재파워",
  //           "zh-Hant": "覺醒力量",
  //           "fr": "Puissance Cachée",
  //           "de": "Kraftreserve",
  //           "es": "Poder Oculto",
  //           "it": "Introforza",
  //           "en": "Hidden Power",
  //           "ja": "めざめるパワー",
  //           "zh-Hans": "觉醒力量"
  //         }
  //       },
  //       {
  //         "name": "sunny-day",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": null,
  //         "type": "fire",
  //         "names": {
  //           "ja-Hrkt": "にほんばれ",
  //           "ko": "쾌청",
  //           "zh-Hant": "大晴天",
  //           "fr": "Zénith",
  //           "de": "Sonnentag",
  //           "es": "Día Soleado",
  //           "it": "Giornodisole",
  //           "en": "Sunny Day",
  //           "ja": "にほんばれ",
  //           "zh-Hans": "大晴天"
  //         }
  //       },
  //       {
  //         "name": "facade",
  //         "level_learned_at": 0,
  //         "power": 70,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "からげんき",
  //           "ko": "객기",
  //           "zh-Hant": "硬撐",
  //           "fr": "Façade",
  //           "de": "Fassade",
  //           "es": "Imagen",
  //           "it": "Facciata",
  //           "en": "Facade",
  //           "ja": "からげんき",
  //           "zh-Hans": "硬撑"
  //         }
  //       },
  //       {
  //         "name": "secret-power",
  //         "level_learned_at": 0,
  //         "power": 70,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "ひみつのちから",
  //           "ko": "비밀의힘",
  //           "zh-Hant": "秘密之力",
  //           "fr": "Force Cachée",
  //           "de": "Geheimpower",
  //           "es": "Daño Secreto",
  //           "it": "Forzasegreta",
  //           "en": "Secret Power",
  //           "ja": "ひみつのちから",
  //           "zh-Hans": "秘密之力"
  //         }
  //       },
  //       {
  //         "name": "dig",
  //         "level_learned_at": 0,
  //         "power": 80,
  //         "accuracy": 100,
  //         "type": "ground",
  //         "names": {
  //           "ja-Hrkt": "あなをほる",
  //           "ko": "구멍파기",
  //           "zh-Hant": "挖洞",
  //           "fr": "Tunnel",
  //           "de": "Schaufler",
  //           "es": "Excavar",
  //           "it": "Fossa",
  //           "en": "Dig",
  //           "ja": "あなをほる",
  //           "zh-Hans": "挖洞"
  //         }
  //       },
  //       {
  //         "name": "iron-tail",
  //         "level_learned_at": 0,
  //         "power": 100,
  //         "accuracy": 75,
  //         "type": "steel",
  //         "names": {
  //           "ja-Hrkt": "アイアンテール",
  //           "ko": "아이언테일",
  //           "zh-Hant": "鐵尾",
  //           "fr": "Queue de Fer",
  //           "de": "Eisenschweif",
  //           "es": "Cola Férrea",
  //           "it": "Codacciaio",
  //           "en": "Iron Tail",
  //           "ja": "アイアンテール",
  //           "zh-Hans": "铁尾"
  //         }
  //       },
  //       {
  //         "name": "shadow-ball",
  //         "level_learned_at": 0,
  //         "power": 80,
  //         "accuracy": 100,
  //         "type": "ghost",
  //         "names": {
  //           "ja-Hrkt": "シャドーボール",
  //           "ko": "섀도볼",
  //           "zh-Hant": "暗影球",
  //           "fr": "Ball’Ombre",
  //           "de": "Spukball",
  //           "es": "Bola Sombra",
  //           "it": "Palla Ombra",
  //           "en": "Shadow Ball",
  //           "ja": "シャドーボール",
  //           "zh-Hans": "暗影球"
  //         }
  //       },
  //       {
  //         "name": "rain-dance",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": null,
  //         "type": "water",
  //         "names": {
  //           "ja-Hrkt": "あまごい",
  //           "ko": "비바라기",
  //           "zh-Hant": "求雨",
  //           "fr": "Danse Pluie",
  //           "de": "Regentanz",
  //           "es": "Danza Lluvia",
  //           "it": "Pioggiadanza",
  //           "en": "Rain Dance",
  //           "ja": "あまごい",
  //           "zh-Hans": "求雨"
  //         }
  //       }
  //     ],
  //     "other": [
  //       {
  //         "name": "body-slam",
  //         "level_learned_at": 0,
  //         "power": 85,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "のしかかり",
  //           "ko": "누르기",
  //           "zh-Hant": "泰山壓頂",
  //           "fr": "Plaquage",
  //           "de": "Bodyslam",
  //           "es": "Golpe Cuerpo",
  //           "it": "Corposcontro",
  //           "en": "Body Slam",
  //           "ja": "のしかかり",
  //           "zh-Hans": "泰山压顶"
  //         }
  //       },
  //       {
  //         "name": "double-edge",
  //         "level_learned_at": 0,
  //         "power": 120,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "すてみタックル",
  //           "ko": "이판사판태클",
  //           "zh-Hant": "捨身衝撞",
  //           "fr": "Damoclès",
  //           "de": "Risikotackle",
  //           "es": "Doble Filo",
  //           "it": "Sdoppiatore",
  //           "en": "Double-Edge",
  //           "ja": "すてみタックル",
  //           "zh-Hans": "舍身冲撞"
  //         }
  //       },
  //       {
  //         "name": "mimic",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": null,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "ものまね",
  //           "ko": "흉내내기",
  //           "zh-Hant": "模仿",
  //           "fr": "Copie",
  //           "de": "Mimikry",
  //           "es": "Mimético",
  //           "it": "Mimica",
  //           "en": "Mimic",
  //           "ja": "ものまね",
  //           "zh-Hans": "模仿"
  //         }
  //       },
  //       {
  //         "name": "substitute",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": null,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "みがわり",
  //           "ko": "대타출동",
  //           "zh-Hant": "替身",
  //           "fr": "Clonage",
  //           "de": "Delegator",
  //           "es": "Sustituto",
  //           "it": "Sostituto",
  //           "en": "Substitute",
  //           "ja": "みがわり",
  //           "zh-Hans": "替身"
  //         }
  //       },
  //       {
  //         "name": "wish",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": null,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "ねがいごと",
  //           "ko": "희망사항",
  //           "zh-Hant": "祈願",
  //           "fr": "Vœu",
  //           "de": "Wunschtraum",
  //           "es": "Deseo",
  //           "it": "Desiderio",
  //           "en": "Wish",
  //           "ja": "ねがいごと",
  //           "zh-Hans": "祈愿"
  //         }
  //       },
  //       {
  //         "name": "tickle",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "くすぐる",
  //           "ko": "간지르기",
  //           "zh-Hant": "搔癢",
  //           "fr": "Chatouille",
  //           "de": "Spaßkanone",
  //           "es": "Cosquillas",
  //           "it": "Solletico",
  //           "en": "Tickle",
  //           "ja": "くすぐる",
  //           "zh-Hans": "挠痒"
  //         }
  //       },
  //       {
  //         "name": "charm",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": 100,
  //         "type": "fairy",
  //         "names": {
  //           "ja-Hrkt": "あまえる",
  //           "ko": "애교부리기",
  //           "zh-Hant": "撒嬌",
  //           "fr": "Charme",
  //           "de": "Charme",
  //           "es": "Encanto",
  //           "it": "Fascino",
  //           "en": "Charm",
  //           "ja": "あまえる",
  //           "zh-Hans": "撒娇"
  //         }
  //       },
  //       {
  //         "name": "flail",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": 100,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "じたばた",
  //           "ko": "바둥바둥",
  //           "zh-Hant": "抓狂",
  //           "fr": "Gigotage",
  //           "de": "Dreschflegel",
  //           "es": "Azote",
  //           "it": "Flagello",
  //           "en": "Flail",
  //           "ja": "じたばた",
  //           "zh-Hans": "抓狂"
  //         }
  //       },
  //       {
  //         "name": "endure",
  //         "level_learned_at": 0,
  //         "power": null,
  //         "accuracy": null,
  //         "type": "normal",
  //         "names": {
  //           "ja-Hrkt": "こらえる",
  //           "ko": "버티기",
  //           "zh-Hant": "挺住",
  //           "fr": "Ténacité",
  //           "de": "Ausdauer",
  //           "es": "Aguante",
  //           "it": "Resistenza",
  //           "en": "Endure",
  //           "ja": "こらえる",
  //           "zh-Hans": "挺住"
  //         }
  //       }
  //     ]
  //   },
  //   "_id": "655b501a65d7bd38a1e3ed4a",
  //   "name": "eevee",
  //   "id": 133,
  //   "names": {
  //     "ja-Hrkt": "イーブイ",
  //     "roomaji": "Eievui",
  //     "ko": "이브이",
  //     "zh-Hant": "伊布",
  //     "fr": "Évoli",
  //     "de": "Evoli",
  //     "es": "Eevee",
  //     "it": "Eevee",
  //     "en": "Eevee",
  //     "ja": "イーブイ",
  //     "zh-Hans": "伊布"
  //   },
  //   "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
  //   "abilities": [
  //     {
  //       "name": "run-away",
  //       "is_hidden": false,
  //       "slot": 1
  //     },
  //     {
  //       "name": "adaptability",
  //       "is_hidden": false,
  //       "slot": 2
  //     },
  //     {
  //       "name": "anticipation",
  //       "is_hidden": true,
  //       "slot": 3
  //     }
  //   ],
  //   "held_items": [],
  //   "stats": [
  //     {
  //       "name": "hp",
  //       "base_stat": 55,
  //       "effort": 0
  //     },
  //     {
  //       "name": "attack",
  //       "base_stat": 55,
  //       "effort": 0
  //     },
  //     {
  //       "name": "defense",
  //       "base_stat": 50,
  //       "effort": 0
  //     },
  //     {
  //       "name": "special-attack",
  //       "base_stat": 45,
  //       "effort": 0
  //     },
  //     {
  //       "name": "special-defense",
  //       "base_stat": 65,
  //       "effort": 1
  //     },
  //     {
  //       "name": "speed",
  //       "base_stat": 55,
  //       "effort": 0
  //     }
  //   ],
  //   "types": [
  //     {
  //       "name": "normal"
  //     }
  //   ],
  //   "capture_rate": 45,
  //   "hatch_counter": 35,
  //   "is_baby": false,
  //   "is_legendary": false,
  //   "is_mythical": false,
  //   "evolves_from": null,
  //   "evolution_chain": {
  //     "name": "eevee",
  //     "method": "base",
  //     "trigger": null,
  //     "_id": "655b501a65d7bd38a1e3ed4b",
  //     "evolves_to": [
  //       {
  //         "name": "vaporeon",
  //         "method": "use-item",
  //         "evolves_to": []
  //       },
  //       {
  //         "name": "jolteon",
  //         "method": "use-item",
  //         "evolves_to": []
  //       },
  //       {
  //         "name": "flareon",
  //         "method": "use-item",
  //         "evolves_to": []
  //       },
  //       {
  //         "name": "espeon",
  //         "method": "level-up",
  //         "trigger": null,
  //         "evolves_to": []
  //       },
  //       {
  //         "name": "umbreon",
  //         "method": "level-up",
  //         "trigger": null,
  //         "evolves_to": []
  //       },
  //       {
  //         "name": "leafeon",
  //         "method": "level-up",
  //         "trigger": null,
  //         "evolves_to": []
  //       },
  //       {
  //         "name": "glaceon",
  //         "method": "level-up",
  //         "trigger": null,
  //         "evolves_to": []
  //       },
  //       {
  //         "name": "sylveon",
  //         "method": "level-up",
  //         "trigger": null,
  //         "evolves_to": []
  //       }
  //     ]
  //   },
  //   "__v": 0
  // }

  const hasBeenCalled = useRef(true)
  useEffect(() => {
    if (hasBeenCalled.current) {
      setEvolutionChain(pokemonData.evolution_chain)
      buildEvolutions(pokemonData.evolution_chain)
    }

    return () => {
      setEvolutionChain({})
      setEvolutionHTML(<></>)
    }
  }, [hasBeenCalled])

  useEffect(() => {
    return () => {
      hasBeenCalled.current = false
    }
  }, [])

  useEffect(() => {
    console.log("pokemonInfoMap")
    console.log(pokemonInfoMap)

    return () => {

    }
  }, [pokemonInfoMap])


  const buildEvolutions = async (evolutionChain) => {
    let evolutionHTML = <></>
    try {
      console.log("getting evolution chain " + evolutionChain.name)
      const baseEvo = (await axios.get(`/api/pokemon/${evolutionChain.name}`)).data
      console.log("baseEvo:")
      console.log(baseEvo)

      setPokemonInfoMap(new Map(pokemonInfoMap.set(evolutionChain.name, baseEvo)))


      evolutionHTML = (
        <Container style={{ display: "flex", alignItems: "center" }}>
          <img style={{ width: "4rem" }} src={baseEvo.sprite} />
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
      console.log("Getting many evolutions")
      try {
        console.log(`Getting info of evolution ${evolution.name}`)
        const nextEvolution = (await axios.get(`/api/pokemon/${evolution.name}`)).data

        if (chain.length === 1) {
          evolutions = <>
            {evolutions.props.children}
            <table>
              <tbody>
                <tr>
                  <td>
                    {"-->"}
                    <img style={{ width: "4rem" }} src={nextEvolution.sprite} />
                  </td>
                </tr>
              </tbody>
            </table>
            {await getEvolutionsRecursive(evolution?.evolves_to)}
          </>
        } else {
          console.log("evolutions.props.children")
          console.log(evolutions.props.children)
          evolutions = (
            <>
              {evolutions.props.children}
              <tr>
                <td>
                  {"-->"}
                  <img style={{ width: "4rem" }} src={nextEvolution.sprite} />

                  {await getEvolutionsRecursive(evolution?.evolves_to)}
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

  return (
    <Container>
      {evolutionHTML}
    </Container>
  )
}



export default EvolutionChain