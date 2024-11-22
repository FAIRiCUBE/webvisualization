import { createSignal } from 'solid-js'
import './App.css'
import {buildMap} from './components/Map.js'
import STACTreeView from './components/STACTreeView.jsx'


function App() {

  buildMap();

  return (
    <>

      <h1>FAIRiCUBE Visualization Service</h1>


      <div id="map-container"/>

      <div class="stactreeview">
        <STACTreeView />
      </div>

    </>
  )
}

export default App
