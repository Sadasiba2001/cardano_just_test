// routes/name.js
const express = require('express');
const { exec } = require('child_process');
const router = express.Router();
const fs = require('fs'); // Ensure fs is imported
const path = require('path');

// POST endpoint to receive the name and generate keys
router.post('/', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    // Define the directory to store keys with the user's name
    const keysDir = path.join('/home/quotus/Sadasiba/Transaction_keys_palceholdernames', `${name}_keyDir`); // Updated path with name

    // Create the keys directory if it doesn't exist
    exec(`mkdir -p ${keysDir}`, (err) => {
        if (err) {
            console.error('Error creating keys directory:', err);
            return res.status(500).json({ message: 'Error creating keys directory' });
        }

        // Check if keys already exist
        const paymentAddrFile = `${keysDir}/${name}_payment.addr`;
        const paymentVKeyFile = `${keysDir}/${name}_payment.vkey`;
        const stakeVKeyFile = `${keysDir}/${name}_stake.vkey`;

        if (fs.existsSync(paymentAddrFile) && fs.existsSync(paymentVKeyFile) && fs.existsSync(stakeVKeyFile)) {
            // Read existing keys and addresses
            const paymentVKey = fs.readFileSync(paymentVKeyFile, 'utf8');
            const paymentSKey = fs.readFileSync(`${keysDir}/${name}_payment.skey`, 'utf8');
            const stakeVKey = fs.readFileSync(stakeVKeyFile, 'utf8');
            const stakeSKey = fs.readFileSync(`${keysDir}/${name}_stake.skey`, 'utf8');
            const paymentAddr = fs.readFileSync(paymentAddrFile, 'utf8');
            const stakeAddr = fs.readFileSync(`${keysDir}/${name}_stake.addr`, 'utf8');

            // Respond back to the client with existing keys and addresses
            return res.status(200).json({
                message: `Keys and addresses already exist for ${name}.`,
                keys: {
                    paymentVKey,
                    paymentSKey,
                    stakeVKey,
                    stakeSKey,
                    paymentAddr,
                    stakeAddr
                }
            });
        }

        // Generate Payment Key Pair if they don't exist
        exec(`cardano-cli address key-gen --verification-key-file ${keysDir}/${name}_payment.vkey --signing-key-file ${keysDir}/${name}_payment.skey`, (err) => {
            if (err) {
                console.error('Error generating payment keys:', err);
                return res.status(500).json({ message: 'Error generating payment keys' });
            }

            // Generate Stake Key Pair
            exec(`cardano-cli stake-address key-gen --verification-key-file ${keysDir}/${name}_stake.vkey --signing-key-file ${keysDir}/${name}_stake.skey`, (err) => {
                if (err) {
                    console.error('Error generating stake keys:', err);
                    return res.status(500).json({ message: 'Error generating stake keys' });
                }

                // Build Stake Address
                exec(`cardano-cli stake-address build --stake-verification-key-file ${keysDir}/${name}_stake.vkey --out-file ${keysDir}/${name}_stake.addr --testnet-magic 1`, (err) => {
                    if (err) {
                        console.error('Error building stake address:', err);
                        return res.status(500).json({ message: 'Error building stake address' });
                    }

                    // Build Payment Address
                    exec(`cardano-cli address build --payment-verification-key-file ${keysDir}/${name}_payment.vkey --stake-verification-key-file ${keysDir}/${name}_stake.vkey --out-file ${keysDir}/${name}_payment.addr --testnet-magic 1`, (err) => {
                        if (err) {
                            console.error('Error building payment address:', err);
                            return res.status(500).json({ message: 'Error building payment address' });
                        }

                        // Read generated keys and addresses
                        const paymentVKey = fs.readFileSync(`${keysDir}/${name}_payment.vkey`, 'utf8');
                        const paymentSKey = fs.readFileSync(`${keysDir}/${name}_payment.skey`, 'utf8');
                        const stakeVKey = fs.readFileSync(`${keysDir}/${name}_stake.vkey`, 'utf8');
                        const stakeSKey = fs.readFileSync(`${keysDir}/${name}_stake.skey`, 'utf8');
                        const paymentAddr = fs.readFileSync(`${keysDir}/${name}_payment.addr`, 'utf8');
                        const stakeAddr = fs.readFileSync(`${keysDir}/${name}_stake.addr`, 'utf8');

                        // Respond back to the client with keys and addresses
                        res.status(200).json({
                            message: `Keys and addresses generated for ${name}.`,
                            keys: {
                                paymentVKey,
                                paymentSKey,
                                stakeVKey,
                                stakeSKey,
                                paymentAddr,
                                stakeAddr
                            }
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;
