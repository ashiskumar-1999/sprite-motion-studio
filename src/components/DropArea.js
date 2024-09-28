import React from "react";
import { useDrop } from "react-dnd";

const DroppableArea = ({ sprite, updateSpriteCommands }) => {
  const [, drop] = useDrop(
    () => ({
      accept: "BLOCK", // Only accept items of type 'BLOCK'
      drop: (item) => {
        const text = item.block.text.split(" ");
        const defaultBlockValue = item.block.category === "motion" ? 10 : text[1]
        const newBlock = { ...item.block, value: item.block.value || defaultBlockValue };
        // When a block is dropped, add it to the sprite's commands
        const newCommands = [...sprite.commands, newBlock];
        updateSpriteCommands(sprite.id, newCommands);
      },
    }),
    [sprite, updateSpriteCommands]
  );
  const handleValueChange = (index, newValue) => {
    const updatedCommands = [...sprite.commands];
    if(newValue !== ''){
      if(!isNaN(newValue)){
        updatedCommands[index].value = parseInt(newValue, 10)
      }
      else{
        updatedCommands[index].value = newValue
      }
    }else{
      updatedCommands[index].value=""
    }
    /* 
    updatedCommands[index].value = newValue === '' ? '' : parseInt(newValue, 10); */
    updateSpriteCommands(sprite.id, updatedCommands);
  };

  const formatedText = (command) => {
    if(command.value !== undefined){
      const commandText = command.category === "text"?command.text.split(" "):command.text.split(/\d+/)
      return(
        <>
        {commandText[0]} &nbsp;
        {command.category === "motion" ?
         <input
         type="number"
         value={command.value}
         onChange={(e) => handleValueChange(sprite.commands.indexOf(command), e.target.value)}
         className=" w-12 p-1 border text-black text-center rounded-lg"
       />: command.category === "text" &&
       <input
         type="text"
         value={command.value}
         onChange={(e) => handleValueChange(sprite.commands.indexOf(command), e.target.value)}
         className=" w-20 p-1 border text-black text-center rounded-lg"
       />
        }
       
          {command.category === 'motion' && commandText[1]}
          </>
      )
    }
    return command.text
  }
  return (
    <div
      ref={drop}
      className="flex-1 h-full p-4 border-2 border-dashed border-gray-300  overflow-y-auto"
    >
      <h2 className="text-lg font-bold mb-4">{sprite.name} Commands</h2>
      {/* Display all commands for the current sprite */}
      {sprite.commands.map((command, index) => (
        <div
          key={index}
          className={`${command.color} text-white px-2 py-1 my-2 text-sm rounded-md`}
        >
          {formatedText(command)}
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
  return (
    <div className="flex-1 h-full overflow-auto flex flex-col p-5">
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
