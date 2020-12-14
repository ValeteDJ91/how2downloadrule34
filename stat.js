const fs = require('fs');

fs.readFile('variables.json', 'utf-8', (err, data) => {
    if (err) { throw err; }
    var variables = JSON.parse(data.toString());
    var successrate = variables.success/variables.image*100
    console.log("================================");console.error("================================")
    console.log("Download statistics");console.error("Download statistics")
    console.log("");console.error("")
    console.log(`Number of tries: ${variables.image}`);console.error(`Number of tries: ${variables.image}`)
    console.log(`Current position: ${variables.image}`);console.error(`Current position: ${variables.image}`)
    console.log(`Success: ${variables.success}`);console.error(`Success: ${variables.success}`)
    console.log(`Fail: ${variables.failed}`);console.error(`Fail: ${variables.failed}`)
    console.log(`Success rate: ${successrate.toString().slice(0, 5)}%`);console.error(`Success rate: ${successrate.toString().slice(0, 5)}%`)
    console.log("================================");console.error("================================")
});
  