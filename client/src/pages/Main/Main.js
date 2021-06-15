import React, { useState, useEffect } from "react";
import Table from "../../components/Table";
import Button from "../../components/Button";
import API from "../../utils/API";
import moment from "moment";
import "./index.css";
import Modal from "react-modal";

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
  const [videoInfo, setVideoInfo] = useState({
    id: "",
    song: "",
    artist: ""
  });

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

  function openTable(event) {

    switch (event.currentTarget.value) {
      case "pony":
        if (showTable.pony === false) setShowTable({ ...showTable, pony: true });
        else setShowTable({ ...showTable, pony: false });
        break;
      case "anime":
        if (showTable.anime === false) setShowTable({ ...showTable, anime: true });
        else setShowTable({ ...showTable, anime: false });
        break;
      case "reg":
        if (showTable.reg === false) setShowTable({ ...showTable, reg: true });
        else setShowTable({ ...showTable, reg: false });
        break;
      case "indie":
        if (showTable.indie === false) setShowTable({ ...showTable, indie: true });
        else setShowTable({ ...showTable, indie: false });
        break;
      case "vg":
        if (showTable.vg === false) setShowTable({ ...showTable, vg: true });
        else setShowTable({ ...showTable, vg: false });
        break;
      case "tv":
        if (showTable.tv === false) setShowTable({ ...showTable, tv: true });
        else setShowTable({ ...showTable, tv: false });
        break;
    }
  }

  function searchSong(event) {
    let filter = event.currentTarget.value;

    const filteredPony = splitSongs.pony.filter(song => {
      let values = filterValues(song);
      if (values.indexOf(filter.toLowerCase()) !== -1) {
        return song
      };
    })
    const filteredAnime = splitSongs.anime.filter(song => {
      let values = filterValues(song);
      if (values.indexOf(filter.toLowerCase()) !== -1) {
        return song
      };
    })
    const filteredReg = splitSongs.reg.filter(song => {
      let values = filterValues(song);
      if (values.indexOf(filter.toLowerCase()) !== -1) {
        return song
      };
    })
    const filteredTv = splitSongs.tv.filter(song => {
      let values = filterValues(song);
      if (values.indexOf(filter.toLowerCase()) !== -1) {
        return song
      };
    })
    const filteredIndie = splitSongs.indie.filter(song => {
      let values = filterValues(song);
      if (values.indexOf(filter.toLowerCase()) !== -1) {
        return song
      };
    })
    const filteredVg = splitSongs.vg.filter(song => {
      let values = filterValues(song);
      if (values.indexOf(filter.toLowerCase()) !== -1) {
        return song
      };
    })

    setFilteredSplitSongs({
      ...filteredSplitSongs,
      pony: filteredPony,
      anime: filteredAnime,
      reg: filteredReg,
      indie: filteredIndie,
      vg: filteredVg,
      tv: filteredTv
    });
  }

  // Combines all the song's metadata into one string to search through
  function filterValues(song) {
    return song.updated_date + " " + song.c3.toLowerCase() + " " + song.song_name.toLowerCase() + " " + song.artist.toLowerCase() + " " + song.release_date + song.source.toLowerCase() + song.author.toLowerCase() + song.second_author.toLowerCase();
  }

  function sortTable(event) {
    let sortArray = {
      pony: [],
      anime: [],
      reg: [],
      indie: [],
      vg: [],
      tv: [],
      lastTen: []
    };

    // updated, artist, song, or source
    let sortType = event.target.getAttribute("value");

    // TODO: Run these in a proper loop silly
    switch (sortType) {
      case "artist":
        if (sortHeader.artist) {
          sortArray.pony = filteredSplitSongs.pony.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          sortArray.anime = filteredSplitSongs.anime.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          sortArray.reg = filteredSplitSongs.reg.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          sortArray.indie = filteredSplitSongs.indie.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          sortArray.vg = filteredSplitSongs.vg.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          sortArray.tv = filteredSplitSongs.tv.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          sortArray.lastTen = filteredSplitSongs.lastTen.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          setSortHeader({ ...sortHeader, artist: false })
        } else {
          sortArray.pony = filteredSplitSongs.pony.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          sortArray.anime = filteredSplitSongs.anime.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          sortArray.reg = filteredSplitSongs.reg.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          sortArray.indie = filteredSplitSongs.indie.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          sortArray.vg = filteredSplitSongs.vg.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          sortArray.tv = filteredSplitSongs.tv.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          sortArray.lastTen = filteredSplitSongs.lastTen.sort((a, b) => {
            const nameA = a.artist.toLowerCase(), nameB = b.artist.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.artist)
          })
          setSortHeader({ ...sortHeader, artist: true })
        }
        break;
      case "song":
        if (sortHeader.song) {
          sortArray.pony = filteredSplitSongs.pony.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          sortArray.anime = filteredSplitSongs.anime.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          sortArray.reg = filteredSplitSongs.reg.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          sortArray.indie = filteredSplitSongs.indie.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          sortArray.vg = filteredSplitSongs.vg.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          sortArray.tv = filteredSplitSongs.tv.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          sortArray.lastTen = filteredSplitSongs.lastTen.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          setSortHeader({ ...sortHeader, song: false })
        } else {
          sortArray.pony = filteredSplitSongs.pony.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          sortArray.anime = filteredSplitSongs.anime.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          sortArray.reg = filteredSplitSongs.reg.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          sortArray.indie = filteredSplitSongs.indie.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          sortArray.vg = filteredSplitSongs.vg.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          sortArray.tv = filteredSplitSongs.tv.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          sortArray.lastTen = filteredSplitSongs.lastTen.sort((a, b) => {
            const nameA = a.song_name.toLowerCase(), nameB = b.song_name.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.song)
          })
          setSortHeader({ ...sortHeader, song: true })
        }
        break;
      case "source":
        if (sortHeader.source) {
          sortArray.pony = filteredSplitSongs.pony.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          sortArray.anime = filteredSplitSongs.anime.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          sortArray.reg = filteredSplitSongs.reg.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          sortArray.indie = filteredSplitSongs.indie.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          sortArray.vg = filteredSplitSongs.vg.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          sortArray.tv = filteredSplitSongs.tv.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          sortArray.lastTen = filteredSplitSongs.lastTen.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          setSortHeader({ ...sortHeader, source: false })
        } else {
          sortArray.pony = filteredSplitSongs.pony.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          sortArray.anime = filteredSplitSongs.anime.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          sortArray.reg = filteredSplitSongs.reg.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          sortArray.indie = filteredSplitSongs.indie.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          sortArray.vg = filteredSplitSongs.vg.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          sortArray.tv = filteredSplitSongs.tv.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          sortArray.lastTen = filteredSplitSongs.lastTen.sort((a, b) => {
            const nameA = a.source.toLowerCase(), nameB = b.source.toLowerCase();
            return sortByName(nameA, nameB, sortHeader.source)
          })
          setSortHeader({ ...sortHeader, source: true })
        }
        break;
      case "updated":
        if (sortHeader.updated) {
          sortArray.pony = filteredSplitSongs.pony.sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          sortArray.anime = filteredSplitSongs.anime.sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          sortArray.reg = filteredSplitSongs.reg.sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          sortArray.indie = filteredSplitSongs.indie.sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          sortArray.vg = filteredSplitSongs.vg.sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          sortArray.tv = filteredSplitSongs.tv.sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          sortArray.lastTen = filteredSplitSongs.lastTen.sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          setSortHeader({ ...sortHeader, updated: false })
        } else {
          sortArray.pony = filteredSplitSongs.pony.sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          sortArray.anime = filteredSplitSongs.anime.sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          sortArray.reg = filteredSplitSongs.reg.sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          sortArray.indie = filteredSplitSongs.indie.sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          sortArray.vg = filteredSplitSongs.vg.sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          sortArray.tv = filteredSplitSongs.tv.sort((a, b) => {
            const nameA = a.updated_date, nameB = b.updated_date;
            return sortByDate(nameA, nameB, sortHeader.updated)
          })
          sortArray.lastTen = filteredSplitSongs.lastTen.sort((a, b) => {
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

        <input
          type="text"
          className="input is-info mb-5"
          placeholder="Search for songs.."
          onChange={searchSong}
        >
        </input>

        <span className="is-size-6 has-text-white is-italic">Last Updated: {splitSongs.pony[0] && moment(splitSongs.pony[0].updated_date).format("YYYY-MM-DD")}</span>
        {filteredSplitSongs.pony.length !== 0 &&
          <Button value={"pony"} onClick={openTable} label={"Pony Songs"} length={filteredSplitSongs.pony.length} />
        }
        {showTable.pony && filteredSplitSongs.pony.length !== 0 &&
          <Table sortTable={sortTable} upDown={sortHeader} songs={filteredSplitSongs.pony} openModal={openModal} />
        }
        <br />

        <span className="is-size-6 has-text-white is-italic">Last Updated: {splitSongs.anime[0] && moment(splitSongs.anime[0].updated_date).format("YYYY-MM-DD")}</span>
        {filteredSplitSongs.anime.length !== 0 &&
          <Button value={"anime"} onClick={openTable} label={"Anime / Japanese Songs"} length={filteredSplitSongs.anime.length} />
        }
        {showTable.anime && filteredSplitSongs.anime.length !== 0 &&
          <Table sortTable={sortTable} upDown={sortHeader} songs={filteredSplitSongs.anime} openModal={openModal} />
        }
        <br />

        <span className="is-size-6 has-text-white is-italic">Last Updated: {splitSongs.vg[0] && moment(splitSongs.vg[0].updated_date).format("YYYY-MM-DD")}</span>
        {filteredSplitSongs.vg.length !== 0 &&
          <Button value={"vg"} onClick={openTable} label={"Video Game Music"} length={filteredSplitSongs.vg.length} />
        }
        {showTable.vg && filteredSplitSongs.vg.length !== 0 &&
          <Table sortTable={sortTable} upDown={sortHeader} songs={filteredSplitSongs.vg} openModal={openModal} />
        }
        <br />

        <span className="is-size-6 has-text-white is-italic">Last Updated: {splitSongs.reg[0] && moment(splitSongs.reg[0].updated_date).format("YYYY-MM-DD")}</span>
        {filteredSplitSongs.reg.length !== 0 &&
          <Button value={"reg"} onClick={openTable} label={"Normie Music"} length={filteredSplitSongs.reg.length} />
        }
        {showTable.reg && filteredSplitSongs.reg.length !== 0 &&
          <Table sortTable={sortTable} upDown={sortHeader} songs={filteredSplitSongs.reg} openModal={openModal} />
        }
        <br />

        <span className="is-size-6 has-text-white is-italic">Last Updated: {splitSongs.indie[0] && moment(splitSongs.indie[0].updated_date).format("YYYY-MM-DD")}</span>
        {filteredSplitSongs.indie.length !== 0 &&
          <Button value={"indie"} onClick={openTable} label={"Indies"} length={filteredSplitSongs.indie.length} />
        }
        {showTable.indie && filteredSplitSongs.indie.length !== 0 &&
          <Table sortTable={sortTable} upDown={sortHeader} songs={filteredSplitSongs.indie} openModal={openModal} />
        }
        <br />

        <span className="is-size-6 has-text-white is-italic">Last Updated: {splitSongs.tv[0] && moment(splitSongs.indie[0].updated_date).format("YYYY-MM-DD")}</span>
        {filteredSplitSongs.tv.length !== 0 &&
          <Button value={"tv"} onClick={openTable} label={"TV / Cartoon Shows"} length={filteredSplitSongs.tv.length} />
        }
        {showTable.tv && filteredSplitSongs.tv.length !== 0 &&
          <Table sortTable={sortTable} upDown={sortHeader} songs={filteredSplitSongs.tv} openModal={openModal} />
        }

        <div className="mt-5">
          <div className="is-size-2 has-text-centered has-text-light">Last 10 Releases</div>
          <div className="is-size-6 has-text-centered has-text-white is-italic">Last Updated: {allSongs[0] && moment(allSongs[0].updated_date).format("YYYY-MM-DD")}</div>
          <hr />
          <Table sortTable={sortTable} upDown={sortHeader} songs={splitSongs.lastTen} openModal={openModal} />
        </div>

      </div>
    </section>
  );
}

export default Main;
