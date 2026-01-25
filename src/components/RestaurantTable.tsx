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

interface RestaurantData {
  Name: string;
  Where: string;
  When: string;
  "Meal Type": string;
  "Final Score": string;
  "Inflation Adjusted Price": string;
  "Value 0 - 10": string;
  "Food 0 - 50": string;
  "Vibes 0 - 20": string;
  "Service 0 - 10": string;
  "Location 0 -  5(Overall enjoyment of surrounding area, parking, walkability, ect)": string;
  "Want To Return 0 - 10": string;
  "Bonus Points - Must have explanation": string;
  Link: string;
  "Original Price": string;
  Notes: string;
  "Why go back?": string;
  "If I go back, for what?": string;
}

interface CustomTableProps {
  data: RestaurantData[];
  fullWidth?: boolean;
}

const RestaurantTable: React.FC<CustomTableProps> = ({
  data,
  fullWidth = false
}) => {
  const formatPrice = (price: string) => {
    return "$" + price.replace(/^\$/, "");
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-black border-collapse text-xs sm:text-base">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Name</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Where</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">When</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Meal</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Score</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Adj. Price</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Value</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Food</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Vibes</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Service</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Location</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Return</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Bonus</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Orig. Price</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Notes</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Why Return?</th>
            <th className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap">Order What?</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0
                  ? "bg-gray-900 hover:bg-gray-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }
            >
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                <a
                  href={row.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {row.Name}
                </a>
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {row.Where}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {row.When}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {row["Meal Type"]}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap font-bold">
                {row["Final Score"]}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {formatPrice(row["Inflation Adjusted Price"])}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {row["Value 0 - 10"]}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {row["Food 0 - 50"]}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {row["Vibes 0 - 20"]}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {row["Service 0 - 10"]}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {row["Location 0 -  5(Overall enjoyment of surrounding area, parking, walkability, ect)"]}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {row["Want To Return 0 - 10"]}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {row["Bonus Points - Must have explanation"]}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {formatPrice(row["Original Price"])}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {row.Notes}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {row["Why go back?"]}
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 border-t border-gray-700 whitespace-nowrap">
                {row["If I go back, for what?"]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantTable;
