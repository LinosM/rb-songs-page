import React from "react";
import moment from "moment";
import "./index.css";

function hello() {
  console.log("hello");
}

const TableBody = props => (
  <tr>
    <td className="date">{moment(props.song.updated_date).format("YYYY-MM-DD")}</td>
    <td>{props.song.artist}</td>
    <td><a href={props.song.download} target="_blank">{props.song.song_name}</a></td>
    <td>{props.song.source ? props.song.source : ""}</td>
    <td className="date">{moment(props.song.release_date).format("YYYY-MM-DD")}</td>
    <td>{props.song.multitrack}</td>
    <td>{props.song.g}</td>
    <td>{props.song.b}</td>
    <td>{props.song.d}</td>
    <td>{props.song.k}</td>
    <td>{props.song.v}</td>
    {/* <td><a href="#" value={props.song.video} className="preview" onClick={props.openModal} name={props.song.song_name} artist={props.song.artist}>Preview</a></td> */}
    {/* <td><FontAwesomeIcon icon={faYoutube} value={props.song.video} className="preview" onClick={props.openModal} name={props.song.song_name} artist={props.song.artist} /></td> */}
    <td value={props.song.video} onClick={props.openModal} name={props.song.song_name} artist={props.song.artist}>
      <i className="fa fa-youtube-play fa-2x" value={props.song.video} onClick={props.openModal} name={props.song.song_name} artist={props.song.artist}></i>
    </td>
  </tr>
);

export default TableBody;
