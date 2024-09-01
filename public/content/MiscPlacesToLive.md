# To Live

## Cities

| City                | Walk Score | Bike Score | Transit Score | Snow       | Job Prospects | Nature (within 30 minutes) | Nature (within 2 hours) | Travel | Snow in/y | Jews    | Population | Avg   |
| ------------------- | ---------- | ---------- | ------------- | ---------- | ------------- | -------------------------- | ----------------------- | ------ | --------- | ------- | ---------- | ----- |
| Boston, MA          | 83         | 72         | 69            | enough     | good          | good                       | good                    | ideal  | 49.2      | vibrant | 675647     | 85.35 |
| San Francisco, CA   | 89         | 77         | 72            | not enough | ideal         | good                       | ideal                   | some   | 0         | vibrant | 808437     | 84.15 |
| Seattle, WA         | 74         | 60         | 71            | not enough | ideal         | ideal                      | ideal                   | some   | 6.3       | good    | 749256     | 81.05 |
| Denver, CO          | 61         | 45         | 72            | enough     | good          | ideal                      | ideal                   | none   | 56.5      | some    | 3000000    | 80.15 |
| Vancouver, Canada   | 80         | 74         | 79            | some       | good          | ideal                      | ideal                   | some   | 15        | some    | 675218     | 79.95 |
| Stockholm, Sweden   | 95         | 80         | 85            | enough     | ok            | ideal                      | good                    | some   | 40.4      | some    | 905184     | 79.25 |
| New York, NY        | 88         | 89         | 69            | some       | ideal         | bad                        | bad                     | some   | 29.8      | vibrant | 8300000    | 77.65 |
| Montreal, Canada    | 65         | 67         | 63            | enough     | ok            | good                       | good                    | none   | 82.5      | some    | 1870000    | 67.1  |
| Oslo, Norway        | 96         | 85         | 90            | enough     | ok            | bad                        | good                    | none   | 36        | none    | 634293     | 66.9  |
| Minneapolis, MN     | 71         | 55         | 83            | enough     | ok            | bad                        | ok                      | none   | 51.2      | good    | 425336     | 66.15 |
| Copenhagen, Denmark | 98         | 95         | 95            | not enough | ok            | ideal                      | bad                     | some   | 13        | none    | 600000     | 65.85 |
| Portland, OR        | 67         | 49         | 83            | not enough | ok            | ideal                      | ideal                   | none   | 4.5       | some    | 635067     | 62.55 |
| Madison, WI         | 89         | 63         | 87            | enough     | bad           | ok                         | bad                     | none   | 51.8      | some    | 269897     | 58.35 |

## Towns/Neighborhoods

| Neighborhood/Town      | City                | Walk Score | Bike Score | Transit Score | Snow   | Job Prospects | Nature (within 30 minutes) | Nature (within 2 hours) | Travel | Avg   |
| ---------------------- | ------------------- | ---------- | ---------- | ------------- | ------ | ------------- | -------------------------- | ----------------------- | ------ | ----- |
| Greenwich Village      | New York, NY        | 100        | 100        | 95            | some   | ideal         | bad                        | bad                     | ideal  | 86.25 |
| North End              | Boston, MA          | 99         | 99         | 86            | enough | good          | good                       | good                    | ideal  | 85.6  |
| Beacon Hill            | Boston, MA          | 99         | 100        | 72            | enough | good          | good                       | good                    | ideal  | 84.55 |
| Hoboken                | New York, NY        | 97         | 74         | 78            | some   | ideal         | bad                        | ok                      | ideal  | 83.95 |
| Capital Hill           | Denver, CO          | 94         | 60         | 96            | enough | good          | ideal                      | ideal                   | none   | 81.85 |
| International District | Seattle, WA         | 98         | 100        | 83            | none   | ideal         | bad                        | ideal                   | some   | 80.8  |
| Vesterbro              | Copenhagen, Denmark | 95         | 100        | 100           | none   | ok            | ideal                      | ok                      | some   | 77.25 |
| Frederiksberg          | Copenhagen, Denmark | 95         | 100        | 100           | none   | ok            | ideal                      | ok                      | some   | 77.25 |
| Østerbro               | Copenhagen, Denmark | 95         | 100        | 100           | none   | ok            | ideal                      | ok                      | some   | 77.25 |
| Pearl                  | Portland, OR        | 98         | 86         | 98            | none   | ok            | ideal                      | ideal                   | none   | 72.4  |

## Formulas

If you were wondering how the "avg" column was calculated, the formulas used are below. The formulas are based on things I care about in a place to live and thus are inherently subjective.

### City score

```js
const snow = row[4] === "enough" ? 20 : row[4] === "some" ? 10 : 0;
const nature30 = row[6] === "ideal" ? 10 : row[6] === "good" ? 7 : row[6] === "ok" ? 2 : 0;
const nature2 = row[7] === "ideal" ? 10 : row[7] === "good" ? 5 : row[7] === "ok" ? 2 : 0;
const travel = row[8] === "ideal" ? 5 : row[8] === "some" ? 3 : 0;
const jobs = row[5] === "ideal" ? 35 : row[5] === "good" ? 20 : row[5] === "ok" ? 10 : 0;
const walkScore = (row[1] / 100) * 15;
const bikeScore = (row[2] / 100) * 5;
const transitScore = (row[3] / 100) * 5;

return snow + nature30 + nature2 + travel + jobs + walkScore + bikeScore + transitScore;
```

### Town/Neighborhood score

```js
const city = row[1].split(",")[0]; // Extract the city name
const cityScore = cityScores[city] || { walkScore: 50, bikeScore: 50, transitScore: 50 }; // Default to 50 if city not found

const snow = row[5] === "enough" ? 20 : row[5] === "some" ? 10 : 0;
const nature30 = row[7] === "ideal" ? 10 : row[7] === "good" ? 7 : row[7] === "ok" ? 2 : 0;
const nature2 = row[8] === "ideal" ? 10 : row[8] === "good" ? 5 : row[8] === "ok" ? 2 : 0;
const travel = row[9] === "ideal" ? 5 : row[9] === "some" ? 3 : 0;
const jobs = row[6] === "ideal" ? 35 : row[6] === "good" ? 20 : row[6] === "ok" ? 10 : 0;

// Normalize walk, bike, and transit scores based on city scores
const normalizedWalkScore = (row[2] + cityScore.walkScore) / 200;
const normalizedBikeScore = (row[3] + cityScore.bikeScore) / 200;
const normalizedTransitScore = (row[4] + cityScore.transitScore) / 200;

const walkScore = normalizedWalkScore * 15;
const bikeScore = normalizedBikeScore * 5;
const transitScore = normalizedTransitScore * 5;

return snow + nature30 + nature2 + travel + jobs + walkScore + bikeScore + transitScore;
```
