import { Criteria } from "../../types/types";
import style from "./FilterAndSort.module.css";

interface FilterAndSortProps {
  searchTarget: string;
  setSearchTarget: React.Dispatch<React.SetStateAction<string>>;
  sortCriteria: string;
  setSortCriteria: React.Dispatch<React.SetStateAction<keyof Criteria>>;
}

export default function FilterAndSort({
  searchTarget,
  setSearchTarget,
  sortCriteria,
  setSortCriteria,
}: FilterAndSortProps) {
  const handleSearchTargetChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTarget(event.target.value);
  };

  const handleSortCriteriaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSortCriteria(event.target.value as keyof Criteria);
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
      <div className={style.flex}>
        <label htmlFor="sortCriteria">Sort Criteria (Ascending order):</label>
        <select
          id="sortCriteria"
          value={sortCriteria}
          onChange={handleSortCriteriaChange}
          className={style.select}
        >
          <option value="name">name</option>
          <option value="size">size</option>
          <option value="dateModified">date modified</option>
          <option value="dateCreated">date created</option>
          <option value="extension">extension</option>
        </select>
      </div>
    </div>
  );
}
