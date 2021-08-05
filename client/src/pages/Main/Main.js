import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import API from "../../utils/API";
import moment from "moment";
import "./index.css";
import Modal from "react-modal";
import Filters from "../../components/Filters";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

function Main() {
  const [showTable, setShowTable] = useState(
    {
      pony: false,
      anime: false,
      reg: false,
      indie: false,
      vg: false,
      tv: false
    }
  );
  const [sortHeader, setSortHeader] = useState(
    {
      song: false,
      artist: false,
      source: false,
      updated: false
    }
  );
  const [allSongs, setAllSongs] = useState([]);
  const [splitSongs, setSplitSongs] = useState({
    pony: [],
    anime: [],
    reg: [],
    indie: [],
    vg: [],
    tv: [],
    lastTen: []
  });
  const [filteredSplitSongs, setFilteredSplitSongs] = useState({
    pony: [],
    anime: [],
    reg: [],
    indie: [],
    vg: [],
    tv: [],
    lastTen: []
  });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [filterBox, setFilterBox] = useState(false);
  const [videoInfo, setVideoInfo] = useState({
    id: "",
    song: "",
    artist: ""
  });
  const [insFilters, setInsFilters] = useState({
    guitar: false,
    bass: false,
    drums: false,
    vocals: false,
    keys: false
  });
  const [searchBar, setSearchBar] = useState("");

  useEffect(() => {
    API.getSongs()
      .then(res => {
        if (res.data.songs) {
          let songs = {
            pony: [],
            anime: [],
            reg: [],
            indie: [],
            vg: [],
            tv: [],
            lastTen: []
          };
          setAllSongs(res.data.songs)

          res.data.songs.forEach(song => {
            switch (song.type) {
              case "pony":
                songs.pony.push(song);
                break;
              case "anime":
                songs.anime.push(song);
                break;
              case "reg":
                songs.reg.push(song);
                break;
              case "indie":
                songs.indie.push(song);
                break;
              case "vg":
                songs.vg.push(song);
                break;
              case "tv":
                songs.tv.push(song);
                break;
            }
          })

          for (let i = 0; i < 10; i++) {
            songs.lastTen.push(res.data.songs[i]);
          }

          setSplitSongs(songs);
          setFilteredSplitSongs(songs);
        }
      })
      .catch(err => console.log(err))
  }, []);

  // Runs filterInstruments function after user clicks on a filter criteria
  useEffect(() => {
    filterInstruments();
  }, [insFilters]);

  // Runs searchSong function after user types in the search bar
  useEffect(() => {
    searchSong();
  }, [searchBar])

  function openFilters(event) {
    if (filterBox) setFilterBox(false);
    else setFilterBox(true);
  }

  // Clicking a button category will reveal it's table of songs
  function openTable(event) {
    let category = event.currentTarget.value;

    if (showTable[category] === false) setShowTable({ ...showTable, [category]: true });
    else setShowTable({ ...showTable, [category]: false });
  }

  /*
  If the user types anything into the searchbar, search results gets passed to the filterInstruments function
  If the user checks a box in the filter, the filtered results gets passed to the searchSong function
  TL;DR: 
  searchSong --> filterInstruments
  filterInstruments --> searchSong
  */

  // Runs a real time search of a song in every category, filteredSplitSongs object is updated after every result update
  function searchSong(passedObject) {
    let object = {};
    let songs = {};

    // passedObject is the results from the instrument filters
    if (passedObject) songs = passedObject;
    else songs = splitSongs;

    for (let array in songs) {
      let searchedSongs = songs[array].filter(song => {
        let values = filterValues(song);
        if (values.indexOf(searchBar.toLowerCase()) !== -1) {
          return song
        };
      })

      object[array] = searchedSongs;
    }

    if (passedObject) setFilteredSplitSongs(object);
    else filterInstruments(object);
  }

  // Only displays songs that contain the selected instruments from the filter
  function filterInstruments(passedSearchObject) {
    let filters = [];

    // Checked instruments from the filter are pushed into the filters array
    if (insFilters.guitar) filters.push("G");
    if (insFilters.bass) filters.push("B");
    if (insFilters.drums) filters.push("D");
    if (insFilters.vocals) filters.push("V");
    if (insFilters.keys) filters.push("K");

    // If all filters are unchecked, every song is passed to the search or displayed
    if (filters.length === 0) {
      if (passedSearchObject) setFilteredSplitSongs(passedSearchObject);
      else searchSong(splitSongs);
    }

    else {
      let object = {};
      let songs = {};

      if (passedSearchObject) songs = passedSearchObject;
      else songs = splitSongs;

      /*
      Cycles through all instruments checked in the filter, breaks the loop if the current song does not have an instrument from the filter 
      
      Example 1 (Passes the test): 
      User filter: [G, B, D]
      Song: "GBDVK"

      Example 2 (Fails the test): 
      User filter: [G, B, K]
      Song: "GBDV"
      */
      for (let array in songs) {
        let searchedSongs = songs[array].filter(song => {
          let insString = "";
          let pass = false;
          if (song.g === "G") insString += "G";
          if (song.b === "B") insString += "B";
          if (song.d === "D") insString += "D";
          if (song.v === "V") insString += "V";
          if (song.k === "K") insString += "K";
          for (let i = 0; i < filters.length; i++) {
            if (insString.indexOf(filters[i]) === -1) break;
            if (i === filters.length - 1) pass = true;
          }
          if (pass) return song;
        })

        object[array] = searchedSongs;
      }

      if (passedSearchObject) setFilteredSplitSongs(object);
      else searchSong(object);
    }
  }

  // Combines all the song's metadata into one string to search through
  function filterValues(song) {
    let string = song.updated_date + " " + song.c3.toLowerCase() + " " + song.song_name.toLowerCase() + " " + song.artist.toLowerCase() + " " + song.release_date + song.source.toLowerCase() + song.author.toLowerCase() + song.second_author.toLowerCase();

    // Allows the user to type an instrument in the search bar and return songs with that instrument
    if (song.g === "G") string += " guitar";
    if (song.b === "B") string += " bass";
    if (song.d === "D") string += " drums";
    if (song.k === "K") string += " keys";
    if (song.v === "V") string += " vocals";

    return string;
  }

  // Clicking the header of a table sorts that category for that table
  function sortTable(event) {
    let sortArray = {};

    // updated, artist, song, or source
    let sortType = event.target.getAttribute("value");

    // pony, anime, reg, indie, vg, tv, or lastTen
    let category = event.target.getAttribute("category");

    switch (sortType) {
      case "artist":
        if (sortHeader.artist) {
          sortArray[category] = filteredSplitSongs[category].sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          setSortHeader({ ...sortHeader, artist: false })
        } else {
          sortArray[category] = filteredSplitSongs[category].sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          setSortHeader({ ...sortHeader, artist: true })
        }
        break;
      case "song":
        if (sortHeader.song) {
          sortArray[category] = filteredSplitSongs[category].sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          setSortHeader({ ...sortHeader, song: false })
        } else {
          sortArray[category] = filteredSplitSongs[category].sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          setSortHeader({ ...sortHeader, song: true })
        }
        break;
      case "source":
        if (sortHeader.source) {
          sortArray[category] = filteredSplitSongs[category].sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          setSortHeader({ ...sortHeader, source: false })
        } else {
          sortArray[category] = filteredSplitSongs[category].sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          setSortHeader({ ...sortHeader, source: true })
        }
        break;
      case "updated":
        if (sortHeader.updated) {
          sortArray[category] = filteredSplitSongs[category].sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          setSortHeader({ ...sortHeader, updated: false })
        } else {
          sortArray[category] = filteredSplitSongs[category].sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          setSortHeader({ ...sortHeader, updated: true })
        }
        break;
    }
    setFilteredSplitSongs({ ...filteredSplitSongs, sortArray })
  }

  // Sorting function, "type" variable is either artist, song, or source
  function sortByName(nameA, nameB, type) {
    // Allows the sorting to ignore the word "The" and the letter "A" if it's at the beginning of the name
    if (nameA.substring(0, 4) === "the ") nameA = nameA.substring(4, nameA.length);
    if (nameB.substring(0, 4) === "the ") nameB = nameB.substring(4, nameB.length);

    if (nameA.substring(0, 2) === "a ") nameA = nameA.substring(2, nameA.length);
    if (nameB.substring(0, 2) === "a ") nameB = nameB.substring(2, nameB.length);

    if (type) {
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    } else {
      if (nameA > nameB) return -1
      if (nameA < nameB) return 1
      return 0
    }
  }

  // Sorting function using moment to compare dates
  function sortByDate(nameA, nameB) {
    if (sortHeader.updated) {
      if (moment(nameA).isBefore(nameB)) return 1
      if (moment(nameA).isAfter(nameB)) return -1
      return 0
    } else {
      if (moment(nameA).isBefore(nameB)) return -1
      if (moment(nameA).isAfter(nameB)) return 1
      return 0
    }
  }

  function openModal(event) {
    setIsOpen(true);
    let videoID = event.target.getAttribute("value").substring(event.target.getAttribute("value").length - 11);
    setVideoInfo({
      id: videoID,
      song: event.target.getAttribute("name"),
      artist: event.target.getAttribute("artist")
    })
  }

  function closeModal() {
    setIsOpen(false);
  }

  function checked(event) {
    (insFilters[event.target.value] ? setInsFilters({ ...insFilters, [event.target.value]: false }) : setInsFilters({ ...insFilters, [event.target.value]: true }))
  }

  return (
    <section className="section">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <span className="is-size-5 has-text-weight-bold">{videoInfo.artist} - {videoInfo.song}</span>
        <hr></hr>
        <div className="video-responsive">
          <iframe
            width="853"
            height="480"
            src={`https://www.youtube.com/embed/${videoInfo.id}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
          />
        </div>
      </Modal>
      <div className="container">
        <div className="has-text-centered title is-2 has-text-light pt-5">Linos' Rock Band Charts</div>
        <div className="has-text-centered title is-4 has-text-light">Number of songs: {allSongs.length}</div>

        <div className="columns">
          <div className="column is-10">
            <input
              type="text"
              className="input is-info mb-5"
              placeholder="Search for songs.."
              onChange={(e) => { setSearchBar(e.currentTarget.value) }}
            >
            </input>
          </div>
          <div className="column">
            <Filters
              onClick={openFilters}
            />
          </div>
        </div>

        {filterBox &&
          <div className="columns has-text-white">
            <div className="column is-12">
              <div className="columns is-size-3">
                <div className="column has-text-centered">Instruments</div>
              </div>
              <div className="columns">
                <div className="column has-text-centered" style={{ userSelect: "none" }}>
                  <label className="checkbox mr-2">
                    <input type="checkbox" className="mr-1" value="guitar" onChange={checked} checked={insFilters.guitar} />
                    Guitar
                  </label>
                  <label className="checkbox mr-2">
                    <input type="checkbox" className="mr-1" value="bass" onChange={checked} checked={insFilters.bass} />
                    Bass
                  </label>
                  <label className="checkbox mr-2">
                    <input type="checkbox" className="mr-1" value="drums" onChange={checked} checked={insFilters.drums} />
                    Drums
                  </label>
                  <label className="checkbox mr-2">
                    <input type="checkbox" className="mr-1" value="keys" onChange={checked} checked={insFilters.keys} />
                    Keys
                  </label>
                  <label className="checkbox mr-2">
                    <input type="checkbox" className="mr-1" value="vocals" onChange={checked} checked={insFilters.vocals} />
                    Vocals
                  </label>
                </div>
              </div>
            </div>

          </div>
        }

        {filteredSplitSongs.pony.length !== 0 &&
          <>
            <span className="is-size-6 has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs.filter(e => e.type === "pony")[0].updated_date).format("YYYY-MM-DD")}</span>
            <Button value={"pony"} onClick={openTable} label={"Pony Songs"} length={filteredSplitSongs.pony.length} />
          </>
        }
        {showTable.pony && filteredSplitSongs.pony.length !== 0 &&
          <Table sortTable={sortTable} category="pony" upDown={sortHeader} songs={filteredSplitSongs.pony} openModal={openModal} />
        }
        <br />

        {filteredSplitSongs.anime.length !== 0 &&
          <>
            <span className="is-size-6 has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs.filter(e => e.type === "anime")[0].updated_date).format("YYYY-MM-DD")}</span>
            <Button value={"anime"} onClick={openTable} label={"Anime / Japanese Songs"} length={filteredSplitSongs.anime.length} />
          </>
        }
        {showTable.anime && filteredSplitSongs.anime.length !== 0 &&
          <Table sortTable={sortTable} category="anime" upDown={sortHeader} songs={filteredSplitSongs.anime} openModal={openModal} />
        }
        <br />

        {filteredSplitSongs.vg.length !== 0 &&
          <>
            <span className="is-size-6 has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs.filter(e => e.type === "vg")[0].updated_date).format("YYYY-MM-DD")}</span>
            <Button value={"vg"} onClick={openTable} label={"Video Game Music"} length={filteredSplitSongs.vg.length} />
          </>
        }
        {showTable.vg && filteredSplitSongs.vg.length !== 0 &&
          <Table sortTable={sortTable} category="vg" upDown={sortHeader} songs={filteredSplitSongs.vg} openModal={openModal} />
        }
        <br />


        {filteredSplitSongs.reg.length !== 0 &&
          <>
            <span className="is-size-6 has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs.filter(e => e.type === "reg")[0].updated_date).format("YYYY-MM-DD")}</span>
            <Button value={"reg"} onClick={openTable} label={"Normie Music"} length={filteredSplitSongs.reg.length} />
          </>
        }
        {showTable.reg && filteredSplitSongs.reg.length !== 0 &&
          <Table sortTable={sortTable} category="reg" upDown={sortHeader} songs={filteredSplitSongs.reg} openModal={openModal} />
        }
        <br />

        {filteredSplitSongs.indie.length !== 0 &&
          <>
            <span className="is-size-6 has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs.filter(e => e.type === "indie")[0].updated_date).format("YYYY-MM-DD")}</span>
            <Button value={"indie"} onClick={openTable} label={"Indies"} length={filteredSplitSongs.indie.length} />
          </>
        }
        {showTable.indie && filteredSplitSongs.indie.length !== 0 &&
          <Table sortTable={sortTable} category="indie" upDown={sortHeader} songs={filteredSplitSongs.indie} openModal={openModal} />
        }
        <br />

        {filteredSplitSongs.tv.length !== 0 &&
          <>
            <span className="is-size-6 has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs.filter(e => e.type === "tv")[0].updated_date).format("YYYY-MM-DD")}</span>
            <Button value={"tv"} onClick={openTable} label={"TV / Cartoon Shows"} length={filteredSplitSongs.tv.length} />
          </>
        }
        {showTable.tv && filteredSplitSongs.tv.length !== 0 &&
          <Table sortTable={sortTable} category="tv" upDown={sortHeader} songs={filteredSplitSongs.tv} openModal={openModal} />
        }

        <div className="mt-5">
          <div className="is-size-2 has-text-centered has-text-light">Last 10 Releases</div>
          <div className="is-size-6 has-text-centered has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs[0].updated_date).format("YYYY-MM-DD")}</div>
          <hr />
          <Table sortTable={sortTable} category="lastTen" upDown={sortHeader} songs={splitSongs.lastTen} openModal={openModal} />
        </div>

      </div>
    </section>
  );
}

export default Main;
