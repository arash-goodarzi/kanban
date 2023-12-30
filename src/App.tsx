
import { useState } from 'react';
import './App.css'
import KanbanBoard from './components/KanbanBoard'
import Header from './components/Header';

function App() {
  const [backgroundColor, setBackgroundColor] = useState('bg-gray-300 text-black');

  const changeBackgroundColor = (color:string) => {

    setBackgroundColor(color);
  };

  return (
    <div className={`min-h-screen ${backgroundColor} flex flex-col`}>

        <div className="h-[10%]">
          <Header changeBackgroundColor={changeBackgroundColor} />
        </div>
        <div className="h-[90%] flex justify-start items-start">
          <KanbanBoard />
        </div>
    </div>
  )
}

export default App
