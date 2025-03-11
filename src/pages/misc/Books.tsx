import React from "react";
import SortableTable, {
  TableColumn,
  SortMapping
} from "../../components/SortableTable";

/** Define the column configurations for the Books table */
const RANK_MAPPING: SortMapping = {
  favorite: 1,
  great: 2,
  good: 3,
  "didn't like": 4
};

const BOOKS_COLUMNS: ReadonlyArray<TableColumn> = [
  { header: "Title", accessor: "Title", sortable: true, sortType: "string" },
  {
    header: "Rank",
    accessor: "Rank",
    sortable: true,
    sortType: "custom",
    sortMapping: RANK_MAPPING,
    default: "asc"
  },
  {
    header: "Author(s)",
    accessor: "Author(s)",
    sortable: true,
    sortType: "string"
  },
  {
    header: "Date Finished",
    accessor: "Date Finished",
    sortable: true,
    sortType: "date",
    fallbackSort: true
  },
  { header: "Notes", accessor: "Notes", sortable: false }
];

const Books: React.FC = () => {
  return (
    <SortableTable
      source="/content/MiscBooks.md"
      backTo="/misc"
      backButtonFill="#603b61"
      textColor="#ffefdb"
      useWideContainer={true}
      columns={BOOKS_COLUMNS}
    />
  );
};

export default Books;
