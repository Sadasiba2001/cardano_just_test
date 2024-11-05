// routes/transaction.js
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// POST endpoint to handle transactions
router.post('/adda/transaction', (req, res) => {
    const { sender, recipient, amount, name } = req.body;

    if (!sender || !recipient || !amount || !name) {
        return res.status(400).json({ message: 'Sender, recipient, amount, and name are required' });
    }

    // Ensure sender is in the correct format
    const senderParts = sender.split('#');
    if (senderParts.length !== 2 || !/^[0-9a-fA-F]+$/.test(senderParts[0]) || isNaN(senderParts[1])) {
        return res.status(400).json({ message: 'Sender must be in the format <transaction_id>#<index>' });
    }

    // Define the keys directory
    const keysDir = path.join('/home/quotus/Sadasiba/Transaction_keys_palceholdernames', `${name}_keyDir`);

    // Build the transaction
    const buildTxCommand = `cardano-cli transaction build-raw --tx-in "${sender}" --tx-out "${recipient}+${amount}" --fee 0 --out-file "${keysDir}"/tx.raw`;

    exec(buildTxCommand, (err) => {
        if (err) {
            console.error('Error building transaction:', err);
            return res.status(500).json({ message: 'Error building transaction' });
        }

        // Calculate the fee
        const calculateFeeCommand = `cardano-cli conway transaction calculate-min-fee \
            --tx-body-file ${keysDir}/tx.raw \
            --tx-in-count 1 \
            --tx-out-count 1 \
            --witness-count 1 \
            --byron-era \
            --out-file ${keysDir}/fee.txt`;

        exec(calculateFeeCommand, (err) => {
            if (err) {
                console.error('Error calculating fee:', err);
                return res.status(500).json({ message: 'Error calculating fee' });
            }

            // Read the fee from the file
            const fee = fs.readFileSync(`${keysDir}/fee.txt`, 'utf8').trim();

            // Rebuild the transaction with the fee included
            const rebuildTxCommand = `cardano-cli conway transaction build-raw \
                --tx-in ${sender} \
                --tx-out ${recipient}+${amount} \
                --fee ${fee} \
                --out-file ${keysDir}/tx.raw`;

            exec(rebuildTxCommand, (err) => {
                if (err) {
                    console.error('Error rebuilding transaction:', err);
                    return res.status(500).json({ message: 'Error rebuilding transaction' });
                }

                // Sign the transaction
                const signTxCommand = `cardano-cli transaction sign \
                    --tx-body-file ${keysDir}/tx.raw \
                    --signing-key-file ${keysDir}/${name}_payment.skey \
                    --out-file ${keysDir}/tx.signed \
                    --testnet-magic 1`;

                exec(signTxCommand, (err) => {
                    if (err) {
                        console.error('Error signing transaction:', err);
                        return res.status(500).json({ message: 'Error signing transaction' });
                    }

                    // Submit the transaction
                    const submitTxCommand = `cardano-cli transaction submit --tx-file ${keysDir}/tx.signed --testnet-magic 1`;

                    exec(submitTxCommand, (err) => {
                        if (err) {
                            console.error('Error submitting transaction:', err);
                            return res.status(500).json({ message: 'Error submitting transaction' });
                        }

                        res.status(200).json({ message: 'Transaction submitted successfully!' });
                    });
                });
            });
        });
    });
});

module.exports = router;
