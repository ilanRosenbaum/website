/*
Ilan's Website
Copyright (C) 2024-2026 ILAN ROSENBAUM

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import SierpinskiHexagon from "../../components/SierpinskiHexagon";
import SortableTable, { TableColumn } from "../../components/SortableTable";

const sharedConfig = {
  targetLevels: {
    right: 3,
    bottomRight: 3,
    bottomLeft: 0,
    left: 3,
    topLeft: 3,
    topRight: 0
  },
  styles: {
    default: {
      fill: "#603b61",
      opacity: 1.0
    }
  },
  images: {}
};

export const appConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {
    default: () => {
      window.location.href = "/rooms";
    }
  },
  images: sharedConfig.images,
  text: {},
  backButton: {
    exists: false
  }
};

const pageConfig = {
  targetLevels: sharedConfig.targetLevels,
  styles: sharedConfig.styles,
  actions: {},
  images: sharedConfig.images,
  text: {
    1: "Lived",
    2: "To Live",
    3: "",
    4: "Visited",
    5: "To Visit",
    6: ""
  },
  title: "Places",
  titleSize: "4vw",
  backButton: {
    exists: true,
    to: "/leaderboards",
    fill: "#603b61"
  }
};

const Places: React.FC = () => {
  const navigate = useNavigate();

  pageConfig.actions = {
    default: (hexagonId: number) => {
      alert(`Hexagon ${hexagonId} clicked!`);
    },
    left: () => {
      navigate("/leaderboards/places/visited");
    },
    topLeft: () => {
      navigate("/leaderboards/places/toVisit");
    },
    bottomRight: () => {
      navigate("/leaderboards/places/toLive");
    },
    right: () => {
      navigate("/leaderboards/places/lived");
    }
  };
  return <SierpinskiHexagon config={pageConfig} />;
};

export default Places;

const VISITED_COLUMNS: ReadonlyArray<TableColumn> = [
  { header: "City and Country", accessor: "CityAndCountry", sortable: false },
  {
    header: "Want to Return",
    accessor: "WantToReturn",
    sortable: true,
    sortType: "number",
    default: "asc" // Higher numbers first
  },
  {
    header: "Enjoyment",
    accessor: "Enjoyment",
    sortable: true,
    sortType: "number",
    fallbackSort: true // Break ties by enjoyment
  }
];

const Visited: React.FC = () => {
  return (
    <SortableTable
      source="/content/PlacesVisited.md"
      backTo="/leaderboards/places"
      backButtonFill="#603b61"
      textColor="#ffefdb"
      useWideContainer={true}
      columns={VISITED_COLUMNS}
    />
  );
};

/** Define the column configurations for the To Visit table */
const TOVISIT_COLUMNS: ReadonlyArray<TableColumn> = [
  { header: "City", accessor: "City", sortable: false },
  { header: "Country", accessor: "Country", sortable: false },
  {
    header: "Priority",
    accessor: "Priority",
    sortable: true,
    sortType: "number",
    default: "asc" // Higher priority first
  },
  { header: "Why", accessor: "Why", sortable: false }
];

const ToVisit: React.FC = () => {
  return (
    <SortableTable
      source="/content/PlacesToVisit.md"
      backTo="/leaderboards/places"
      backButtonFill="#603b61"
      textColor="#ffefdb"
      useWideContainer={true}
      columns={TOVISIT_COLUMNS}
    />
  );
};

/** Define the column configurations for the Lived table */
const LIVED_COLUMNS: ReadonlyArray<TableColumn> = [
  { header: "City", accessor: "City", sortable: false },
  { header: "Country", accessor: "Country", sortable: false },
  { header: "Pros", accessor: "Duration", sortable: false },
  { header: "Cons", accessor: "Cons", sortable: false }
];

const Lived: React.FC = () => {
  return (
    <SortableTable
      source="/content/PlacesLived.md"
      backTo="/leaderboards/places"
      backButtonFill="#603b61"
      textColor="#ffefdb"
      useWideContainer={true}
      columns={LIVED_COLUMNS}
    />
  );
};

export { Visited, ToVisit, Lived };
