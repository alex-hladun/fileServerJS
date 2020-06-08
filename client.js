const net = require('net');
const readline = require('readline');
const fs = require('fs');
const client = net.createConnection({
  port: 4337,
  host: 'localhost'
});

// This was reccommended for the text-transfer tutorial, but will throw off non-txt files.
// client.setEncoding('utf-8');

client.on('connect', () => console.log('Connected to the server'));
client.on('close', () => {
  console.log('Disconnected from server.');
  rl.close();
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let streamFile;

const query = () => {
  rl.question("Enter 'download' command, or type 'q' to quit: ", (command) => {
    if (command === "download") {
      rl.question("Enter file to request: ", (writeloc) => {
        streamFile = fs.createWriteStream(`./clientFiles/${writeloc}`);
        client.write(writeloc);
        query();
      });
      client.write(command);
    } else if (command === 'q') {
      client.write(command, (error) => {
        if (error) {
          console.log("Disconnected");
        }
      });
      rl.close();
    } else {
      client.write(command);
    }
    query();
  });
};

// Needs to be created outside of client.on

client.on('data', (chunk) => {
  streamFile.write(chunk);
  console.log("Receiving file");
  console.log(`File size: ${chunk.length}`);
});

client.on('end', () => {
  console.log("Disconnected.");
  // This process.exit part is important to stop reading!
  process.exit();
});

setTimeout(() => {
  query();
}, 200);