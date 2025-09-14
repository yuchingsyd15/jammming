import React,{useState,useEffect} from 'react';
import './App.css';
import SearchBar from'./components/SearchBar';
import SearchResults from'./components/SearchResults';
import Playlist from'./components/Playlist';
import Spotify from './components/Spotify';  


function App() {
  const [searchResults, setSearchResults]=useState([]);
  async function handleSearch(term){
     try {
     let tracks = await Spotify.search(term);
     setSearchResults(tracks)}
     catch (e) {
      console.error(e); 
      setSearchResults([]);
      }
     }

  
  
  const [playlistName, setPlaylistName]=useState('Workout Music')
  const [playlistTracks, setPlaylistTracks]=useState([]);
  
  useEffect(() => {
    Spotify.getAccessToken() // <-- call through the object
      .then(t => console.log('Token OK:', t?.slice(0, 8) + '…'))
      .catch(e => console.error('Auth error:', e));
  }, []);

 
  const addTrack = track => {
    setPlaylistTracks(prev=> prev.some(t=>t.id===track.id)?prev:[...prev, track]);
  };
    
  const handleRemove = track => {
    setPlaylistTracks(prev=>prev.filter(t=>t.id!==track.id));
  };

  const changePlaylistName = newName => {
    setPlaylistName (newName);
  };
  
  const savePlaylist = async()=>{
    const uriList = playlistTracks.map(track=>track.uri);
    if(!playlistName.trim()||uriList.length===0){
      alert('Add some tracks and name your playlist first');
      return
    }
    try {
      const {playlistUrl} = await Spotify.savePlaylist(playlistName.trim(),uriList);
    setPlaylistName('New list');
    setPlaylistTracks([]);
    window.open(playlistUrl, '_blank');
  }catch(e){
    console.error(e);
    alert(`Couldn't save playlist :${e.message}`)
  }
}

  return (
    <>
      <div className='main'>
        <h1>Jammming Search Bar</h1>
          <SearchBar onSearch={handleSearch}/>
          <SearchResults
           tracks={searchResults}
           onAdd={addTrack}/>
      </div>
      <div>
          <Playlist 
          name={playlistName} 
          tracks={playlistTracks}
          onRemove={handleRemove}
          onChange={changePlaylistName}
          onSave={savePlaylist}
          />

      </div>

    </>
  )
};

export default App;