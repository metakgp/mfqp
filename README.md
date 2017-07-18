# mfqp
[Website](http://metakgp.github.io/mfqp/) for Question Paper Search

### Utilities

#### Library site is down? ( [http://10.17.32.9](http://10.17.32.9) )

Run the following command, commit the new data.json file and
push to this repository:

```sh
sed -ie "s/http:\/\/10\.17\.32\.9/https:\/\/wiki\.metakgp\.org/g" data.json
```

or if you need to go back to the library site:

```sh
sed -ie "s/https\:\/\/wiki.metakgp.org/http\:\/\/10.17.32.9/g" data.json
```

All of this must be done while inside the `data/` folder.

# LICENSE
Licensed under GNU General Public License v3.0 (GPLv3).
