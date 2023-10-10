import React, { useState, useEffect } from "react";
import "./index.css";
import moment from "moment";
import SpotlightInfo from "../SpotlightInfo";

function Spotlight(props) {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    let sortedProps = props.song.sort((a, b) => {
      const nameA = a.updated_date, nameB = b.updated_date;
      if (moment(nameA).isBefore(nameB)) return 1
      if (moment(nameA).isAfter(nameB)) return -1
      return 0
    })
    let songs = [];
    for (let i = 0; i < sortedProps[0].pack; i++) {
      songs.push(props.song[i]);
    }
    setSongs(songs);
  }, [props]);

  return (
    <>
      <hr />
      <div className="has-text-centered has-text-white title is-4 is-underlined">{moment(props.song[0].updated_date) !== moment(props.song[0].release_date) ? "Latest Release" : "Updated Songs"}</div>
      <p className="has-text-centered has-text-white is-italic title is-4">{moment(props.song[0].updated_date).format('MMMM Do, YYYY')}</p>
      {songs.map((song) => (
        <SpotlightInfo song={song} key={song._id} />
      ))}
      <hr />
    </>
  )
}

export default Spotlight;
