var QRCode = require('qrcode')
const csv = require('csv-parser')
const fs = require('fs');
const path = require("path");

const rows = [];
(async () => {
  return await new Promise((res, rej) => {
    fs.createReadStream(path.resolve(`${__dirname}/../input/input.csv`))
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', () => {
        console.log("input:\n", rows);
        for(let i = 0; i < rows.length; i++){
          let row = rows[i];
          QRCode.toString(row.URL, {type:'terminal'}, function (err, url) {
            console.log(`converted text ${i+1} (${row.URL}) into qr code: \n${url}`)
          });
          QRCode.toFile(path.resolve(`${__dirname}/../output/qr_${i+1}_${row.URL}.png`), row.URL, {
            color: {
              dark: '#000000', // Blue modules
              light: '#0000' // Transparent background
            }
          }, function (err) {
            if (err) throw err
            console.log(`saved qr code: ${__dirname}/../output/qr_${i+1}_${row.URL}.png`)
          })
        }
        res("qr codes generated");
      });
  });
})()
