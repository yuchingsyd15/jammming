import React from 'react';
import TrackList from './TrackList';
import './PlayList.css';

export default function Playlist({tracks, name, onRemove, onChange, onSave}) {
  
  return (
    <>
      <div className="playlist-card">
        <div className="playlistcard-header">
          <h2>Create Your New Playlist</h2>
        </div>
        <div className='new-list-box'>
          <input className='new-list'
           type='text'
           placeholder='New Playlist'
           value={name}
           onChange={e=>onChange(e.target.value)}
           />
          <button onClick={onSave}>Save to Spotify</button>
        </div>
        <div className="list">
          <TrackList
           tracks={tracks}
           onRemove={onRemove} />
        </div>
        
        
    </div>

    </>
  )
};