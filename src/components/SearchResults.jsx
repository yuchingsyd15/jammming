import React from 'react';
import TrackList from './TrackList';
import './SearchResults.css';

export default function SearchResults({tracks, onAdd}) {

  return (
    <>
      <div className="result-card">
        <div className="resultCard-header">
          <h2 className="searchResults">Search Results</h2>
        </div>
         <div className="list">
          <TrackList tracks={tracks} onAdd={onAdd}/>
         </div>
      </div>
      
    </>
  )
};

