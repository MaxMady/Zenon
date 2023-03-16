const fs = require('fs');
const csv = require(`csvtojson`)
csv()
.fromFile(`./data/final.csv`)
.then((jsonObj)=>{
    
fs.writeFile('./data/final.json', JSON.stringify(jsonObj), function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Data saved to file successfully.');
    }
  });
})