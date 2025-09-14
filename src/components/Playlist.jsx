import React from 'react';
import TrackList from './TrackList';

export default function Playlist({tracks, name, onRemove, onChange, onSave}) {
  
  return (
    <>
      <div>
        <h2>Playlist</h2>
          <input className='new-list'
           type='text'
           placeholder='New Playlist'
           value={name}
           onChange={e=>onChange(e.target.value)}
           />
          <TrackList
           tracks={tracks}
           onRemove={onRemove} />
          <button onClick={onSave}>Save to Spotify</button>
    </div>

    </>
  )
};