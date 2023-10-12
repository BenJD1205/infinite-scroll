import React from 'react'
/*
 * Define type of SearchProps
 */
type SearchProps = {
  onSearch: (e:any) => void;
}

/*
 * Search component is used search change value
 */
const Search: React.FC<SearchProps> = ({onSearch}) => {
  return (
    <div>
      <input className='input' type="text" onChange={onSearch} />
    </div>
  )
}

export default Search