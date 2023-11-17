import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// import App from './App.jsx'
import PokeList from './routes/PokeList.jsx'
import AppNavBar from './routes/AppNavBar.jsx'
import FRLGMap from './routes/FRLG/Map.jsx'
import FRLGLocation from './routes/FRLG/Location.jsx'

import './index.css'

const router = createBrowserRouter([
  {
    path: "/", element: <AppNavBar />,
    children: [
      {
        path: "/", element: <PokeList />
      },
      {
        path: "/FRLG/map", element: <FRLGMap />
      },
      {
        path: "/FRLG/map/:id", element: <FRLGLocation />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
