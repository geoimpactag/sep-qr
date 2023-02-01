var QRCode = require('qrcode')
const csv = require('csv-parser')
const fs = require('fs');
const path = require("path");

function main(){
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
                            .replaceAll("/", "_")
                            .replaceAll(":", "_")
                            .replaceAll("?", "_")
                            .replaceAll("&", "_");
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
}

async function generateQR(rows){
    console.log("genererate csv from rows:\n", rows);
    let fileNames = [];
    rows = rows.filter(row => row !== {} && row?.URL !== undefined);
    for(let i = 0; i < rows.length; i++){
        let row = rows[i];
        QRCode.toString(row.URL, {type:'terminal'}, function (err, url) {
            console.log(`converted text ${i+1} (${row.URL}) into qr code: \n${url}`)
        });
        const myURL = new URL(row.URL);
        const filePath = myURL.href
            .replaceAll("/", "_")
            .replaceAll(":", "_")
            .replaceAll("?", "_")
            .replaceAll("&", "_");
        let fullFilePath = `${__dirname}/../output/qr_${i+1}_${filePath}.png`;
        fileNames.push(fullFilePath)
        await new Promise((res, rej) => {
            QRCode.toFile(path.resolve(fullFilePath), row.URL, {
                color: {
                    dark: '#000000', // Blue modules
                    light: '#0000' // Transparent background
                },
                width: 512, height: 512
            }, function (err) {
                if (err){
                    rej(err.message)
                }
                console.log(`saved qr code: ${__dirname}/../output/qr_${i+1}_${row.URL}.png`);
                res();
            })
        })
    }
    return fileNames;
}

module.exports = { generateQR, main }
