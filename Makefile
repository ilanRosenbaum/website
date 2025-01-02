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
	cp '../Documents/Obsidian Vault/Observational Studies/Headphones, No Headphones.md' 'public/content/MiscHeadphonesNoHeadphones.md'
	cp '../Documents/Obsidian Vault/Places/Lived.md' 'public/content/MiscPlacesLived.md'
	cp '../Documents/Obsidian Vault/Places/Visited.md' 'public/content/MiscPlacesVisited.md'
	cp '../Documents/Obsidian Vault/Places/To Visit.md' 'public/content/MiscPlacesToVisit.md'
	cp '../Documents/Obsidian Vault/Places/To Live.md' 'public/content/MiscPlacesToLive.md'
	(echo '# Lived'; cat '../Documents/Obsidian Vault/Places/Lived.md') > 'public/content/MiscPlacesLived.md'
	(echo '# Visited'; cat '../Documents/Obsidian Vault/Places/Visited.md') > 'public/content/MiscPlacesVisited.md'
	(echo '# To Visit'; cat '../Documents/Obsidian Vault/Places/To Visit.md') > 'public/content/MiscPlacesToVisit.md'
	(echo '# To Live'; cat '../Documents/Obsidian Vault/Places/To Live.md') > 'public/content/MiscPlacesToLive.md'
	python scripts/remove_notes.py public/content/MiscPlacesVisited.md