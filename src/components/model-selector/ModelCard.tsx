import React from "react";

interface ModelCardProps {
  id: string;
  name: string;
  onSelect: (id: string) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ id, name, onSelect }) => {
  return (
    <div
      className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => onSelect(id)}
    >
      <h3 className="text-lg font-semibold text-center">{name}</h3>
    </div>
  );
};

export default ModelCard;
