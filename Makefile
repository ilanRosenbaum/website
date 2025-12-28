#***************************************************************************
# license summary
#***************************************************************************
## Count the number of each type of license used in the project
.PHONY: license-summary
license-summary:
	license-checker --json > utils/documents/license-checker.json
	cd utils; python license.py summary

#***************************************************************************
# license credits
#***************************************************************************
## Credit the authors of the licenses used in the project
.PHONY: license-credits
license-credits:
	license-checker --json > utils/documents/license-checker.json
	cd utils; python license.py credit > documents/license-credit.txt

#***************************************************************************
# copy content
#***************************************************************************
.PHONY: copy-content
copy-content:
	cp '$(NOTES_LOCATION)/Research/Headphones, No Headphones.md' 'public/content/HeadphonesNoHeadphones.md'
	cp '$(NOTES_LOCATION)/Places/Lived.md' 'public/content/PlacesLived.md'
	cp '$(NOTES_LOCATION)/Places/Visited.md' 'public/content/PlacesVisited.md'
	cp '$(NOTES_LOCATION)/Places/To Visit.md' 'public/content/PlacesToVisit.md'
	cp '$(NOTES_LOCATION)/Places/To Live.md' 'public/content/PlacesToLive.md'
	(echo '# Lived'; cat '$(NOTES_LOCATION)/Places/Lived.md') > 'public/content/PlacesLived.md'
	(echo '# Visited'; cat '$(NOTES_LOCATION)/Places/Visited.md') > 'public/content/PlacesVisited.md'
	(echo '# To Visit'; cat '$(NOTES_LOCATION)/Places/To Visit.md') > 'public/content/PlacesToVisit.md'
	(echo '# To Live'; cat '$(NOTES_LOCATION)/React/ToLive.md') > 'public/content/PlacesToLive.md'
	(echo '# Books'; cat '$(NOTES_LOCATION)/books.md') > 'public/content/Books.md'
	
	# Clean up YAML frontmatter from all markdown files
	python scripts/remove_frontmatter.py public/content/PlacesLived.md
	python scripts/remove_frontmatter.py public/content/PlacesVisited.md
	python scripts/remove_frontmatter.py public/content/PlacesToVisit.md
	python scripts/remove_frontmatter.py public/content/Books.md
	python scripts/remove_frontmatter.py public/content/HeadphonesNoHeadphones.md
	
	# Apply table cleanup for visited places
	python scripts/remove_notes.py public/content/PlacesVisited.md
	
	# Convert markdown to React components
	python scripts/convert_md_to_react.py public/content/PlacesToLive.md src/pages/misc/places/ToLiveRaw.jsx
	@rm -rf public/content/PlacesToLive.md