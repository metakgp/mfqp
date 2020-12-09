const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

const thisYear = new Date().getFullYear();

const MID_SPRING_PERIOD = `${thisYear}-02-15, ${thisYear}-04-30`;
const END_SPRING_PERIOD = `${thisYear}-05-01, ${thisYear}-09-30`;
const MID_AUTUMN_PERIOD = `${thisYear}-10-01, ${thisYear}-11-30`;
const END_AUTUMN_PERIOD = `${thisYear}-12-01, ${thisYear + 1}-02-14`;

function semesterExists(semester) {
    /(mid|end) (spring|autumn) (20)([0-9]{2})/.match(semester)
}

function defaultSemester(today) {
    if (today >= MID_SPRING_PERIOD[0] && today <= MID_SPRING_PERIOD[1]) return `mid spring ${thisYear}`;
    else if (today >= END_SPRING_PERIOD[0] && today <= END_SPRING_PERIOD[1]) return `end spring ${thisYear}`;
    else if (today >= MID_AUTUMN_PERIOD[0] && today <= MID_AUTUMN_PERIOD[1]) return `mid autumn ${thisYear}`;
    else if (today >= END_AUTUMN_PERIOD[0] && today <= END_AUTUMN_PERIOD[1]) return `end autumn ${thisYear}`;
}

function loopBatch(defaultSem) {
    let batch = '', batchSemester = '';

    readline.question("\n\nDo you want to batch insert year & semester for the papers? [y/Y for Yes, n/N for No\n", response => {
        batch = response;
        
        if (batch.toLowerCase() === 'y') {
            while (!semesterExists(batchSemester)) {
                readline.question(`Enter batch semester (${defaultSem})\n`, response => {
                    batchSemester = response;

                    if (batchSemester.length === 0) {
                        batchSemester = defaultSem;
                        console.log('User default Semester');
                    }
                    readline.close();
                })        
            }
        } else if (batch.toLowerCase() === 'n') {
            console.log('Batch insert is not chosen');
            batchSemester = null;
        } else {
            console.log("Invalid choice chosen - Use only y/Y/n/N");
        }

        readline.close();
    })    

    return { batch, batchSemester };
}

function loopPapers(obj, batch, batchSem, defaultSem) {
    while (true) {
        let choice = '';

        readline.question("\n\nEnter yet another paper? (press enter to continue, N/n to exit and write to file)\n", response => {
            choice = response;
            readline.close();
        })

        if (choice.length !== 0 && choice.toLowerCase() === 'n') break;

        let department;
        console.log("Enter the particulars of the new paper: ");
        readline.question("Enter department: ", response => {
            department = response;
            readline.close();
        })
        let semester = '';

        if (batch.toLowerCase() === 'n') {
            while (!semesterExists(semester)) {
                readline.question(`Enter semester (${defaultSem}): \n`, response => {
                    semester = response;

                    if (semester.length === 0) {
                        semester = defaultSem;
                        console.log("Used default semester");
                    }
                    readline.close();
                })
            }
        } else {
            semester = batchSem;
        }

        let paper;
        readline.question("Enter name of the paper (Basic Electronics): \n", response => {
            paper = response;
            readline.close();
        })

        let link;
        readline.question("Enter link to the paper: \n", response => {
            link = response;
            readline.close();
        })
        const year = semester.split(" ")[2];
        const paperObj = { Department: department, Semester: semester, Paper: paper, Link: link, Year: year };
        
        console.log(paperObj);
        obj.push(paperObj);
    }

}

function writeToJson(filename, obj) {
    console.log(`${obj.length} papers now.`);

    fs.unlink(filename, err => {
        if (err) throw err;
    })

    fs.writeFile(filename, JSON.stringify(obj), 'utf8', (err) => {
        if (err) throw err;
    })
}

const filename = 'data/data.json';
const today = new Date().toISOString().slice(0, 10);
const defaultSem = defaultSemester(today);
console.log('defaultSem: ', defaultSem);
const { batch, batchSemester } = loopBatch(defaultSem);

const obj = fs.readFile(filename, (err, data) => {
    if (err) throw err;
    return JSON.parse(data)
}) || [];

console.log(`DEBUG: ${obj && obj.length} before object addition!`);
obj = loopPapers(obj, batch, batchSemester, defaultSem)
writeToJson(filename, obj);
