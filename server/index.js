const express = require('express');
const {generateQR} = require("../src");
const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
const port = process.env.PORT;
const shell = require('shelljs');

app.get('/', (req, res) => {
    console.log("GET", req);
    res.send('Hello World!');
});
app.post('/', function (req, res) {
    console.log('POST', req.body)
    shell.echo(shell.pwd());
    shell.rm('-rf', './output');
    shell.mkdir("-p", './output');
    shell.touch('-c', './output/.keep');
    shell.echo('Pruned output folder');
    let generated = generateQR(req.body.rows)
    res.send({
        message: generated && "ok"
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
