import React from "react";
import { ImageIcon } from "lucide-react";

const NoImage = ({ title = "Sin portada" }) => {
  return (
    <div
      className="
        w-full h-full
        bg-gradient-to-br from-gray-100 to-gray-200
        flex flex-col items-center justify-center
        text-gray-400
      "
    >
      <ImageIcon size={28} />

      <span className="text-[11px] mt-2 text-center px-2 line-clamp-2">
        {title}
      </span>
    </div>
  );
};

export default NoImage;