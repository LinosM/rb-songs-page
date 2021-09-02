import React from "react";
import "./index.css";
import moment from "moment";

function Spotlight(props) {

  function YouTubeGetID(url) {
    var ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = url;
    }
    return ID;
  }

  return (
    <>
      <div className="has-text-centered title is-4 has-text-light is-underlined">Latest Release</div>
      <p className="has-text-centered is-italic title is-4 has-text-light">{moment(props.song.release_date).format('MMMM Do, YYYY')}</p>
      <div className="columns">
        <div className="column is-6">
          <a href={props.song.download} target="_blank" rel="noopener noreferrer">
            <figure className="image">
              <img src={props.song.preview} className="has-image-centered previewImage"></img>
            </figure>
          </a>
        </div>
        <div className="column is-6">
          <div className="video-responsive">
            <iframe
              width="853"
              height="400"
              src={`https://www.youtube.com/embed/${YouTubeGetID(props.song.video)}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Spotlight;
