import React from 'react';
import './Track.css';

export default function Track({track, onAdd, onRemove}) {
  const handleClick= ()=>{
    onAdd(track);
    onRemove(track);
  };
  return (
    <>
    <div className="trackbox">
    <div className="trackname">
      <h3 className='track'>{track.name}</h3>
      <p>{track.artist} | {track.album}</p>
    </div>
      {onAdd && 
      <button onClick={()=>onAdd(track)}>+</button>}
      {onRemove && <button onClick={()=>onRemove(track)}>-</button>}
    </div>
    </>
  )
};
