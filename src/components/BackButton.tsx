import React from "react";

interface BackButtonProps {
  to: string;
  color: string;
  textColor: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to, color, textColor }) => {
  const handleClick = () => {
    window.location.href = to;
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-[8vw] h-[8vw] cursor-pointer"
      style={{
        backgroundColor: color,
        clipPath: "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
        border: "0.4px solid black"
      }}
    >
      <p
        className="absolute inset-0 flex items-center justify-center"
        style={{
          color: textColor || "#ffefdb",
          fontFamily: "Courier new, monospace",
          fontSize: "1vw",
          fontWeight: "500",
          textShadow: "0 0 0.1em rgba(0, 0, 0, 1)"
        }}
      >
        Back
      </p>
    </div>
  );
};

export default BackButton;
