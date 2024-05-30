"use client";

const ButtonGradient = ({ title = "Gradient Button", src }) => {
  return (
    <button
      className="btn btn-gradient animate-shimmer"
      href={src}
    >
      {title}
    </button>
  );
};

export default ButtonGradient;
