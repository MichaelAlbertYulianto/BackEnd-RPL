const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { route } = require("./mahasiswa");

router.get("/", async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Use the native MongoDB driver through mongoose to match shell command
        const found = await mongoose.connection.db.collection('Instansi').find().toArray();
        
        if (!found || found.length === 0) {
            return res.status(404).json({ message: "No students found" });
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

router.get('/:IdInstansi', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Convert IdInstansi string to number
        const IdInstansi = parseInt(req.params.IdInstansi);
        
        // Use the native MongoDB driver through mongoose to match shell command
        const found = await mongoose.connection.db.collection('Instansi').findOne({ IdInstansi: IdInstansi });
        
        if (!found) {
            return res.status(404).json({ message: "No Instansi found", IdInstansi: IdInstansi });
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

router.post('/', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Validate required fields
        const requiredFields = ['NamaInstansi', 'Logo'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }

        const latestInstansi = await mongoose.connection.db.collection('Instansi')
        .find()
        .sort({ IdInstansi: -1 })
        .limit(1)
        .toArray();
        const nextIdInstansi = latestInstansi.length > 0 ? latestInstansi[0].IdInstansi + 1 : 1;

        // Construct instansi data
        const instansiData = {
            IdInstansi: nextIdInstansi,
            NamaInstansi: req.body.NamaInstansi,
            Saldo : 0,
            Logo : req.body.Logo
        };

        // Use the native MongoDB driver through mongoose to match shell command
        const result = await mongoose.connection.db.collection('Instansi').insertOne(instansiData);
        
        res.status(201).json({
            message: "Instansi created successfully",
            data: instansiData
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});

router.delete('/:IdInstansi', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Convert IdInstansi string to number
        const IdInstansi = parseInt(req.params.IdInstansi);
        
        // Use the native MongoDB driver through mongoose to match shell command
        const result = await mongoose.connection.db.collection('Instansi').deleteOne({ IdInstansi: IdInstansi });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Instansi not found" });
        }
        
        res.json({ message: "Instansi deleted successfully" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});

router.put('/:IdInstansi', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Convert IdInstansi string to number
        const IdInstansi = parseInt(req.params.IdInstansi);
        
        // Filter the request body to only include NamaInstansi and Logo
        const updateData = {
            NamaInstansi: req.body.NamaInstansi,
            Logo: req.body.Logo
        };

        // Use the native MongoDB driver through mongoose to match shell command
        const result = await mongoose.connection.db.collection('Instansi').updateOne({ IdInstansi: IdInstansi }, { $set: updateData });
        
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Instansi not found" });
        }
        
        res.json({ message: "Instansi updated successfully" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});


module.exports = router;