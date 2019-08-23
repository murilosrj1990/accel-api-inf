const app = require("../src/app");
const debug = require("debug");
const http = require("http");

const port=3333;

app.set('port',port);
const server = http.createServer(app);
server.listen(port);
console.log("API está rodando na porta "+port);
