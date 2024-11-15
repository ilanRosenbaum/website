```dataviewjs
// Add custom styles for the table
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
dv.el("div", style, { cls: "dataview-table" });

// **Scoring Mappings**
const snowScores = {
  "enough": 20,
  "some": 10,
  "not enough": 0
};
const nature30Scores = {
  "ideal": 10,
  "good": 7,
  "ok": 2,
  "bad": 0
};
const nature2Scores = {
  "ideal": 10,
  "good": 5,
  "ok": 2,
  "bad": 0
};
const travelScores = {
  "ideal": 5,
  "some": 3,
  "none": 0
};
const jobProspectsScores = {
  "ideal": 35,
  "good": 20,
  "ok": 10,
  "bad": 0
};

// **Functions to Calculate Averages**
const calculateCityAvg = (row) => {
  const snow = snowScores[row.snow] || 0;
  const nature30 = nature30Scores[row.nature30] || 0;
  const nature2 = nature2Scores[row.nature2] || 0;
  const travel = travelScores[row.travel] || 0;
  const jobs = jobProspectsScores[row.jobProspects] || 0;
  const walkScore = row.walkScore * 0.1;
  const bikeScore = row.bikeScore * 0.075;
  const transitScore = row.transitScore * 0.075;
  const foodScore = row.food * 0.2;
  const basketballScore = row.pickupBasketball * 0.1;
  const accelerationScore = row.acceleration * 0.1;

  return snow + nature30 + nature2 + travel + jobs + walkScore + bikeScore + transitScore + foodScore + basketballScore + accelerationScore;
};

const calculateNeighborhoodAvg = (row, cityScore) => {
  const snow = snowScores[cityScore.snow] || 0;
  const nature30 = nature30Scores[cityScore.nature30] || 0;
  const nature2 = nature2Scores[cityScore.nature2] || 0;
  const travel = travelScores[cityScore.travel] || 0;
  const jobs = jobProspectsScores[cityScore.jobProspects] || 0;
  const walkScore = row.walkScore * 0.1;
  const bikeScore = row.bikeScore * 0.075;
  const transitScore = row.transitScore * 0.075;
  const foodScore = cityScore.food * 0.2;
  const basketballScore = cityScore.pickupBasketball * 0.1;
  const accelerationScore = cityScore.acceleration * 0.1;

  return snow + nature30 + nature2 + travel + jobs + walkScore + bikeScore + transitScore + foodScore + basketballScore + accelerationScore;
};

// **City Headers and Data**
const cityHeaders = ["City", "Walk Score", "Bike Score", "Transit Score", "Snow", "Job Prospects", "Nature (within 30 minutes)", "Nature (within 2 hours)", "Travel", "Snow in/y", "Jews", "Population", "Food", "Pickup Basketball", "Acceleration", "Avg"];

const cityData = [
  {
    city: "Boston, MA",
    walkScore: 83,
    bikeScore: 72,
    transitScore: 69,
    snow: "enough",
    jobProspects: "good",
    nature30: "ok",
    nature2: "good",
    travel: "ideal",
    snowInY: 49.2,
    jews: "vibrant",
    population: 675647,
    food: (13 / 20) * 100,
    pickupBasketball: (9 / 10) * 100,
    acceleration: (7 / 10) * 100
  },
  {
    city: "San Francisco, CA",
    walkScore: 89,
    bikeScore: 77,
    transitScore: 72,
    snow: "not enough",
    jobProspects: "ideal",
    nature30: "good",
    nature2: "ideal",
    travel: "some",
    snowInY: 0,
    jews: "vibrant",
    population: 808437,
    food: (17 / 20) * 100,
    pickupBasketball: (8 / 10) * 100,
    acceleration: (-2 / 10) * 100
  },
  {
    city: "Seattle, WA",
    walkScore: 74,
    bikeScore: 60,
    transitScore: 71,
    snow: "not enough",
    jobProspects: "ideal",
    nature30: "good",
    nature2: "ideal",
    travel: "some",
    snowInY: 6.3,
    jews: "good",
    population: 749256,
    food: (14 / 20) * 100,
    pickupBasketball: (7 / 10) * 100,
    acceleration: (8 / 10) * 100
  },
  {
    city: "Denver, CO",
    walkScore: 61,
    bikeScore: 72,
    transitScore: 45,
    snow: "enough",
    jobProspects: "good",
    nature30: "ok",
    nature2: "ideal",
    travel: "none",
    snowInY: 56.5,
    jews: "some",
    population: 3000000,
    food: (10 / 20) * 100,
    pickupBasketball: (7 / 10) * 100,
    acceleration: (8 / 10) * 100
  },
  {
    city: "Vancouver, Canada",
    walkScore: 80,
    bikeScore: 74,
    transitScore: 79,
    snow: "some",
    jobProspects: "good",
    nature30: "good",
    nature2: "ideal",
    travel: "some",
    snowInY: 15,
    jews: "some",
    population: 675218,
    food: (15 / 20) * 100,
    pickupBasketball: (5 / 10) * 100,
    acceleration: (7 / 10) * 100
  },
  {
    city: "Stockholm, Sweden",
    walkScore: 95,
    bikeScore: 80,
    transitScore: 85,
    snow: "enough",
    jobProspects: "ok",
    nature30: "good",
    nature2: "ideal",
    travel: "some",
    snowInY: 40.4,
    jews: "some",
    population: 905184,
    food: (13 / 20) * 100,
    pickupBasketball: (2 / 10) * 100,
    acceleration: (6 / 10) * 100
  },
  {
    city: "New York, NY",
    walkScore: 88,
    bikeScore: 89,
    transitScore: 69,
    snow: "some",
    jobProspects: "good",
    nature30: "ok",
    nature2: "bad",
    travel: "some",
    snowInY: 29.8,
    jews: "vibrant",
    population: 8300000,
    food: (19 / 20) * 100,
    pickupBasketball: (10 / 10) * 100,
    acceleration: (4 / 10) * 100
  },
  {
    city: "Montreal, Canada",
    walkScore: 65,
    bikeScore: 67,
    transitScore: 63,
    snow: "enough",
    jobProspects: "ok",
    nature30: "good",
    nature2: "good",
    travel: "none",
    snowInY: 82.5,
    jews: "some",
    population: 1870000,
    food: (16 / 20) * 100,
    pickupBasketball: (5 / 10) * 100,
    acceleration: (8 / 10) * 100
  },
  {
    city: "Oslo, Norway",
    walkScore: 96,
    bikeScore: 85,
    transitScore: 90,
    snow: "enough",
    jobProspects: "ok",
    nature30: "ideal",
    nature2: "ideal",
    travel: "none",
    snowInY: 36,
    jews: "none",
    population: 634293,
    food: (12 / 20) * 100,
    pickupBasketball: (2 / 10) * 100,
    acceleration: (6 / 10) * 100
  },
  {
    city: "Minneapolis, MN",
    walkScore: 71,
    bikeScore: 55,
    transitScore: 83,
    snow: "enough",
    jobProspects: "ok",
    nature30: "ok",
    nature2: "ok",
    travel: "none",
    snowInY: 51.2,
    jews: "good",
    population: 425336,
    food: (9 / 20) * 100,
    pickupBasketball: (7 / 10) * 100,
    acceleration: (5 / 10) * 100
  },
  {
    city: "Copenhagen, Denmark",
    walkScore: 98,
    bikeScore: 95,
    transitScore: 95,
    snow: "not enough",
    jobProspects: "ok",
    nature30: "ideal",
    nature2: "good",
    travel: "some",
    snowInY: 13,
    jews: "none",
    population: 600000,
    food: (20 / 20) * 100,
    pickupBasketball: (2 / 10) * 100,
    acceleration: (5 / 10) * 100
  },
  {
    city: "Portland, OR",
    walkScore: 67,
    bikeScore: 49,
    transitScore: 83,
    snow: "not enough",
    jobProspects: "ok",
    nature30: "good",
    nature2: "ideal",
    travel: "none",
    snowInY: 4.5,
    jews: "some",
    population: 635067,
    food: (18 / 20) * 100,
    pickupBasketball: (7 / 10) * 100,
    acceleration: (4 / 10) * 100
  },
  {
    city: "Madison, WI",
    walkScore: 50,
    bikeScore: 66,
    transitScore: 35,
    snow: "enough",
    jobProspects: "bad",
    nature30: "ok",
    nature2: "bad",
    travel: "none",
    snowInY: 51.8,
    jews: "some",
    population: 269897,
    food: (5 / 20) * 100,
    pickupBasketball: (6 / 10) * 100,
    acceleration: (6 / 10) * 100
  }
];


// **Neighborhood Headers and Data**
const neighborhoodHeaders = ["Neighborhood/Town", "City", "Walk Score", "Bike Score", "Transit Score", "Snow", "Job Prospects", "Nature (within 30 minutes)", "Nature (within 2 hours)", "Travel", "Snow in/y", "Jews", "Population", "Food", "Pickup Basketball", "Acceleration", "Avg"];

const neighborhoodData = [
  {
    neighborhood: "Hoboken",
    city: "New York, NY",
    walkScore: 97,
    bikeScore: 74,
    transitScore: 78
  },
  {
    neighborhood: "Greenwich Village",
    city: "New York, NY",
    walkScore: 100,
    bikeScore: 100,
    transitScore: 95
  },
  {
    neighborhood: "Capital Hill",
    city: "Denver, CO",
    walkScore: 94,
    bikeScore: 60,
    transitScore: 96
  },
  {
    neighborhood: "Beacon Hill",
    city: "Boston, MA",
    walkScore: 99,
    bikeScore: 100,
    transitScore: 72
  },
  {
    neighborhood: "North End",
    city: "Boston, MA",
    walkScore: 99,
    bikeScore: 99,
    transitScore: 86
  },
  {
    neighborhood: "Østerbro",
    city: "Copenhagen, Denmark",
    walkScore: 95,
    bikeScore: 100,
    transitScore: 100
  },
  {
    neighborhood: "Frederiksberg",
    city: "Copenhagen, Denmark",
    walkScore: 95,
    bikeScore: 100,
    transitScore: 100
  },
  {
    neighborhood: "Vesterbro",
    city: "Copenhagen, Denmark",
    walkScore: 95,
    bikeScore: 100,
    transitScore: 100
  },
  {
    neighborhood: "International District",
    city: "Seattle, WA",
    walkScore: 98,
    bikeScore: 100,
    transitScore: 83
  },
  {
    neighborhood: "Pearl",
    city: "Portland, OR",
    walkScore: 98,
    bikeScore: 86,
    transitScore: 98
  }
];

// **Create a Mapping of City Scores for Quick Lookup**
const cityScores = {};
cityData.forEach(row => {
  cityScores[row.city] = row;
});

// **Process and Render City Data**
const processedCityData = cityData.map((row) => {
  const avg = calculateCityAvg(row);
  return { ...row, Avg: avg };
});

processedCityData.sort((a, b) => b.Avg - a.Avg);

const cityTableData = processedCityData.map((row) => [
  row.city,
  row.walkScore,
  row.bikeScore,
  row.transitScore,
  row.snow,
  row.jobProspects,
  row.nature30,
  row.nature2,
  row.travel,
  row.snowInY,
  row.jews,
  row.population,
  row.food,
  row.pickupBasketball,
  row.acceleration,
  row.Avg.toFixed(2)
]);

dv.el("h2", "Cities", { cls: "text-2xl font-bold" });
dv.el("div", dv.markdownTable(cityHeaders, cityTableData), { cls: "dataview-table" });

// **Process and Render Neighborhood Data**
const processedNeighborhoodData = neighborhoodData.map((row) => {
  const cityScore = cityScores[row.city] || {
    snow: "not enough",
    jobProspects: "bad",
    nature30: "bad",
    nature2: "bad",
    travel: "none",
    snowInY: 0,
    jews: "none",
    population: 0,
    food: 0,
    pickupBasketball: 0,
    acceleration: 0
  };
  const avg = calculateNeighborhoodAvg(row, cityScore);
  return {
    ...row,
    ...cityScore,
    Avg: avg
  };
});

processedNeighborhoodData.sort((a, b) => b.Avg - a.Avg);

const neighborhoodTableData = processedNeighborhoodData.map((row) => [
  row.neighborhood,
  row.city,
  row.walkScore,
  row.bikeScore,
  row.transitScore,
  row.snow,
  row.jobProspects,
  row.nature30,
  row.nature2,
  row.travel,
  row.snowInY,
  row.jews,
  row.population,
  row.food,
  row.pickupBasketball,
  row.acceleration,
  row.Avg.toFixed(2)
]);

dv.el("h2", "Towns/Neighborhoods", { cls: "text-2xl font-bold" });
dv.el("div", dv.markdownTable(neighborhoodHeaders, neighborhoodTableData), { cls: "dataview-table" });

```
## Formulas

If you were wondering how the "avg" column was calculated, the formulas used are below. The formulas are based on things I care about in a place to live and thus are inherently subjective.
### City score

```js
const scores = {
	snow: { enough: 20, some: 10, "not enough": 0 },
	nature30: { ideal: 10, good: 7, ok: 2, bad: 0 },
	nature2: { ideal: 10, good: 5, ok: 2, bad: 0 },
	travel: { ideal: 5, some: 3, none: 0 },
	jobProspects: { ideal: 35, good: 20, ok: 10, bad: 0 }
}

return (
	scores.snow[data.snow] +
	scores.nature30[data.nature30] +
	scores.nature2[data.nature2] +
	scores.travel[data.travel] +
	scores.jobProspects[data.jobProspects] +
	data.walkScore * 0.1 +
	data.bikeScore * 0.075 +
	data.transitScore * 0.075 +
	data.food * 0.2 +
	data.pickupBasketball * 0.1 +
	data.acceleration * 0.1
)
```

### Town/Neighborhood score

```js
const scores = {
	snow: { enough: 20, some: 10, "not enough": 0 },
	nature30: { ideal: 10, good: 7, ok: 2, bad: 0 },
	nature2: { ideal: 10, good: 5, ok: 2, bad: 0 },
	travel: { ideal: 5, some: 3, none: 0 },
	jobProspects: { ideal: 35, good: 20, ok: 10, bad: 0 }
}

return (
	scores.snow[cityData.snow] +
	scores.nature30[cityData.nature30] +
	scores.nature2[cityData.nature2] +
	scores.travel[cityData.travel] +
	scores.jobProspects[cityData.jobProspects] +
	neighborhood.walkScore * 0.1 +
	neighborhood.bikeScore * 0.075 +
	neighborhood.transitScore * 0.075 +
	cityData.food * 0.2 +
	cityData.pickupBasketball * 0.1 +
	cityData.acceleration * 0.1
)
```
