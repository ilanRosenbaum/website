import React from 'react';

const Toliveraw = () => {
// Data
  const communityData = [
    {
      city: "Copenhagen, Denmark",
      score: "vibrant",
      details: "Extensive community gardens, strong co-op culture, year-round markets, innovative community spaces",
      highlights: "Christiania free town, numerous housing co-ops, strong cycling community"
    },
    {
      city: "Portland, OR",
      score: "vibrant",
      details: "Lots of community gardens, People's Food Co-op, Alberta Cooperative Grocery",
      highlights: "Strong DIY culture, tool libraries, community workshops"
    },
    {
      city: "Minneapolis, MN",
      score: "vibrant",
      details: "Extensive co-op network, multiple year-round farmers markets",
      highlights: "Strong food co-op presence, winter markets, Midtown Global Market"
    },
    {
      city: "Vancouver, Canada",
      score: "active",
      details: "Lots of community gardens, multiple farmers markets",
      highlights: "Community garden network, strong neighborhood houses, Vancouver Farmers Markets"
    },
    {
      city: "Seattle, WA",
      score: "active",
      details: "Lots of community gardens (P-Patch), multiple year-round markets",
      highlights: "P-Patch program, PCC Community Markets, Capitol Hill Urban Farm"
    },
    {
      city: "Montreal, Canada",
      score: "active",
      details: "Lots of community gardens, strong market culture",
      highlights: "Jean-Talon Market, extensive community centers, Atwater Market"
    },
    {
      city: "Stockholm, Sweden",
      score: "active",
      details: "Allotment garden tradition, active community centers",
      highlights: "Allotment gardens, community houses (kommunhus)"
    },
    {
      city: "Oslo, Norway",
      score: "active",
      details: "Parsellhager (allotment gardens), community houses",
      highlights: "Strong neighborhood associations, Oslo Farmers Market"
    },
    {
      city: "Boston, MA",
      score: "moderate",
      details: "Some community gardens, seasonal markets",
      highlights: "Boston Food Co-op, active community centers, SoWa Open Market"
    },
    {
      city: "San Francisco, CA",
      score: "moderate",
      details: "Some community gardens, multiple farmers markets",
      highlights: "Rainbow Grocery Cooperative, People's Grocery, Mission Community Market"
    },
    {
      city: "New York, NY",
      score: "vibrant",
      details: "550+ community gardens but spread thin given population",
      highlights: "GreenThumb program, Park Slope Food Coop, Union Square Greenmarket"
    },
    {
      city: "Denver, CO",
      score: "moderate",
      details: "Multiple community gardens, seasonal markets",
      highlights: "Denver Urban Gardens network, Denver Farmers Market"
    },
    {
      city: "Madison, WI",
      score: "moderate",
      details: "Lots of community gardens, seasonal markets. Strong community in small subsets of madison which is itself already a small city.",
      highlights: "Willy Street Co-op, decent garden network, Dane County Farmers Market"
    }
  ];

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
      community: communityData.find((row) => row.city === "Boston, MA").score,
      population: 675647,
      food: (13 / 20) * 100,
      pickupBasketball: (9 / 10) * 100,
      acceleration: (7 / 10) * 100 // 70
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
      community: communityData.find((row) => row.city === "San Francisco, CA").score,
      population: 808437,
      food: (17 / 20) * 100,
      pickupBasketball: (8 / 10) * 100,
      acceleration: (-2 / 10) * 100 // -20
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
      community: communityData.find((row) => row.city === "Seattle, WA").score,
      population: 749256,
      food: (14 / 20) * 100,
      pickupBasketball: (7 / 10) * 100,
      acceleration: (8 / 10) * 100 // 80
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
      community: communityData.find((row) => row.city === "Denver, CO").score,
      population: 3000000,
      food: (10 / 20) * 100,
      pickupBasketball: (7 / 10) * 100,
      acceleration: (8 / 10) * 100 // 80
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
      community: communityData.find((row) => row.city === "Vancouver, Canada").score,
      population: 675218,
      food: (15 / 20) * 100,
      pickupBasketball: (5 / 10) * 100,
      acceleration: (7 / 10) * 100 // 70
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
      community: communityData.find((row) => row.city === "Stockholm, Sweden").score,
      population: 905184,
      food: (13 / 20) * 100,
      pickupBasketball: (2 / 10) * 100,
      acceleration: (6 / 10) * 100 // 60
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
      community: communityData.find((row) => row.city === "New York, NY").score,
      population: 8300000,
      food: (19 / 20) * 100,
      pickupBasketball: (10 / 10) * 100,
      acceleration: (4 / 10) * 100 // 40
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
      community: communityData.find((row) => row.city === "Montreal, Canada").score,
      population: 1870000,
      food: (16 / 20) * 100,
      pickupBasketball: (5 / 10) * 100,
      acceleration: (8 / 10) * 100 // 80
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
      community: communityData.find((row) => row.city === "Oslo, Norway").score,
      population: 634293,
      food: (12 / 20) * 100,
      pickupBasketball: (2 / 10) * 100,
      acceleration: (6 / 10) * 100 // 60
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
      community: communityData.find((row) => row.city === "Minneapolis, MN").score,
      population: 425336,
      food: (9 / 20) * 100,
      pickupBasketball: (7 / 10) * 100,
      acceleration: (5 / 10) * 100 // 50
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
      community: communityData.find((row) => row.city === "Copenhagen, Denmark").score,
      population: 600000,
      food: (20 / 20) * 100,
      pickupBasketball: (2 / 10) * 100,
      acceleration: (5 / 10) * 100 // 50
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
      community: communityData.find((row) => row.city === "Portland, OR").score,
      population: 635067,
      food: (18 / 20) * 100,
      pickupBasketball: (7 / 10) * 100,
      acceleration: (4 / 10) * 100 // 40
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
      community: communityData.find((row) => row.city === "Madison, WI").score,
      population: 269897,
      food: (5 / 20) * 100,
      pickupBasketball: (6 / 10) * 100,
      acceleration: (6 / 10) * 100 // 60
    }
  ];

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
    },
    {
      neighborhood: "Downtown",
      city: "Madison, WI",
      walkScore: 92,
      bikeScore: 91,
      transitScore: 55
    }
  ];

  // Data Headers
  const cityHeaders = [
    "City",
    "Walk Score",
    "Bike Score",
    "Transit Score",
    "Snow",
    "Job Prospects",
    "Nature (within 30 minutes)",
    "Nature (within 2 hours)",
    "Travel",
    "Snow in/y",
    "Community Score",
    "Population",
    "Food",
    "Pickup Basketball",
    "Acceleration",
    "Avg"
  ];
  const neighborhoodHeaders = ["Neighborhood/Town", "City", "Walk Score", "Bike Score", "Transit Score", "Avg"];
  const communityHeaders = ["City", "Score", "Details", "Key Highlights"];

  // Score Mappings
  const categoryWeights = {
    // Static Categories
    snow: {
      weight: 15,
      type: "static",
      mapping: { enough: 15, some: 8, "not enough": 0 }
    },
    nature30: {
      weight: 20,
      type: "static",
      mapping: { ideal: 20, good: 14, ok: 4, bad: 0 }
    },
    nature2: {
      weight: 15,
      type: "static",
      mapping: { ideal: 15, good: 8, ok: 3, bad: 0 }
    },
    travel: {
      weight: 5,
      type: "static",
      mapping: { ideal: 5, some: 3, none: 0 }
    },
    jobProspects: {
      weight: 35,
      type: "static",
      mapping: { ideal: 35, good: 20, ok: 10, bad: 0 }
    },
    community: {
      weight: 15,
      type: "static",
      mapping: { vibrant: 15, active: 10, moderate: 5, limited: 0 }
    },

    // Dynamic Categories
    walkScore: { weight: 20, type: "dynamic", max: 100 },
    bikeScore: { weight: 10, type: "dynamic", max: 100 },
    transitScore: { weight: 10, type: "dynamic", max: 100 },
    food: { weight: 20, type: "dynamic", max: 100 },
    pickupBasketball: { weight: 10, type: "dynamic", max: 100 },
    acceleration: { weight: 10, type: "dynamic", max: 100 }
  };

  // Max possible score
  const maxScore = Object.values(categoryWeights)
    .map((details) => details.weight)
    .reduce((acc, curr) => acc + curr, 0); // 165

  // List of dynamic categories that require half weighting from neighborhood and half from city
  const halfWeightedDynamicCategories = ["walkScore", "bikeScore", "transitScore"];

  // **Create a Mapping from City to Community Score**
  const communityScoreMapping = {};
  communityData.forEach((row) => {
    const category = "community";
    if (categoryWeights[category].type === "static") {
      communityScoreMapping[row.city] = categoryWeights[category].mapping[row.score] || 0;
    }
  });

  // **Create a Mapping of City Scores for Quick Lookup**
  const cityScores = {};
  cityData.forEach((row) => {
    cityScores[row.city] = row;
  });

  // **Functions to Calculate Averages**
  const calculateCityAvg = (row) => {
    let sum = 0;

    Object.entries(categoryWeights).forEach(([category, details]) => {
      if (details.type === "static") {
        if (category === "community") {
          sum += communityScoreMapping[row.city] || 0;
        } else {
          sum += details.mapping[row[category]] || 0;
        }
      } else if (details.type === "dynamic") {
        const rawScore = row[category] || 0;
        const normalizedScore = (rawScore / details.max) * details.weight;
        sum += normalizedScore;
      }
    });

    return (sum / maxScore) * 100;
  };

  const calculateNeighborhoodAvg = (row, cityScore) => {
    let sum = 0;

    Object.entries(categoryWeights).forEach(([category, details]) => {
      if (details.type === "static") {
        sum += details.mapping[cityScore[category]] || 0;
      } else if (details.type === "dynamic") {
        if (halfWeightedDynamicCategories.includes(category)) {
          const neighborhoodScore = row[category] || 0;
          const cityDynamicScore = cityScore[category] || 0;

          const normalizedNeighborhoodScore = (neighborhoodScore / details.max) * (details.weight / 2);
          const normalizedCityScore = (cityDynamicScore / details.max) * (details.weight / 2);

          sum += normalizedNeighborhoodScore + normalizedCityScore;
        } else {
          const cityDynamicScore = cityScore[category] || 0;
          const normalizedCityScore = (cityDynamicScore / details.max) * details.weight;
          sum += normalizedCityScore;
        }
      }
    });

    return (sum / maxScore) * 100;
  };

  // **Process and Sort City Data**
  const processedCityData = cityData
    .map((row) => {
      const avg = calculateCityAvg(row);
      return { ...row, Avg: avg };
    })
    .sort((a, b) => b.Avg - a.Avg);

  // **Process and Sort Neighborhood Data**
  const processedNeighborhoodData = neighborhoodData
    .map((row) => {
      const cityScore = cityScores[row.city] || {
        snow: "not enough",
        jobProspects: "bad",
        nature30: "bad",
        nature2: "bad",
        travel: "none",
        snowInY: 0,
        community: "limited",
        population: 0,
        food: 0,
        pickupBasketball: 0,
        acceleration: 0
      };
      const avg = calculateNeighborhoodAvg(row, cityScore);
      return {
        ...row,
        Avg: avg
      };
    })
    .sort((a, b) => b.Avg - a.Avg);

  // **Sort Community Data by Score**
  const scoreMap = { vibrant: 3, active: 2, moderate: 1, limited: 0 };
  const sortedCommunityData = [...communityData].sort((a, b) => scoreMap[b.score] - scoreMap[a.score]);

  // **Utility Function to Render Tables**
  const renderTable = (headers, data) => (
    <table className="table">
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} className="text-left border-b border-gray-700 font-sans text-white max-w-[40ch]">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr key={rowIdx} className="border-t border-gray-700 font-sans text-white break-words max-w-[40ch]">
            {row.map((cell, cellIdx) => (
              <td key={cellIdx}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  // **Define Category Weightings for Percentage Tables**

  // Calculate sorted categories for City Score
  const sortedCategoriesCity = Object.entries(categoryWeights)
    .map(([category, details]) => {
      const percentage = ((details.weight / maxScore) * 100).toFixed(2);
      return {
        category,
        percentage
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  // Calculate sorted categories for Town/Neighborhood Score with separate entries for City and Neighborhood contributions
  const sortedCategoriesNeighborhood = Object.entries(categoryWeights)
    .flatMap(([category, details]) => {
      if (halfWeightedDynamicCategories.includes(category)) {
        return [
          {
            category: `${category} (Neighborhood)`,
            percentage: ((details.weight / 2 / maxScore) * 100).toFixed(2)
          },
          {
            category: `${category} (City)`,
            percentage: ((details.weight / 2 / maxScore) * 100).toFixed(2)
          }
        ];
      } else {
        return [
          {
            category,
            percentage: ((details.weight / maxScore) * 100).toFixed(2)
          }
        ];
      }
    })
    .sort((a, b) => b.percentage - a.percentage);

  // **Helper Function to Convert Category Keys to Readable Names**
  const getReadableCategory = (key) => {
    const mapping = {
      "walkScore": "Walk Score",
      "walkScore (Neighborhood)": "Walk Score (Neighborhood)",
      "walkScore (City)": "Walk Score (City)",
      "bikeScore": "Bike Score",
      "bikeScore (Neighborhood)": "Bike Score (Neighborhood)",
      "bikeScore (City)": "Bike Score (City)",
      "transitScore": "Transit Score",
      "transitScore (Neighborhood)": "Transit Score (Neighborhood)",
      "transitScore (City)": "Transit Score (City)",
      snow: "Snow",
      nature30: "Nature (within 30 minutes)",
      nature2: "Nature (within 2 hours)",
      travel: "Travel",
      jobProspects: "Job Prospects",
      community: "Community Score",
      food: "Food",
      pickupBasketball: "Pickup Basketball",
      acceleration: "Acceleration"
    };
    return mapping[key] || key;
  };

  return (
    <div className="pt-14 markdown-container-wide h-full overflow-auto">
      <h1 className="text-3xl font-mono text-[#ffebcd] font-bold mb-4">To Live</h1>

      {/* **Cities Table** */}
      <h2 className="text-2xl font-mono text-[#ffebcd] font-semibold mt-8 mb-4">Cities</h2>
      {renderTable(
        cityHeaders,
        processedCityData.map((row) => [
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
          row.community,
          row.population.toLocaleString(),
          row.food,
          row.pickupBasketball,
          row.acceleration,
          row.Avg.toFixed(2)
        ])
      )}

      {/* **Towns/Neighborhoods Table** */}
      <h2 className="text-2xl font-mono text-[#ffebcd] font-semibold mt-8 mb-4">Towns/Neighborhoods</h2>
      {renderTable(
        neighborhoodHeaders,
        processedNeighborhoodData.map((row) => [row.neighborhood, row.city, row.walkScore, row.bikeScore, row.transitScore, row.Avg.toFixed(2)])
      )}

      {/* **Community Score Details Table** */}
      <h2 className="text-2xl font-mono text-[#ffebcd] font-semibold mt-8 mb-4">Community Score Details</h2>
      {renderTable(
        communityHeaders,
        sortedCommunityData.map((row) => [row.city, row.score, row.details, row.highlights])
      )}

      {/* **Score Weightings Tables** */}
      <div style={{ marginTop: "2rem" }}>
        <h2 className="text-2xl font-mono text-[#ffebcd] font-semibold mt-8 mb-4">Score Weightings</h2>

        {/* **City Score Weightings** */}
        <h3 className="text-xl font-mono text-[#ffebcd] font-semibold mt-6 mb-2">City Score</h3>
        {renderTable(
          ["Category", "Percentage of Final Score"],
          sortedCategoriesCity.map((item) => [getReadableCategory(item.category), `${item.percentage}%`])
        )}

        {/* **Town/Neighborhood Score Weightings** */}
        <h3 className="text-xl font-mono text-[#ffebcd] font-semibold mt-6 mb-2">Town/Neighborhood Score</h3>
        {renderTable(
          ["Category", "Percentage of Final Score"],
          sortedCategoriesNeighborhood.map((item) => [getReadableCategory(item.category), `${item.percentage}%`])
        )}
      </div>
    </div>
  );
};

export default Toliveraw;