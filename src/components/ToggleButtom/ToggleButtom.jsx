import React from "react";

const ToggleButton = ({ value, onChange }) => {
  return (
    <>
      <span className="clearfix" />
      <label className="custom-toggle">
        <input
          type="checkbox"
          id="estado"
          name="estado"
          checked={value}
          onChange={onChange}
        />
        <span className="custom-toggle-slider rounded-circle" />
      </label>
    </>
  );
};

export default ToggleButton;
