import React from "react";
import "../css/buttons.css";

export const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "default",
  ...props
}) => {
  return (
    <button
      className={`custom-button ${variant} ${className}`}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};
