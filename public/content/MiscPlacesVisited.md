# Visited
```dataviewjs
// Define the headers for the table
const headers = ["City and Country", "Want to Return (comparative rank - lower better)", "Enjoyment (0/10) - avg of visits", "Notes"];

// Define the data for the table with [[ ]] removed from the city names and city and country combined into one column
const data = [
  ["Copenhagen, Denmark", 2, 9, "Great food, very pretty, holy hell is it walkable and bikeable. Great public transit. Expensive. So much to do. Me and katrina had a great time. Living together was kinda difficult at times, only reason enjoyment wasn't a 10."],
  ["Amsterdam, Netherlands", 3, 6, "Mediocre food. Very pretty. Insanely walkable/bike able. Insanely good transit. Expensive. Very touristy. Should have explored farther from the city centre, will do that if I go back. I had a good time but I feel like I went to the wrong places/did wrong things."],
  ["Lyon, France", 1, 9, "Incredible food. Nice people. Super pretty. Very walkable. Transit so good I could use it even though I don't speak french at all. I'd rather not live in a hostel, beyond that, no complaints."],
  ["Girona, Spain", 5, 6, "Pretty, walkable, bike able, good pastries and coffee. Kinda feels like expat land + Catalonia which is a weird vibe that I don't love. Not a huge biker and it's a biking town. But still a super nice place to be. Docked enjoyment points because I was so sad."],
  ["Barcelona, Spain", 5, 7, "Mostly just drank, smoked weed, and partied while I was there. It was fun. I don't particularly want to do that again though. Good food, very cheap."],
  ["Charlotte, NC, United States", 6, 6, "I love visiting my aunt/uncle even though we don't get along as well as we used to. Part of growing up. Nice neighborhood but not very walkable and transit is shit. Restaurants similar in quality to Madison."],
  ["Orlando, FL, United States", 20, 0, "I don't like fighting with my mother or Disney world and those are the only two things I have memories of. I have literally no reason to go back here."],
  ["Cologne, Germany", 8, 8, "Fine place, happy I went to visit Kevin. Had a great time getting drunk and talking to G but that has nothing to do with Cologne itself hence high enjoyment low WTR."],
  ["Paris, France", 7, 6, "The tourist shit is cool but also oh my god is it tourist which isn't really my thing. Had a great time one of the nights, but it's positives were the same as Lyon but it was more expensive and worse in a ton of ways. Very dirty."],
  ["Bend, OR, United States", 5, 2, "Incredibly pretty. Want to go back just for the nature. Small town, mostly rednecks and Bay Area remote workers. Great nature, that seems like mostly it."],
  ["Vidanta, Nuevo Vallarta, Mexico", 20, 1, "Free food and alcohol is nice? The food is mid the people are all Americans the rooms are very nice the being with my family is terrible. My mother needs to learn therapy is an important part of living a stable life and not a weapon to be used against her children when she feels insecure."],
  ["Yosemite, CA, United States", 2, 9, "Pretties place I've ever been."],
  ["Boston, MA, United States", 3, 5, "Very walkable. Shit trains. Good food. Enjoyed being there. Want to go back mostly tied to wanting to live there so I want to see more of the city"],
  ["Burlington, VT, United States", 5, 2, "Very pretty. Cool socialist vibes. Very walkable. Didn't really see much of the campus/area cause was only there for one night but it seems like a place I'd love to spend more time. Sleeping on a couch with a flag as a blanket sucks so low enjoyment. Also at this point in the trip I was just fucking exhausted so terrible sleep sucked."],
  ["Clinton, NY, United States", 10, 3, "It was nice seeing Taylor. No reason to visit other than seeing him and I don't really want to do that that badly right now. Besides seeing him it's just a random small town in upstate NY. Wouldn't hate being there but also see no reason to go."],
  ["Twin Cities, MN, United States", 9, 2, "Don't love the place. Suburbs are sprawling, not walkable, not bike able, and with mediocre to shit transit. One visit was a -5/10 (willow), one was a 7/10, one was a 2/10. I'm rounding up cause Katrina lives there. Transit on the up and up but like ehhhhh just not a great place. Suburbia at it's most suburbia."],
  ["Las Vegas, NV, United States", 5, 7, "Good food. I like poker but haven't gotten to play there yet hence high WTR. Only ever been as a kid for food. Very expensive and touristy so like more of a I'd like to go then I need to go back."],
  ["Chicago, IL, United States", 6, 8, "My uncle made my trip to Chicago incredible, I'm sure it wouldn't be as good if I went back. Good food, pretty area, fairly walkable, but a lot of the stuff I enjoyed was tied to the trip with him. If I go back it'd be for a good restaurant or two, beyond that I don't know why I'd visit."],
  ["Myrtle Beach, SC, United States", 8, 8, "My uncle/aunt made this an incredible trip(s). Both times were so fun. Made random ass friends, robbed the alcohol storage with them, almost hooked up with a girl I met on the beach, went to these random 20 somethings apartment and got offered dabs, 10/10 14 yo experience. But all of that is very tied to when I went. I wouldn't enjoy any of that as much now and wouldn't enjoy the surrounding area much either, just not for me."],
  ["New York, NY, United States", 2, 8, "Incredibly walkable. Great public transit. Good and great food options. Nature is lacking. Basketball everywhere! Would love to go back just to see more of the city. I could explore forever."],
  ["Niagara Falls, NY, United States", 10, 5, "It was nice to see once. Nature not comparable to other places I'd visit just for the nature. Had a fun time for the one night we were there but definitely an attraction to go to because we were driving past. Not worth going out of my way to see."],
  ["Montreal, Canada", 6, 4, "Only had one night there. Good bagel. Very walkable. Just seems like a place I could want to live based on walk/bike/transit. Snow is nice. Cool place, I'd like to see more of."],
  ["Fez, Morocco", 4, 7, "Good food. Cheap. Incredibly walkable. Nice being in a totally different culture. I'd love to go back. They spoke more english here then Marakesh but the central market is worse."],
  ["Marakesh, Morocco", 4, 7, "Great food. Cheap. Incredibly walkable. Cool being in another culture. I like Riads a lot. I'd love to go back. Cooler central market than Fez but also scarier in some ways. Docked enjoyment points only due to losing my luggage and also the experience of being on vacation with my family."],
  ["Sahara Desert, Morocco", 7, 6, "The stars!!! Beyond that huge tourist trap also my family. 10/10 for the stars alone. -3 for the dealing with family getting there and being there. -1 cause bad food."],
  ["Davis, CA, United States", 5, 6, "Visiting Rachel is fun but we have kinda stopped talking so WTR is lower. Very cool walkable city. Also very NIMBY. Fun town, wouldn't at all mind being there, incredibly convenient to go."],
  ["Sacramento, CA, United States", 10, 5, "Visiting Addison was fun, Sacramento Suburbs are sprawling and dumb. I don't want to go back unless I'm visiting him but also staying with a Catholic family kinda sucks. Addison is very cool though."],
  ["Lake Tahoe, CA, United States", 4, 7, "So pretty, skiing is fun, great vacation spot. Been a ton of times, many different experiences. Ideal second home location but also everybody already feels this way to tons of money. Great nature, great activities, no clue about the food, not walkable at all."]
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