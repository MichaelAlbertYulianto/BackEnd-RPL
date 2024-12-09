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

router.post('/', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        } 

        // Find the latest document to get the highest IdTagihan
        const latestData = await mongoose.connection.db.collection('DataTagihan').findOne({}, { sort: { _id: -1 } });
        let nextIdTagihan = 1;
        if (latestData) {
            nextIdTagihan = latestData.IdTagihan + 1;
        }

        // Construct the document to be inserted with the next IdTagihan
        const documentToInsert = {
            ...req.body,
            IdTagihan: nextIdTagihan
        };

        // Use the native MongoDB driver through mongoose to match shell command
        const result = await mongoose.connection.db.collection('DataTagihan').insertOne(documentToInsert);
        
        res.status(201).json({
            message: "DataTagihan created successfully",
            data: documentToInsert
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }    
});

router.delete('/:IdTagihan', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Convert IdTagihan string to number
        const IdTagihan = parseInt(req.params.IdTagihan);
        
        // Use the native MongoDB driver through mongoose to match shell command
        const result = await mongoose.connection.db.collection('DataTagihan').deleteOne({ IdTagihan: IdTagihan });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "DataTagihan not found" });
        }
        
        res.json({ message: "DataTagihan deleted successfully" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});


module.exports = router;