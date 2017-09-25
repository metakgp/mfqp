if (process.argv.length < 3) {
  console.log();
  console.error("The first argument to this script must be the path to the JSON file");
  console.error("Usage: node scripts/num_papers.js data/data.json");
  process.exit(1);
}

var file_name = process.argv[2];

try {
  var list_papers = JSON.parse(require('fs').readFileSync(file_name).toString());
  console.log();
  console.log(list_papers.length + " papers in this JSON file");
  process.exit(0);
} finally {
  console.error("Invalid JSON!");
  process.exit(1);
}
