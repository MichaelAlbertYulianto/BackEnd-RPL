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
        const found = await mongoose.connection.db.collection('Tagihan').find().toArray();
        
        if (!found || found.length === 0) {
            return res.status(404).json({ message: "No tagihan found" });
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

router.get('/:VA', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        const VA = req.params.VA;
        
        // Use the native MongoDB driver through mongoose to match shell command
        const found = await mongoose.connection.db.collection('Tagihan').findOne({ VA: VA });
        
        if (!found) {
            return res.status(404).json({ message: "No Tagihan found" });
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

router.put('/:VA', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        const VA = req.params.VA;
        const updateData = {
            Tagihan: req.body.Tagihan,
            Keterangan: req.body.Keterangan,
            Status: req.body.Status,
            TenggatBayar: req.body.TenggatBayar,
            TahunAkademik: req.body.TahunAkademik
        };

        // Validate required fields
        const requiredFields = ['Tagihan', 'Keterangan', 'Status', 'TenggatBayar', 'TahunAkademik'];
        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === null) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }

        // Use the native MongoDB driver through mongoose to match shell command
        const result = await mongoose.connection.db.collection('Tagihan').updateOne({ VA: VA }, { $set: updateData });
        
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "No Tagihan found" });
        }
        
        res.json({ message: "Tagihan updated successfully" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});






module.exports = router;