# mfqp
[Website](http://metakgp.github.io/mfqp/) for Question Paper Search

### Utilities

#### Number of papers in the json file

```sh
$ jq '. | length' data/data.json
```

#### Find number of papers with link doesn't end with PDF and isn't on Drive

```sh
$ jq '.[].Link' data/data.json | awk -F'"' '{ if (match($2, /pdf$/) == 0 && match($2, /drive.google.com/) == 0) { print $2 } }' | wc
```

#### Calculate number of duplicates

```sh
# Find the original number of papers
$ jq '.[].Link' data/data.json | wc
# Find the number of unique records
$ jq '.[].Link' data/data.json | sort | uniq | wc
# Subtract the result of the second command
# from the first to get the number of duplicates
```

```sh
# oneliner to find the number of duplicates
$ echo $((`jq '.[].Link' data/data.json | sort | uniq -D | wc -l`-`jq '.[].Link' data/data.json | sort | uniq -d | wc -l`))
```
#### Getting all paper links from new library site

Run the following from the `data` folder:

```sh
python ../scripts/pdfFinder.py lib_data.json
```
(You need to install BS4 for that.)

This will generate a new `lib_data.json` (overwriting the old one).
Prettify the json and commit.
Once `data/data.json` is updated with the links from crowd-sourced question papers,
we can just copy-paste the categorized entries from `lib_data.json` to `data.json`. 
However, the uncategorized links must be scrutinized and converted to proper format before adding.

#### Library site is down? ( [http://10.17.32.9](http://10.17.32.9) )

Run the following command, commit the new data.json file and
push to this repository:

```sh
sed -ie "s/http:\/\/10\.17\.32\.9/https:\/\/static\.metakgp\.org/g" data/data.json
```

or if you need to go back to the library site:

```sh
sed -ie "s/https\:\/\/static.metakgp.org/http\:\/\/10.17.32.9/g" data/data.json
```

# LICENSE
Licensed under GNU General Public License v3.0 (GPLv3).

## Contributing

Please read CONTRIBUTING.md guide to know more.