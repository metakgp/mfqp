/**
 * Remove paper objects that don't end with ".pdf" and are not hosted on Google
 * Drive. (these links are definitely invalid)
 *
 * Run as:
 *
 *     node scripts/remove_non_pdf.js input_file output_file
 *
 * Input and Output file paths can be the same
 */

var fs = require('fs');

console.log(process.argv)
var input_file_name = process.argv[2]
var output_file_name = process.argv[3]

var papers = JSON.parse(fs.readFileSync(input_file_name))
var new_papers = [ ];

for (var i = 0; i < papers.length; i++) {
    var paper = papers[i];
    var link = paper.Link;
    if (link.match(/\.pdf/) || link.match(/drive\.google\.com/)) {
        new_papers.push(paper)
    }
}

fs.writeFileSync(output_file_name, JSON.stringify(new_papers, null, 4), 'utf-8')
