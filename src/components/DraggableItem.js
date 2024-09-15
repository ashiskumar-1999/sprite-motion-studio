import React from "react";
import { useDraggable } from "@dnd-kit/core";

const DraggableItem = ({ id, type, value, unit, icon, handleChange }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: { type, value, unit },
  });
  const style = transform && {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
    >
      {type}&nbsp;{icon}&nbsp;{unit}
    </div>
  );
};

export default DraggableItem;
