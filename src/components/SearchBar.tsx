import type { ChangeEvent } from 'react';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Search city or country"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
