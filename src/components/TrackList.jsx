import React from 'react';
import Track from './Track';

export default function TrackList({tracks=[],onAdd,onRemove}) {
  
  return (
    <>
      <h2 className='trackList'>Track List</h2>
      {tracks.map(t=> 
        <Track 
        key={t.id}
        track={t}
        onAdd={onAdd}
        onRemove={onRemove}
        />
      )}
    </>
  )
};
