const net = require('net');
const server = net.createServer();
const fs = require('fs');

server.on('connection', (socketClient) => {
  console.log('socketClient connected');
  socketClient.setEncoding('utf-8');
  
  // server listens
  socketClient.on('data', (message) => {
    console.log('message from client:>> ', message);
    if (message === "download") {
      console.log("Received download request");
    } else if (message === "q") {
      socketClient.destroy();
    } else if (message.includes(".")) {
      // This can remain inside the writeStream block.
      let fileStream = fs.createReadStream(`/Users/rexx92/lighthouse/w2/d3-net/fileServer/fileServer/files/${message}`);
      console.log("Sending data file");
      socketClient.pipe(process.stdout);
      fileStream.on("readable", function() {
        let data;
        while (data = this.read()) {
          socketClient.write(data);
        }
      });

      fileStream.on("end", function() {
        console.log("File steam done.");
        socketClient.end();
      });
      socketClient.on("end", () => {
        console.log("Client disconnected.");
      });
    }
  });

  // socketClient.on('close', function() {
  //   console.log('Connection closed');
  // });

  // server talks
  // socketClient.write('Welcome to the Server. INS => ');

});
// Listening for communication/connection (handshake)
server.listen(4337, () => console.log('server listeninig on port 4337'));