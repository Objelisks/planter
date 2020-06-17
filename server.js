// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express")
const http = require('http')
const fetch = require('node-fetch')
const app = express()

const token = 'czVucnQyb2k0dVpGczRGMlpNa2RLdz09'
const url = '*'

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

app.get('/token', (req, res) => {
  fetch(`https://trefle.io/api/auth/claim?token=${token}&origin=${url}`, {method: 'POST'})
    .then(response => response.json())
    .then(json => res.send(json.token))
})


http.createServer(app).listen(3000)
console.log('server up at https://localhost:3000')
