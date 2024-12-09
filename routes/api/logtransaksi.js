const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Use the native MongoDB driver through mongoose to match shell command
        const found = await mongoose.connection.db.collection('LogTransaksi').find().toArray();
        
        if (!found || found.length === 0) {
            return res.status(404).json({ message: "No transactions found" });
        }
        
        res.json(found);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred",
            error: err.message 
        });
    }
});

router.get('/:NoTransaksi', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        const NoTransaksi = req.params.NoTransaksi;
        
        // Use the native MongoDB driver through mongoose to match shell command
        const found = await mongoose.connection.db.collection('LogTransaksi').findOne({ NoTransaksi: NoTransaksi });
        
        if (!found) {
            return res.status(404).json({ message: "No transaction found" });
        }
        
        res.json(found);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});

router.post("/", async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Validate required fields
        const requiredFields = ['VA', 'TanggalBayar', 'JumlahBayar', 'Keterangan', 'TenggatBayar', 'TahunAkademik'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }

        // Find the latest transaction to increment NoTransaksi
        const latestTransaction = await mongoose.connection.db.collection('LogTransaksi').findOne({}, { sort: { _id: -1 } });
        const nextNoTransaksi = latestTransaction ? latestTransaction.NoTransaksi + 1 : 1;
        // Prepare the document to be inserted
        const documentToInsert = {
            NoTransaksi: nextNoTransaksi,
            VA: req.body.VA,
            TanggalBayar: req.body.TanggalBayar,
            JumlahBayar: req.body.JumlahBayar,
            Keterangan: req.body.Keterangan,
            TenggatBayar: req.body.TenggatBayar,
            TahunAkademik: req.body.TahunAkademik
        };

        // Use the native MongoDB driver through mongoose to match shell command
        const result = await mongoose.connection.db.collection('LogTransaksi').insertOne(documentToInsert);
        
        res.json(result);

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});


module.exports = router;