import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBox = ({ value, onChange }: SearchBoxProps) => {
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
    className={css.input}
    type="text"
      placeholder="Search notes"
      value={value}
      onChange={handleInput}
    />
  );
};