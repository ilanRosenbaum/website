import React from "react";

interface RestaurantData {
  Name: string;
  Price: string;
  "Inflation Adjusted Price": string;
  Link: string;
  Where: string;
  When: string;
  "Meal Type": string;
  "Value 0 - 10": string;
  "Food 0 - 50": string;
  "Vibes 0 - 20": string;
  "Service 0 - 10": string;
  "Location 0 -  5(Overall enjoyment of surrounding area, parking, walkability, ect)": string;
  "Bonus Points - Must have explanation": string;
  "Final Score": string;
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
    <table className="min-w-full bg-black border-collapse">
      <thead>
        <tr className="bg-gray-800 text-white">
          <th className="px-4 py-2 text-left whitespace-nowrap">Name</th>
          <th className="px-4 py-2 text-left whitespace-nowrap">When</th>
          <th className="px-4 py-2 text-left whitespace-nowrap">Meal</th>
          <th className="px-4 py-2 text-left whitespace-nowrap">Value</th>
          <th className="px-4 py-2 text-left whitespace-nowrap">Food</th>
          <th className="px-4 py-2 text-left whitespace-nowrap">Vibes</th>
          <th className="px-4 py-2 text-left whitespace-nowrap">Service</th>
          <th className="px-4 py-2 text-left whitespace-nowrap">Location</th>
          <th className="px-4 py-2 text-left whitespace-nowrap">Bonus</th>
          <th className="px-4 py-2 text-left whitespace-nowrap">Final Score</th>

          <th className="px-4 py-2 text-left whitespace-nowrap">Price</th>
          <th className="px-4 py-2 text-left whitespace-nowrap">
            Inflation Adj. Price
          </th>
          <th className="px-4 py-2 text-left whitespace-nowrap">Where</th>
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
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap">
              <a
                href={row.Link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {row.Name}
              </a>
            </td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap">
              {row.When}
            </td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap">
              {row["Meal Type"]}
            </td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap">
              {row["Value 0 - 10"]}
            </td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap">
              {row["Food 0 - 50"]}
            </td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap">
              {row["Vibes 0 - 20"]}
            </td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap">
              {row["Service 0 - 10"]}
            </td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap">
              {
                row[
                  "Location 0 -  5(Overall enjoyment of surrounding area, parking, walkability, ect)"
                ]
              }
            </td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap">
              {row["Bonus Points - Must have explanation"]}
            </td>
            <td className="px-4 py-2 border-t border-gray-700 font-bold whitespace-nowrap">
              {row["Final Score"]}
            </td>

            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap">
              {formatPrice(row.Price)}
            </td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap">
              {formatPrice(row["Inflation Adjusted Price"])}
            </td>
            <td className="px-4 py-2 border-t border-gray-700 whitespace-nowrap">
              {row.Where}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RestaurantTable;
