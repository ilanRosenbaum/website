# Ilan's Website
# Copyright (C) 2024-2025 ILAN ROSENBAUM
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.

import json
import sys


def main():
    with open("documents/license-checker.json") as json_file:
        data = json.load(json_file)

    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "summary":
            summary(data)
        elif command == "credit":
            credit(data)
        else:
            print("Invalid command. Use 'summary' or 'credit'.")
    else:
        print("No command provided. Use 'summary' or 'credit'.")


def credit(data):
    for key, value in data.items():
        if "publisher" in value:
            author = value["publisher"]
            print(f"Package: {key}\\\nAuthor: {author}\n")


def summary(data):
    license_dictionary = {}

    for key, value in data.items():
        if "licenses" in value:
            l = value["licenses"]
            if l in license_dictionary:
                license_dictionary[l] += 1
            else:
                license_dictionary[l] = 1

    keys_to_remove = []
    for key in license_dictionary.keys():
        for other_key in license_dictionary.keys():
            if key != other_key and other_key in key:
                license_dictionary[other_key] += license_dictionary[key]
                keys_to_remove.append(key)
                break

    for key in keys_to_remove:
        del license_dictionary[key]

    # Sort licenses by count in descending order
    sorted_licenses = sorted(
        license_dictionary.items(), key=lambda item: item[1], reverse=True
    )

    # Print licenses in a more readable format
    print("License Summary:")
    for license, count in sorted_licenses:
        print(f"----------------\nLicense: {license}\nCount: {count}")


if __name__ == "__main__":
    main()
