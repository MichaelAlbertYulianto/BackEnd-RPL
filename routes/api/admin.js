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
        const admins = await mongoose.connection.db.collection('Admin').find().toArray();
        
        if (!admins || admins.length === 0) {
            return res.status(404).json({ message: "No admins found" });
        }

        // Fetch additional data from Instansi collection for each admin with IdInstansi
        const adminsWithInstansiData = await Promise.all(admins.map(async (admin) => {
            if (admin.IdInstansi) {
                const instansiData = await mongoose.connection.db.collection('Instansi')
                    .findOne({ IdInstansi: admin.IdInstansi });
                return {
                    ...admin,
                    Instansi: instansiData
                };
            } else {
                return admin;
            }
        }));

        res.json(adminsWithInstansiData);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred",
            error: err.message 
        });
    }
});

router.get('/:IdAdmin', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Convert IdAdmin string to number
        const IdAdmin = parseInt(req.params.IdAdmin);
        
        // Use the native MongoDB driver through mongoose to match shell command
        const found = await mongoose.connection.db.collection('Admin').findOne({ IdAdmin: IdAdmin });
        
        if (!found) {
            return res.status(404).json({ message: "No Admin found" });
        }
        
        // Fetch additional data from Instansi collection for the admin with IdInstansi
        if (found.IdInstansi) {
            const instansiData = await mongoose.connection.db.collection('Instansi')
                .findOne({ IdInstansi: found.IdInstansi });
            found.Instansi = instansiData;
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

        // Validate required fields (removed IdAdmin since it will be auto-generated)
        const requiredFields = ['Nama', 'Password', 'IdInstansi'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }

        // Instead of making an HTTP request, directly query the Instansi collection
        const instansiData = await mongoose.connection.db.collection('Instansi')
            .findOne({ IdInstansi: parseInt(req.body.IdInstansi) });
            
        if (!instansiData) {
            return res.status(404).json({ message: 'Institution not found' });
        }

        // Get the latest admin record to determine next IdAdmin
        const latestAdmin = await mongoose.connection.db.collection('Admin')
            .find()
            .sort({ IdAdmin: -1 })
            .limit(1)
            .toArray();
        
        // Set new IdAdmin (if no records exist, start from 1)
        const nextIdAdmin = latestAdmin.length > 0 ? latestAdmin[0].IdAdmin + 1 : 1;

        // Construct admin data with auto-generated IdAdmin and fixed Role
        const adminData = {
            IdAdmin: nextIdAdmin,
            Role: "Admin Instansi", // Role is now automatically set
            Nama: req.body.Nama,
            Email : req.body.Email,
            Password: req.body.Password,
            Instansi: instansiData // Only store the reference to the institution
        };
        
        // Use the native MongoDB driver through mongoose to match shell command
        const result = await mongoose.connection.db.collection('Admin').insertOne(adminData);
        
        res.status(201).json({
            message: "Admin created successfully",
            data: adminData
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});

router.put('/:IdAdmin', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Convert IdAdmin string to number
        const IdAdmin = parseInt(req.params.IdAdmin);
        
        // Use the native MongoDB driver through mongoose to match shell command
        const found = await mongoose.connection.db.collection('Admin').findOne({ IdAdmin: IdAdmin });
        
        if (!found) {
            return res.status(404).json({ message: "No Admin found" });
        }
        
        // Update admin data
        const updatedAdminData = {
            ...found,
            Nama: req.body.Nama,
            Email: req.body.Email,
            Password: req.body.Password
        };
        
        // Use the native MongoDB driver through mongoose to match shell command
        const result = await mongoose.connection.db.collection('Admin').updateOne({ IdAdmin: IdAdmin }, { $set: updatedAdminData });
        
        res.json({
            message: "Admin updated successfully",
            data: updatedAdminData
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});

router.delete('/:IdAdmin', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Convert IdAdmin string to number
        const IdAdmin = parseInt(req.params.IdAdmin);
        
        // Use the native MongoDB driver through mongoose to match shell command
        const result = await mongoose.connection.db.collection('Admin').deleteOne({ IdAdmin: IdAdmin });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }
        
        res.json({ message: "Admin deleted successfully" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});


module.exports = router;