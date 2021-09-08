import React, { useState, useEffect, createRef } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import API from "../../utils/API";
import moment from "moment";
import "./index.css";
import Modal from "react-modal";
import Filters from "../../components/Filters";
import Spotlight from "../../components/Spotlight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: '90%',
    height: 'auto',
    maxWidth: "992px",
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

function Main() {
  const scrollObj = {
    pony: createRef(),
    anime: createRef(),
    reg: createRef(),
    indie: createRef(),
    vg: createRef(),
    tv: createRef()
  }
  const [isDesktop, setDesktop] = useState(window.innerWidth > 1215);
  const [isTablet, setTablet] = useState(window.innerWidth > 768 && window.innerWidth < 1216);
  const [isMobile, setMobile] = useState(window.innerWidth < 768);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 1215);
    setTablet(window.innerWidth > 768 && window.innerWidth < 1216);
    setMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

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
  const [audioFilters, setAudioFilters] = useState({
    multiYes: false,
    multiNo: false,
    multiKar: false
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
  }, [insFilters, audioFilters]);

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

    scrollObj[category].current.scrollIntoView({ behavior: "smooth" });
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
    let filters = [];       // Instrument filters
    let multiFilters = [];  // Audio type filters


    // Checked instruments from the filter are pushed into the filters array
    if (insFilters.guitar) filters.push("G");
    if (insFilters.bass) filters.push("B");
    if (insFilters.drums) filters.push("D");
    if (insFilters.vocals) filters.push("V");
    if (insFilters.keys) filters.push("K");

    if (audioFilters.multiKar) multiFilters.push("Karaoke");
    if (audioFilters.multiNo) multiFilters.push("No");
    if (audioFilters.multiYes) multiFilters.push("Yes");

    // If all filters are unchecked, every song is passed to the search or displayed
    if (filters.length === 0 && multiFilters.length === 0) {
      if (passedSearchObject) setFilteredSplitSongs(passedSearchObject);
      else searchSong(splitSongs);
    }

    else {
      let songs = {};   // First object for the instruments filter to run through
      let songs2 = {};  // Results of instruments filter is now run through the audio type filter
      let object = {};  // Final object passed to the table or searchbar

      if (passedSearchObject) songs = passedSearchObject;
      else songs = splitSongs;

      /*
      For loops the user filter and checks indexOf of current song, breaks the loop if the current song does not have an instrument from the filter 
      
      Example 1 (Passes the test): 
      User filter: [G, B, D]
      Song: [G, B, D, K, V]

      Example 2 (Fails the test): 
      User filter: [G, B, K]
      Song: [G, B, D, V]
      */
      if (filters.length !== 0) {
        for (let array in songs) {
          let searchedSongs = songs[array].filter(song => {
            let songIns = [];
            let pass = false;
            if (song.g === "G") songIns.push("G");
            if (song.b === "B") songIns.push("B");
            if (song.d === "D") songIns.push("D");
            if (song.v === "V") songIns.push("V");
            if (song.k === "K") songIns.push("K");
            for (let i = 0; i < filters.length; i++) {
              if (songIns.indexOf(filters[i]) === -1) break;

              // Turns "pass" to true and adds the current song to the object
              if (i === filters.length - 1) pass = true;
            }
            if (pass) return song;
          })

          songs2[array] = searchedSongs;
        }
      }
      else {
        songs2 = songs;
      }

      /*
      Runs an indexOf of the multiFilters array using the song's multitrack section
      
      Example (Fail):
      multiFilters: ["Yes", "Karaoke"]
      song.multitracks: "No"
      */
      if (multiFilters.length !== 0) {
        for (let array in songs2) {
          let searchedSongs = songs2[array].filter(song => {
            if (multiFilters.indexOf(song.multitrack) !== -1) {
              return song;
            }
          })
          object[array] = searchedSongs;
        }
      }
      else {
        object = songs2;
      }

      if (passedSearchObject) setFilteredSplitSongs(object);
      else searchSong(object);
    }
  }

  // Combines all the song's metadata into one string to search through
  function filterValues(song) {
    let string = song.updated_date + " " + song.song_name.toLowerCase() + " " + song.artist.toLowerCase() + " " + song.release_date + song.source.toLowerCase() + song.author.toLowerCase() + song.second_author.toLowerCase();
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

  function checkedAudio(event) {
    (audioFilters[event.target.value] ? setAudioFilters({ ...audioFilters, [event.target.value]: false }) : setAudioFilters({ ...audioFilters, [event.target.value]: true }))
  }

  function resetFilters() {
    setInsFilters({
      guitar: false,
      bass: false,
      drums: false,
      vocals: false,
      keys: false
    });
    setAudioFilters({
      multiYes: false,
      multiNo: false,
      multiKar: false
    });
    setSearchBar("");
  }

  return (
    <section className="section">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="columns">
          <div className="column">
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
          </div>
        </div>
      </Modal>

      <div className="container">
        <div className="has-text-centered title is-2 has-text-light pt-5">Linos' Rock Band Charts</div>
        <div className="has-text-centered title is-4 has-text-light">Number of songs: {allSongs.length}</div>
        {allSongs[0] &&
          <Spotlight song={allSongs[0]} />
        }
        <div className="columns my-3">
          <div className="column is-9">
            <input
              type="text"
              className="input is-info"
              placeholder="Search for songs.."
              onChange={(e) => { setSearchBar(e.currentTarget.value) }}
              value={searchBar}
            >
            </input>
          </div>
          <div className="column">
            <Filters
              onClick={openFilters}
            />
          </div>
          <div className="column is-1">
            <button
              className="button is-fullwidth is-danger is-light"
              onClick={resetFilters}
            >
              {/* Shows the "Reset" text on the button depending on the width of the window */}
              {isDesktop
                ? <><FontAwesomeIcon className="mr-1" icon={faTimesCircle} /> Reset</>
                : (isTablet ?
                  <><FontAwesomeIcon className="mr-1" icon={faTimesCircle} /></>
                  : (isMobile && <><FontAwesomeIcon className="mr-1" icon={faTimesCircle} /> Reset</>)
                )}
            </button>
          </div>
        </div>

        {filterBox &&
          <div className="columns has-text-white">
            <div className="column is-2"></div>
            <div className="column is-4 border mr-1 mt-2">
              <div className="columns">
                <div className="column has-text-centered is-size-3">Instruments</div>
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
            <div className="column is-4 border ml-1 mt-2">
              <div className="columns">
                <div className="column has-text-centered is-size-3">Audio Type</div>
              </div>
              <div className="columns">
                <div className="column has-text-centered" style={{ userSelect: "none" }}>
                  <label className="checkbox mr-2">
                    <input type="checkbox" className="mr-1" value="multiYes" onChange={checkedAudio} checked={audioFilters.multiYes} />
                    Multitracks
                  </label>
                  <label className="checkbox mr-2">
                    <input type="checkbox" className="mr-1" value="multiNo" onChange={checkedAudio} checked={audioFilters.multiNo} />
                    Single Audio
                  </label>
                  <label className="checkbox mr-2">
                    <input type="checkbox" className="mr-1" value="multiKar" onChange={checkedAudio} checked={audioFilters.multiKar} />
                    Karaoke
                  </label>
                </div>
              </div>
            </div>
            <div className="column is-2"></div>
          </div>
        }

        <br ref={scrollObj.pony} />
        {filteredSplitSongs.pony.length !== 0 &&
          <>
            <span ref={scrollObj.pony} className="is-size-6 has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs.filter(e => e.type === "pony")[0].updated_date).format("YYYY-MM-DD")}</span>
            <Button value={"pony"} onClick={openTable} label={"Pony Songs"} length={filteredSplitSongs.pony.length} />
          </>
        }
        {showTable.pony && filteredSplitSongs.pony.length !== 0 &&
          <Table sortTable={sortTable} category="pony" upDown={sortHeader} songs={filteredSplitSongs.pony} openModal={openModal} scrollToTop={() => scrollObj.pony.current.scrollIntoView({ behavior: "smooth" })}/>
        }

        <br ref={scrollObj.anime} />
        {filteredSplitSongs.anime.length !== 0 &&
          <>
            <span className="is-size-6 has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs.filter(e => e.type === "anime")[0].updated_date).format("YYYY-MM-DD")}</span>
            <Button value={"anime"} onClick={openTable} label={"Anime / Japanese Songs"} length={filteredSplitSongs.anime.length} />
          </>
        }
        {showTable.anime && filteredSplitSongs.anime.length !== 0 &&
          <Table sortTable={sortTable} category="anime" upDown={sortHeader} songs={filteredSplitSongs.anime} openModal={openModal} scrollToTop={() => scrollObj.anime.current.scrollIntoView({ behavior: "smooth" })}/>
        }

        <br ref={scrollObj.vg} />
        {filteredSplitSongs.vg.length !== 0 &&
          <>
            <span className="is-size-6 has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs.filter(e => e.type === "vg")[0].updated_date).format("YYYY-MM-DD")}</span>
            <Button value={"vg"} onClick={openTable} label={"Video Game Music"} length={filteredSplitSongs.vg.length} />
          </>
        }
        {showTable.vg && filteredSplitSongs.vg.length !== 0 &&
          <Table sortTable={sortTable} category="vg" upDown={sortHeader} songs={filteredSplitSongs.vg} openModal={openModal} scrollToTop={() => scrollObj.vg.current.scrollIntoView({ behavior: "smooth" })}/>
        }

        <br ref={scrollObj.reg} />
        {filteredSplitSongs.reg.length !== 0 &&
          <>
            <span className="is-size-6 has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs.filter(e => e.type === "reg")[0].updated_date).format("YYYY-MM-DD")}</span>
            <Button value={"reg"} onClick={openTable} label={"Normie Music"} length={filteredSplitSongs.reg.length} />
          </>
        }
        {showTable.reg && filteredSplitSongs.reg.length !== 0 &&
          <Table sortTable={sortTable} category="reg" upDown={sortHeader} songs={filteredSplitSongs.reg} openModal={openModal} scrollToTop={() => scrollObj.reg.current.scrollIntoView({ behavior: "smooth" })}/>
        }

        <br ref={scrollObj.indie} />
        {filteredSplitSongs.indie.length !== 0 &&
          <>
            <span className="is-size-6 has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs.filter(e => e.type === "indie")[0].updated_date).format("YYYY-MM-DD")}</span>
            <Button value={"indie"} onClick={openTable} label={"Indies"} length={filteredSplitSongs.indie.length} />
          </>
        }
        {showTable.indie && filteredSplitSongs.indie.length !== 0 &&
          <Table sortTable={sortTable} category="indie" upDown={sortHeader} songs={filteredSplitSongs.indie} openModal={openModal} scrollToTop={() => scrollObj.indie.current.scrollIntoView({ behavior: "smooth" })}/>
        }

        <br ref={scrollObj.tv} />
        {filteredSplitSongs.tv.length !== 0 &&
          <>
            <span className="is-size-6 has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs.filter(e => e.type === "tv")[0].updated_date).format("YYYY-MM-DD")}</span>
            <Button value={"tv"} onClick={openTable} label={"TV / Cartoon Shows"} length={filteredSplitSongs.tv.length} />
          </>
        }
        {showTable.tv && filteredSplitSongs.tv.length !== 0 &&
          <Table sortTable={sortTable} category="tv" upDown={sortHeader} songs={filteredSplitSongs.tv} openModal={openModal} scrollToTop={() => scrollObj.tv.current.scrollIntoView({ behavior: "smooth" })}/>
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
