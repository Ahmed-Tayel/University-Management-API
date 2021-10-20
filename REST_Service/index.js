'use-strict';
const Server = require('./src/Server/index')

async function main(){
    console.log("Service is starting ........");
    var server = new Server();
    await server.init();
}
main();