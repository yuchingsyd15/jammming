import {useState} from 'react';
import './SearchBar.css';

function SearchBar ({onSearch}){
  const [term,setTerm] =useState('');

  function handleSubmit(e){
    e.preventDefault();
    if(!term.trim()) return;
    onSearch(term);
  }

    return (
    <>
    <div className="search">
      <form onSubmit={handleSubmit}>
        
          <input className="searchBar"
           type="text" 
           placeholder="What do you want to listen?"
           value={term}
           onChange={(e=>setTerm(e.target.value))}>
          </input>
          <button type='submit'>Search</button>
      </form>
    </div>
    </>
  )
};

export default SearchBar;
