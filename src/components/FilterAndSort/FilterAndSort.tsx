import style from "./FilterAndSort.module.css";

interface FilterAndSortProps {
  searchTarget: string;
  setSearchTarget: React.Dispatch<React.SetStateAction<string>>;
}

export default function FilterAndSort({
  searchTarget,
  setSearchTarget,
}: FilterAndSortProps) {
  const handleSearchTargetChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTarget(event.target.value);
  };

  return (
    <div className={style.container}>
      <div className={style.flex}>
        <label htmlFor="search">Search: </label>
        <input
          type="text"
          id="search"
          value={searchTarget}
          onChange={handleSearchTargetChange}
          placeholder="Search..."
          className={style.input}
        />
      </div>
      <div></div>
    </div>
  );
}
