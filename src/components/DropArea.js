import React from "react";
import { useDrop } from "react-dnd";

const DroppableArea = ({ sprite, updateSpriteCommands }) => {
  const [, drop] = useDrop(
    () => ({
      accept: "BLOCK", // Only accept items of type 'BLOCK'
      drop: (item) => {
        console.log("Item dropped:", item);
        console.log("Current sprite commands:", sprite.commands);
        // When a block is dropped, add it to the sprite's commands
        const newCommands = [...sprite.commands, item.block];
        console.log("New commands after drop:", newCommands);
        updateSpriteCommands(sprite.id, newCommands);
      },
    }),
    [sprite, updateSpriteCommands]
  );

  return (
    <div
      ref={drop}
      className="flex-1 h-full p-4 border-2 border-dashed border-gray-300 overflow-y-auto"
    >
      <h2 className="text-lg font-bold mb-4">{sprite.name} Commands</h2>
      {/* Display all commands for the current sprite */}
      {sprite.commands.map((command, index) => (
        <div
          key={index}
          className={`${command.color} text-white px-2 py-1 my-2 text-sm`}
        >
          {command.text}
        </div>
      ))}
    </div>
  );
};

export default function DropArea({
  sprites,
  selectedSprite,
  setSelectedSprite,
  updateSpriteCommands,
}) {
  console.log("MidArea render - Selected sprite:", selectedSprite);
  console.log("MidArea render - Sprites:", sprites);

  return (
    <div className="flex-1 h-full overflow-auto flex flex-col">
      <div className="flex mb-4">
        {sprites.map((sprite) => (
          <button
            key={sprite.id}
            className={`mr-2 px-4 py-2 rounded ${
              selectedSprite === sprite.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedSprite(sprite.id)}
          >
            {sprite.name}
          </button>
        ))}
      </div>
      <DroppableArea
        sprite={sprites.find((s) => s.id === selectedSprite)}
        updateSpriteCommands={updateSpriteCommands}
      />
    </div>
  );
}
