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
        const found = await mongoose.connection.db.collection('DataTagihan').find().toArray();
        
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

router.put('/:IdTagihan', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Convert IdTagihan string to number
        const IdTagihan = parseInt(req.params.IdTagihan);

        // Construct update data from request body
        const updateData = {
            Tetap: req.body.Tetap,
            Sks: req.body.Sks,
            Kesehatan: req.body.Kesehatan,
            Terintegrasi: req.body.Terintegrasi,
            ICE: req.body.ICE
        };

        // Use the native MongoDB driver through mongoose to match shell command
        const result = await mongoose.connection.db.collection('DataTagihan').updateOne({ IdTagihan: IdTagihan }, {
            $set: updateData
        });
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "No DataTagihan found" });
        }
        
        res.status(200).json({
            message: "DataTagihan updated successfully",
            data: updateData
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});



module.exports = router;