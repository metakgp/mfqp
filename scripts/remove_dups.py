#!/usr/bin/python3
#
# remove_dups.py

import json, os

links = []
parent = os.path.split(os.path.abspath(os.getcwd()))[0]
data = open(os.path.join(parent, 'data/data.json'), 'r')
config = json.load(data)
data.close()

for paper in config:
    links.append(paper['Link'])

for link in links:
    count = 0
    for paper in config:
        if link == paper['Link']:
            count += 1

        if count > 1:
            config.remove(paper)

data = open(os.path.join(parent, 'data/data.json'), 'w')
json.dump(config, data, sort_keys=True, indent=4 * ' ')
data.close()
