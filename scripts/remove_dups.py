#!/usr/bin/python3
#
# remove_dups.py
#
# Run from mfqp root as: python3 scripts/remove_dups.py

import json, os

links = { }
json_path = os.path.join(os.getcwd(), 'data/data.json')
data = open(json_path, 'r')
config = json.load(data)
data.close()

new_config = [ ]

orig_len = len(config)
print("Starting with %d objects" % orig_len)

for paper in config:
#  for i in range(len(config)):
    #  paper = config[i]
    link = paper['Link']
    if not (link in links):
        new_config.append(paper)
        links[link] = 1

print("Pruned %d objects" % (orig_len - len(new_config)))
print("Ending with %d objects" % len(new_config))

data = open(json_path, 'w')
json.dump(new_config, data, sort_keys=True, indent='    ')
data.close()
