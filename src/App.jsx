import { useState } from 'react'
import './App.css'
import ThreeCanvas from './ThreeCanvas'
import NewCanvas from './NewCanvas';

function App() {

  const [models, setModels] = useState([]); 

  const [showF, setShowF] = useState(true);

  const changeModel = () => {
    setShowF( (prev) => !prev);
  }

  const loadModels = async () => {
    const file1 = await fetch('ez.ifc');
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
    <NewCanvas />
  )
}

export default App
