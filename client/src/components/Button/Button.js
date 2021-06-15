import React from "react";
import "./index.css"

const Button = props => (
  <button 
    className="button is-large is-fullwidth has-text-left mb-3"
    onClick={props.onClick}
    value={props.value}
  >
    <span className="is-size-5">{props.label} ({props.length} Songs)</span>
  </button>
);

export default Button;
