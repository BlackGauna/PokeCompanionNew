import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// import App from './App.jsx'
import PokeList from './routes/PokeList.jsx'
import AppNavBar from './routes/AppNavBar.jsx'
import FRLGMap from './routes/FRLG/Map.jsx'
import FRLGLocation from './routes/FRLG/Location.jsx'
import EvolutionChain from './components/EvolutionChain.jsx'

import './index.css'
import Pokedex from './routes/Pokedex.jsx'

const router = createBrowserRouter([
  {
    path: "/", element: <AppNavBar />,
    children: [
      {
        path: "/", element: <PokeList />
      },
      {
        path: "/pokedex", element: <Pokedex />
      },
      {
        path: "/FRLG/map", element: <FRLGMap />
      },
      {
        path: "/FRLG/map/:id", element: <FRLGLocation />
      },
      {
        path: "/test", element: <EvolutionChain />
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
