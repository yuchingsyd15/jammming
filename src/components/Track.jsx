import React from 'react';

export default function Track({track, onAdd, onRemove}) {
  const handleClick= ()=>{
    onAdd(track);
    onRemove(track);
  };
  return (
    <>
      <h3 className='track'>{track.name}</h3>
      <p>{track.artist} | {track.album}</p>
      {onAdd && 
      <button onClick={()=>onAdd(track)}>+</button>}
      {onRemove && <button onClick={()=>onRemove(track)}>-</button>}
    
    </>
  )
};
