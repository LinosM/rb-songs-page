import React from "react";
import TableBody from "../../components/TableBody";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAlphaUp, faSortAlphaDown, faSortNumericUpAlt, faSortNumericDownAlt } from '@fortawesome/free-solid-svg-icons';
import "./index.css"

const Table = props => (
  <table className="table is-narrow is-hoverable">
    <thead>
      <tr>
        <th className="date clickable" scope="col" value="updated" onClick={props.sortTable}>
          Updated
          <span className="ml-1">
            <FontAwesomeIcon value="updated" onClick={props.sortTable} icon={props.upDown.updated ? faSortNumericUpAlt : faSortNumericDownAlt} />
          </span>
        </th>
        <th scope="col" className="clickable" value="artist" onClick={props.sortTable}>
          Artist
          <span className="ml-1">
            <FontAwesomeIcon value="artist" onClick={props.sortTable} icon={props.upDown.artist ? faSortAlphaUp : faSortAlphaDown} />
          </span>
        </th>
        <th scope="col" className="clickable" value="song" onClick={props.sortTable}>
          Song
          <span className="ml-1">
            <FontAwesomeIcon value="song" onClick={props.sortTable} icon={props.upDown.song ? faSortAlphaUp : faSortAlphaDown} />
          </span>
        </th>
        <th scope="col" className="clickable" value="source" onClick={props.sortTable}>
          Source
          <span className="ml-1">
            <FontAwesomeIcon value="source" onClick={props.sortTable} icon={props.upDown.source ? faSortAlphaUp : faSortAlphaDown} />
          </span>
        </th>
        <th className="date" scope="col">Release Date</th>
        <th scope="col">Multitrack</th>
        <th scope="col">G</th>
        <th scope="col">B</th>
        <th scope="col">D</th>
        <th scope="col">K</th>
        <th scope="col">V</th>
        <th scope="col">Preview</th>
      </tr>
    </thead>
    <tbody>
      {props.songs && props.songs.map(song => (
        <TableBody song={song} key={song._id} openModal={props.openModal}/>
      ))}
    </tbody>
  </table>
);

export default Table;
