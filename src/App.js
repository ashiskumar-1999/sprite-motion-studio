import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "./components/Sidebar";
import DropArea from "./components/DropArea"
import PreviewArea from "./components/PreviewArea";

export default function App() {
  // State to store all sprites
  const [sprites, setSprites] = useState([
    { id: 1, name: "Sprite 1", x: 100, y: 100, commands: [] },
  ]);
  const [selectedSprite, setSelectedSprite] = useState(1); // State to keep track of which sprite is currently selected

  // Function to add a new sprite
  const addSprite = useCallback(() => {
    const newId = sprites.length + 1;
    const newX = sprites[sprites.length -1].x + 100
    const newY = sprites[sprites.length -1].y + 50
    setSprites((prevSprites) => [
      ...prevSprites,
      { id: newId, name: `Sprite ${newId}`, x: newX, y: newY, commands: [] },
    ]);
  }, [sprites.length]);

  // Function to update commands for a specific sprite
  const updateSpriteCommands = useCallback((spriteId, newCommands) => {
 

    setSprites((prevSprites) =>
      prevSprites.map((sprite) =>
        sprite.id === spriteId ? { ...sprite, commands: newCommands } : sprite
      )
    );
  }, []);


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-blue-100 pt-6 font-sans">
        <div className="h-screen overflow-hidden flex flex-row  ">
          <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
            <Sidebar />
            <DropArea
              sprites={sprites}
              selectedSprite={selectedSprite}
              setSelectedSprite={setSelectedSprite}
              updateSpriteCommands={updateSpriteCommands}
            />
          </div>
          <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea sprites={sprites} addSprite={addSprite} />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
