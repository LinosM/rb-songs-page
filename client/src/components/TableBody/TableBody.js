import React, { useState, useEffect } from "react";
import moment from "moment";
import "./index.css";

function TableBody(props) {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [isMobile, setMobile] = useState(window.innerWidth < 768);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
    setMobile(window.innerWidth < 768);
  };

  const [isHoveringArt, setIsHoveringArt] = useState(false);
  const [isHoveringSrc, setIsHoveringSrc] = useState(false);
  const handleMouseOver = (e) => {
    switch (e.target.getAttribute("data-type")) {
      case "art":
        setIsHoveringArt(true);
        break;
      case "src":
        {e.target.textContent !== "" ? setIsHoveringSrc(true) : setIsHoveringSrc(false)};
        break;
      default:
        console.log("unknown type");
    }
  };
  const handleMouseOut = (e) => {
    switch (e.target.getAttribute("data-type")) {
      case "art":
        setIsHoveringArt(false);
        break;
      case "src":
        setIsHoveringSrc(false);
        break;
      default:
        console.log("unknown type");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  return (
    <tr>
      <td className="date">{moment(props.song.updated_date).format("YYYY-MM-DD")}</td>
      <td className={isHoveringArt ? "has-background-grey-lighter has-text-weight-bold" : ""} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} style={{cursor:'pointer'}} onClick={e => props.clickSearch(e.target.textContent)} data-type="art">{props.song.artist}</td>
      <td> <a href={props.song.download} target="_blank" rel="noopener noreferrer">{props.song.song_name}</a></td>
      <td className={isHoveringSrc ? "has-background-grey-lighter has-text-weight-bold" : ""} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} style={ props.song.source ? {cursor:'pointer'} : {}} onClick={e => props.clickSearch(e.target.textContent)} data-type="src">{props.song.source ? props.song.source : ""}</td>
      {isDesktop &&
        <>
          <td className="date">{moment(props.song.release_date).format("YYYY-MM-DD")}</td>
          <td>{props.song.multitrack}</td>
        </>
      }
      {!isMobile &&
        <>
          {props.song.g === "G" ? <td>{props.song.g}</td> : <td className="has-background-grey">{props.song.g}</td>}
          {props.song.b === "B" ? <td>{props.song.b}</td> : <td className="has-background-grey">{props.song.b}</td>}
          {props.song.d === "D" ? <td>{props.song.d}</td> : <td className="has-background-grey">{props.song.d}</td>}
          {props.song.k === "K" ? <td>{props.song.k}</td> : <td className="has-background-grey">{props.song.k}</td>}
          {props.song.v === "V" ? <td>{props.song.v}</td> : <td className="has-background-grey">{props.song.v}</td>}
        </>
      }
      <td value={props.song.video} onClick={props.openModal} name={props.song.song_name} artist={props.song.artist}>
        <i className="fa fa-youtube-play fa-2x" value={props.song.video} onClick={props.openModal} name={props.song.song_name} artist={props.song.artist}></i>
      </td>
    </tr>
  )
}

export default TableBody;
