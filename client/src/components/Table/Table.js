import React, { useState, useEffect } from "react";
import TableBody from "../../components/TableBody";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAlphaUp, faSortAlphaDown, faSortNumericUpAlt, faSortNumericDownAlt, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import "./index.css";

function Table(props) {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const [isMobile, setMobile] = useState(window.innerWidth < 768);
  const [count, setCount] = useState(10);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
    setMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  // Button that keeps adding 10 more songs to the recent song list
  // If statement prevents the counter from going indefinitely
  function addTen() {
    if (count < props.songs.length) setCount(count + 10);    
  }

  return (
    <>
      <table className="table is-narrow is-hoverable">
        <thead>
          <tr>
            <th className="date clickable col_1" scope="col" category={props.category} value="updated" onClick={props.sortTable}>
              Updated
              <span className="ml-1">
                <FontAwesomeIcon value="updated" category={props.category} onClick={props.sortTable} icon={props.upDown.updated ? faSortNumericUpAlt : faSortNumericDownAlt} />
              </span>
            </th>
            <th scope="col" className="clickable col_2" category={props.category} value="artist" onClick={props.sortTable}>
              Artist
              <span className="ml-1">
                <FontAwesomeIcon value="artist" category={props.category} onClick={props.sortTable} icon={props.upDown.artist ? faSortAlphaUp : faSortAlphaDown} />
              </span>
            </th>
            <th scope="col col_3" className="clickable" category={props.category} value="song" onClick={props.sortTable}>
              Song
              <span className="ml-1">
                <FontAwesomeIcon value="song" category={props.category} onClick={props.sortTable} icon={props.upDown.song ? faSortAlphaUp : faSortAlphaDown} />
              </span>
            </th>
            <th scope="col col_4" className="clickable" category={props.category} value="source" onClick={props.sortTable}>
              Source
              <span className="ml-1">
                <FontAwesomeIcon value="source" category={props.category} onClick={props.sortTable} icon={props.upDown.source ? faSortAlphaUp : faSortAlphaDown} />
              </span>
            </th>
            {isDesktop &&
              <>
                <th className="date col_5" scope="col">Release Date</th>
                <th scope="col" className="col_6">Multitrack</th>
              </>
            }
            {!isMobile &&
              <>
                <th scope="col">G</th>
                <th scope="col">B</th>
                <th scope="col">D</th>
                <th scope="col">K</th>
                <th scope="col">V</th>
              </>
            }
            <th scope="col">Preview</th>
          </tr>
        </thead>
        <tbody>
          {props.category !== "lastTen" &&
            <>
            {props.songs && props.songs.map(song => (
              <TableBody song={song} key={song._id} openModal={props.openModal} clickSearch={props.clickSearch} />
            ))}
            </>
          }
          {props.category === "lastTen" &&
            <>
            {props.songs && props.songs.slice(0, count).map(song => (
              <TableBody song={song} key={song._id} openModal={props.openModal} clickSearch={props.clickSearch} />
            ))}
            </>
          }
        </tbody>
      </table>
      {props.category === "lastTen" &&
        <button className="button is-small mb-2 mr-2" onClick={addTen}>
          <FontAwesomeIcon icon={faArrowDown} className="mr-2"/>
          Load 10 more
        </button>
      }
      <button className="button is-small mb-2" onClick={props.scrollToTop}>
        <FontAwesomeIcon icon={faArrowUp} className="mr-2"/>
        Return to top
      </button>
    </>
  )
}

export default Table;
