# Why should I care about the version number? 

**Because I made it for you! You can know what changed quickly and without traversing the entire darn website** 

- A major version change (number on the far left) means that the meaning of one of the top level hexagons was changed. Ie. There was a reorg of the most major level. 

- A minor version change (middle number) means a new peace of functionality was added to the website (fast mode, versioning in the bottom left corner, improved image loading time, etc.)

- A content version change (final number, far right) means content was added or otherwise substantively changed. 

#### Note on edge case

Say the version number is 1.0.0 if I update content and make new functionality in the same change but don't change any of the top level hexagon the new version number is 1.1.1. If I also change the top level hexagons is 2.1.1. This does mean some version numbers will be skipped but the goal is to provide the user information on if anything they care about changed since the last time they visited the website as quickly as possible. 

So what the hell does substantively changed mean?

Stuff that creates a version change: Anything that requires creating a new hexagon within the existing structure. This includes a new about page, new art page, etc. but not updates to existing page, a new blog post, or updating any of the leaderboards (except resteraunts because I haven't built out the functionality to support that yet, gimme a few months).