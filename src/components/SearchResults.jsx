import React from 'react';
import TrackList from './TrackList';

export default function SearchResults({tracks, onAdd}) {

  return (
    <>
      <div>
        <h2 className="results">Search Results</h2>
          <TrackList tracks={tracks} onAdd={onAdd}/>
      </div>
      
    </>
  )
};

