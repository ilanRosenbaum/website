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