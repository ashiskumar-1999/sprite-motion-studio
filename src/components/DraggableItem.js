import React from "react";
import Icon from "./Icon";
import { useDrag } from "react-dnd";

const DraggableBlock = ({ block }) => {
  // useDrag hook sets up the drag source
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BLOCK", // This must match the 'accept' type in the drop target
    item: { block }, // The data that will be passed to the drop handler
  }));

  return (
    <div
      ref={drag}
      className={`flex flex-row flex-wrap ${
        block.color
      } text-white px-2 py-1 my-2 text-sm cursor-pointer ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {block.text}
      {block.icon && (
        <Icon name={block.icon} size={15} className="text-white mx-2" />
      )}
    </div>
  );
};

export default DraggableBlock
