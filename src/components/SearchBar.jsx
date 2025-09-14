import {useState} from 'react';


function SearchBar ({onSearch}){
  const [term,setTerm] =useState('');

  function handleSubmit(e){
    e.preventDefault();
    if(!term.trim()) return;
    onSearch(term);
  }

    return (
    <>
      <form className="search" onSubmit={handleSubmit}>
        
          <input className="searchBar"
           type="text" 
           placeholder="Search your favorite"
           value={term}
           onChange={(e=>setTerm(e.target.value))}>
          </input>
          <button type='submit'>Search</button>
      </form>
      
    </>
  )
};

export default SearchBar;
