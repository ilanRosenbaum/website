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
	cp '$(NOTES_LOCATION)/Observational Studies/Headphones, No Headphones.md' 'public/content/MiscHeadphonesNoHeadphones.md'
	cp '$(NOTES_LOCATION)/Places/Lived.md' 'public/content/MiscPlacesLived.md'
	cp '$(NOTES_LOCATION)/Places/Visited.md' 'public/content/MiscPlacesVisited.md'
	cp '$(NOTES_LOCATION)/Places/To Visit.md' 'public/content/MiscPlacesToVisit.md'
	cp '$(NOTES_LOCATION)/Places/To Live.md' 'public/content/MiscPlacesToLive.md'
	(echo '# Lived'; cat '$(NOTES_LOCATION)/Places/Lived.md') > 'public/content/MiscPlacesLived.md'
	(echo '# Visited'; cat '$(NOTES_LOCATION)/Places/Visited.md') > 'public/content/MiscPlacesVisited.md'
	(echo '# To Visit'; cat '$(NOTES_LOCATION)/Places/To Visit.md') > 'public/content/MiscPlacesToVisit.md'
	(echo '# To Live'; cat '$(NOTES_LOCATION)/React/ToLive.md') > 'public/content/MiscPlacesToLive.md'
	(echo '# Books'; cat '$(NOTES_LOCATION)/books.md') > 'public/content/MiscBooks.md'
	
	# Clean up YAML frontmatter from all markdown files
	python scripts/remove_frontmatter.py public/content/MiscPlacesLived.md
	python scripts/remove_frontmatter.py public/content/MiscPlacesVisited.md
	python scripts/remove_frontmatter.py public/content/MiscPlacesToVisit.md
	python scripts/remove_frontmatter.py public/content/MiscBooks.md
	python scripts/remove_frontmatter.py public/content/MiscHeadphonesNoHeadphones.md
	
	# Apply table cleanup for visited places
	python scripts/remove_notes.py public/content/MiscPlacesVisited.md
	
	# Convert markdown to React components
	python scripts/convert_md_to_react.py public/content/MiscPlacesToLive.md src/pages/misc/places/ToLiveRaw.jsx
	@rm -rf public/content/MiscPlacesToLive.md