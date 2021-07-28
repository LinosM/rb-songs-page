import React from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";

const Filters = props => (
  <button 
    className="button is-fullwidth"
    // onClick={props.onClick}
    // value={props.value}
  >
    <FontAwesomeIcon className="mr-2" icon={faSlidersH} /> Filters
  </button>
);

export default Filters;
