import React, { useState, useEffect, useCallback } from "react";
import CatSprite from "./CatSprite";

// Sprite component represents a single sprite in the preview area
const Sprite = ({ sprite, isAnimating,updatePosition }) => {
  // State to manage the sprite's position and rotation
  const [position, setPosition] = useState({ x: sprite.x, y: sprite.y });
  const [rotation, setRotation] = useState(0);
  const [currentCommands, setCurrentCommands] = useState(sprite.commands);
  const [tooltip, setTooltip] = useState({ text: "", position: {x:sprite.x, y:sprite.y}});
  


  // Effect to animate the sprite when isAnimating becomes true
  useEffect(() => {
    if (isAnimating) {
      animateSprite(currentCommands);
    }
  }, [isAnimating, currentCommands]);

  // Function to animate the sprite based on its commands
  const animateSprite = async (commands) => {
    for (const command of commands) {
      await executeCommand(command);
      updatePosition(sprite.id, position);
    }
  };
  // Function to execute a single command
  const executeCommand = (command) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        switch (command.id) {
          case "show_text":
            setTooltip({
              text: command.text,
              position: { x: position.x + 10, y: position.y - 40 }, // Tooltip 30px above the sprite
            });
            break;
          case "move_steps":
            setPosition((prev) => ({ x: prev.x + command.value, y: prev.y }));
            break;
          case "turn_left":
            setRotation((prev) => prev - command.value);
            break;
          case "turn_right":
            setRotation((prev) => prev + command.value);
            break;
          case "goto_xy":
            setPosition({ x: command.value, y: command.value });
            break;
          default:
            break;
        }
        resolve();
      }, 500);
      console.log("Position of the tooltipX:", tooltip.position.x)
  console.log("Position of the tooltipY:", tooltip.position.y)
    });
  };

  useEffect(() => {
    setCurrentCommands(sprite.commands);
  }, [sprite.commands]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${rotation}deg)`,
        transition: "all 0.5s",
      }}
    >
      <CatSprite />
      {tooltip.text && tooltip.position && (
        <div
          role="tooltip"
          style={{
              left: `${tooltip.position.x}px`,
              top: `${tooltip.position.y}px`, // Position tooltip above the sprite
              border:"2px solid",
              borderColor:"#94A3B8",
              color: "#000000",
              padding: "10px",
              borderRadius: "5px",
              fontSize: "12px",
              transform: "translateX(-50%)",
            }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default function PreviewArea({ sprites, addSprite }) {
  // State to control when sprites should be animating
  const [isAnimating, setIsAnimating] = useState(false);
  const [positions, setPositions] = useState({}) //State to store the position cordinate of each sprit

  // Function to start the animation of all sprites
  const handlePlay = () => {
    setIsAnimating(true);
    // Reset animation state after all sprites have finished animating
    setTimeout(
      () => setIsAnimating(false),
      sprites.length * sprites[0].commands.length * 500
    );
  };

  
  const CheckingCollision = useCallback((sprite1,sprite2) =>{
    const FirstSpritePositions = positions[sprite1.id];
    const SecondSpritePositions = positions[sprite2.id];

    if (!FirstSpritePositions || !SecondSpritePositions) {
      return false;
    }

    const distance = Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)
    );

    if(distance === 80){
      console.log("Position distance 0")
      return true;
    }
    return false;

  },[positions])

  useEffect(() => {
    if(isAnimating){
      const interval = setInterval(() => {
      for(let i = 1; i<sprites.length; i++) {
        for(let j = i+1; j<sprites.length; j++){
          if(CheckingCollision({ sprite1: sprites[i], sprite2: sprites[j] })){
            const tempCommands = sprites[i].commands;
            sprites[i].commands = sprites[j].commands;
            sprites[j].commands = tempCommands
          }
        }
      }
    },100)
      return () => clearInterval(interval)
    }
  },[isAnimating,sprites, positions])

  const updatePosition = useCallback((id, position) => {
    setPositions((prevPositions) => ({ ...prevPositions, [id]: position }));
  });
  
  return (
    <div className="w-full h-full flex flex-col pb-10">
      <div className="flex-grow relative bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
        {sprites.map((sprite) => (
          <Sprite key={sprite.id} sprite={sprite} isAnimating={isAnimating} updatePosition={updatePosition}/>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4 px-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={handlePlay}
          disabled={isAnimating}
        >
          {isAnimating ? "Playing..." : "Play"}
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={addSprite}
        >
          Add Sprite
        </button>
      </div>
    </div>
  );
}
