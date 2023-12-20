import { useState } from 'react'
import './App.css'
import ThreeCanvas from './ThreeCanvas'

function App() {

  const [models, setModels] = useState([]); 

  const [showF, setShowF] = useState(true);

  const changeModel = () => {
    setShowF( (prev) => !prev);
  }

  const loadModels = async () => {
    const file1 = await fetch('ez.ifc');
    console.log("CARGAAAA", file1)
    const file2 = await fetch('ez2.ifc');

    const newModels = [];

    newModels.push(file1);
    newModels.push(file2);

    setModels(newModels);
  }

  useState( () => {
    loadModels().catch(console.log);
  }, []);

  return (
    <div className='App'>
      <button className='buttonc' onClick={changeModel}>Cambiar</button>
      <div style={{ width: '800px', height: '500px', overflow: 'hidden' }}>
        <ThreeCanvas model={showF ? models[0] : models[1]}></ThreeCanvas>
      </div>
      
    </div>
  )
}

export default App
