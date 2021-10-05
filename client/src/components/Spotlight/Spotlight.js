import React, { useState, useEffect } from "react";
import "./index.css";
import moment from "moment";
import SpotlightInfo from "../SpotlightInfo";

function Spotlight(props) {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    let songs = [];
    for (let i = 0; i < props.song[0].pack; i++) {
      songs.push(props.song[i]);
    }
    setSongs(songs);
  }, [props]);

  return (
    <>
      <hr />
      <div className="has-text-centered has-text-white title is-4 is-underlined">Latest Release</div>
      <p className="has-text-centered has-text-white is-italic title is-4">{moment(props.song[0].release_date).format('MMMM Do, YYYY')}</p>
      {songs.map((song) => (
        <SpotlightInfo song={song} />
      ))}
      <hr />
    </>
  )
}

export default Spotlight;
