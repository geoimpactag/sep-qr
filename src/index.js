var QRCode = require('qrcode')
const csv = require('csv-parser')
const fs = require('fs');
const path = require("path");

let rows = [];
(async () => {
  return await new Promise((res, rej) => {
    fs.createReadStream(path.resolve(`${__dirname}/../input/input.csv`))
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', () => {
        console.log("input:\n", rows);
        rows = rows.filter(row => row !== {} && row?.URL !== undefined);
        for(let i = 0; i < rows.length; i++){
          let row = rows[i];
          QRCode.toString(row.URL, {type:'terminal'}, function (err, url) {
            console.log(`converted text ${i+1} (${row.URL}) into qr code: \n${url}`)
          });
            const myURL = new URL(row.URL);
            const filePath = myURL.href
                .replaceAll("/", "")
                .replaceAll(":", "")
                .replaceAll("?", "")
                .replaceAll("&", "");
            QRCode.toFile(path.resolve(`${__dirname}/../output/qr_${i+1}_${filePath}.png`), row.URL, {
            color: {
              dark: '#000000', // Blue modules
              light: '#0000' // Transparent background
            },
                width: 512, height: 512
          }, function (err) {
            if (err) throw err
            console.log(`saved qr code: ${__dirname}/../output/qr_${i+1}_${row.URL}.png`)
          })
        }
        res("qr codes generated");
      });
  });
})()
