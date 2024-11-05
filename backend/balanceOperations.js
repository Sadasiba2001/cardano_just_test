const { exec } = require('child_process');

// Function to check balance using Cardano CLI
const checkBalance = async (paymentAddress) => {
    return new Promise((resolve, reject) => {
        // Trim the payment address to remove any leading or trailing whitespace
        const trimmedAddress = paymentAddress.trim();
        console.log(`Running Cardano CLI command to check balance for address: ${trimmedAddress}`);

        // Construct the command as a single string
        const command = `cardano-cli query utxo --address "${trimmedAddress}" --testnet-magic 1 --socket-path "/home/quotus/git/hydra-head/db/node.socket"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                reject(`Error executing command: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject(`Error: ${stderr}`);
                return;
            }

            console.log("Cardano CLI output:", stdout); // Log the raw output from the CLI

            // Parse the output to extract the balance
            const lines = stdout.trim().split('\n');
            console.log(`Number of lines returned from CLI: ${lines.length}`); // Debugging line count

            if (lines.length <= 1) {
                console.log("No UTXOs found. Balance is 0.");
                resolve({ balance: 0 }); // No UTXOs found
                return;
            }

            // The first line is the header, so we start from the second line
            let totalBalance = 0;
            for (let i = 1; i < lines.length; i++) {
                const columns = lines[i].trim().split(/\s+/);
                console.log(`Line ${i}:`, columns); // Log each parsed line for debugging
                const value = parseInt(columns[2], 10); // Assuming the value is in the third column
                if (isNaN(value)) {
                    console.error(`Invalid value found in line ${i}:`, columns[2]);
                } else {
                    totalBalance += value;
                }
            }

            console.log(`Total balance: ${totalBalance} ADA`); // Log the calculated balance
            resolve({ balance: totalBalance });
        });
    });
};

module.exports = {
    checkBalance,
};