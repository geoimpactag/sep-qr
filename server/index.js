const express = require('express');
const {generateQR} = require("../src");
const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const port = process.env.PORT;
const shell = require('shelljs');
const path = require("path");

app.get('/', (req, res) => {
    console.log("GET", req);
    res.sendFile(path.resolve(__dirname+"/index.html"));
});
app.post('/', async function (req, res, next) {
    console.log('POST', req.body)
    shell.echo(shell.pwd());
    shell.rm('-rf', './output');
    shell.mkdir("-p", './output');
    shell.touch('-c', './output/.keep');
    shell.echo('Pruned output folder');
    let filePaths = await generateQR(req.body.rows)
    filePaths.forEach(filePath => {
        res.sendFile(path.resolve(filePath), {}, function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent:', filePath);
            }
        });
    })
/*    res.send({
        message: filePaths
    })*/
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
