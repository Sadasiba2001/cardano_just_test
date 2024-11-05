// cardanoCommands.js
const { exec } = require('child_process');

// Function to execute Cardano CLI commands
function runCardanoCLI(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });
}

// Function to get the current tip of the blockchain
async function getCurrentStatus() {
    const socketPath = '/home/quotus/git/hydra-head/db/node.socket'; 
    const command = `cardano-cli query tip --socket-path ${socketPath} --testnet-magic 1`; // Adjust the command as needed
    return await runCardanoCLI(command);
}

module.exports = {
    getCurrentStatus,
};