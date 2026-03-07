import { useState} from 'react';

export default function SearchBar() {


    const [query, setQuery] = useState('');

    return (
        <div className="sb-container">

            <form className='sb' 
             role='search'>
                    <input 
                        type='search'
                        className='input'
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}

                        placeholder='Search pages, keywords, events, etc.'
                        aria-label='Search Bar'
                    />

                    <button type='submit'
                            className='sb-button'>
                        SEARCH
                    </button>
             </form>


        </div>
    )



}