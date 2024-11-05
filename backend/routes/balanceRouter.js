const express = require('express');

const { checkBalance } = require('../balanceOperations');

const router = express.Router();

// POST endpoint to check balance
router.post('/check-balance', async (req, res) => {
    console.log(req.body);
    const { paymentKey } = req.body;
    console.log("The request body is ", paymentKey);

    if (!paymentKey) {
        return res.status(400).json({ error: 'Payment key is required' });
    }

    try {
        const balanceData = await checkBalance(paymentKey);

        // Convert balance from Lovelace to ADA (1 ADA = 1,000,000 Lovelace)
        const balanceInAda = balanceData.balance / 1000000;
        console.log("The balance is : ", balanceInAda);

        return res.status(200).json({
            balance: balanceInAda,
            message: `Balance for address ${paymentKey} is ${balanceInAda} ADA`,
        });
    } catch (error) {
        console.error("Error checking balance:", error);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
