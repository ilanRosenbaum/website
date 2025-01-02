# Visited
```dataviewjs
// Define the headers for the table
const headers = ["City and Country", "Want to Return (comparative rank - lower better)", "Enjoyment (0/10) - avg of visits", ];

// Define the data for the table with [[ ]] removed from the city names and city and country combined into one column
const data = [
  [
    "Copenhagen, Denmark",
    2,
    9
  ],
  [
    "Amsterdam, Netherlands",
    3,
    6
  ],
  [
    "Lyon, France",
    1,
    9
  ],
  [
    "Girona, Spain",
    5,
    6
  ],
  [
    "Barcelona, Spain",
    5,
    7
  ],
  [
    "Charlotte, NC, United States",
    6,
    6
  ],
  [
    "Orlando, FL, United States",
    20,
    0
  ],
  [
    "Cologne, Germany",
    8,
    8
  ],
  [
    "Paris, France",
    7,
    6
  ],
  [
    "Bend, OR, United States",
    5,
    2
  ],
  [
    "Vidanta, Nuevo Vallarta, Mexico",
    20,
    1
  ],
  [
    "Yosemite, CA, United States",
    2,
    9
  ],
  [
    "Boston, MA, United States",
    3,
    5
  ],
  [
    "Burlington, VT, United States",
    5,
    2
  ],
  [
    "Clinton, NY, United States",
    10,
    3
  ],
  [
    "Twin Cities, MN, United States",
    9,
    2
  ],
  [
    "Las Vegas, NV, United States",
    5,
    7
  ],
  [
    "Chicago, IL, United States",
    6,
    8
  ],
  [
    "Myrtle Beach, SC, United States",
    8,
    8
  ],
  [
    "New York, NY, United States",
    2,
    8
  ],
  [
    "Niagara Falls, NY, United States",
    10,
    5
  ],
  [
    "Montreal, Canada",
    6,
    4
  ],
  [
    "Fez, Morocco",
    4,
    7
  ],
  [
    "Marakesh, Morocco",
    4,
    7
  ],
  [
    "Sahara Desert, Morocco",
    7,
    6
  ],
  [
    "Davis, CA, United States",
    5,
    6
  ],
  [
    "Sacramento, CA, United States",
    10,
    5
  ],
  [
    "Lake Tahoe, CA, United States",
    4,
    7
  ]
];

// Sort the data based on "Want to Return" (lower first) and "Enjoyment" (higher first) as tiebreaker
data.sort((a, b) => {
  if (a[1] !== b[1]) {
    return a[1] - b[1]; // Sort by "Want to Return" (lower first)
  } else {
    return b[2] - a[2]; // If "Want to Return" is the same, sort by "Enjoyment" (higher first)
  }
});

// Add custom styles for dividers
const style = `
  <style>
    table.dataview-table {
      border-collapse: collapse;
      width: 100%;
    }
    table.dataview-table th, table.dataview-table td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    table.dataview-table th {
      background-color: #f2f2f2;
      text-align: left;
    }
  </style>
`;

// Render the style and table
dv.el("div", style + dv.markdownTable(headers, data), { cls: "dataview-table" });


```