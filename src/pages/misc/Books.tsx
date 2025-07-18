/*
Ilan's Website
Copyright (C) 2024-2025 ILAN ROSENBAUM

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";
import SortableTable, {
  TableColumn,
  SortMapping
} from "../../components/SortableTable";

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
