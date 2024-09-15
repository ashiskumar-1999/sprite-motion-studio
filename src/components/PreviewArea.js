import React, { useState, useEffect } from "react";
import CatSprite from "./CatSprite";

// Sprite component represents a single sprite in the preview area
const Sprite = ({ sprite, isAnimating }) => {
  // State to manage the sprite's position and rotation
  const [position, setPosition] = useState({ x: sprite.x, y: sprite.y });
  const [rotation, setRotation] = useState(0);

  // Effect to animate the sprite when isAnimating becomes true
  useEffect(() => {
    if (isAnimating) {
      animateSprite(sprite.commands);
    }
  }, [isAnimating, sprite.commands]);

  // Function to animate the sprite based on its commands
  const animateSprite = async (commands) => {
    for (const command of commands) {
      await executeCommand(command);
    }
  };

  // Function to execute a single command
  const executeCommand = (command) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        switch (command.id) {
          case "move_steps":
            setPosition((prev) => ({ x: prev.x + 10, y: prev.y }));
            break;
          case "turn_left":
            setRotation((prev) => prev - 15);
            break;
          case "turn_right":
            setRotation((prev) => prev + 15);
            break;
          case "goto_xy":
            setPosition({ x: 0, y: 0 });
            break;
          default:
            break;
        }
        resolve();
      }, 500);
    });
  };

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
    </div>
  );
};

export default function PreviewArea({ sprites, addSprite }) {
  // State to control when sprites should be animating
  const [isAnimating, setIsAnimating] = useState(false);

  // Function to start the animation of all sprites
  const handlePlay = () => {
    setIsAnimating(true);
    // Reset animation state after all sprites have finished animating
    setTimeout(
      () => setIsAnimating(false),
      sprites.length * sprites[0].commands.length * 500
    );
  };

  return (
    <div className="w-full h-full flex flex-col pb-10">
      <div className="flex-grow relative bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
        {sprites.map((sprite) => (
          <Sprite key={sprite.id} sprite={sprite} isAnimating={isAnimating} />
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
