const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


//get method
router.get('/', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Use the native MongoDB driver through mongoose to match shell command
        const foundMahasiswa = await mongoose.connection.db.collection('Mahasiswa').find().toArray();
        const foundTagihan = await mongoose.connection.db.collection('Tagihan').find({ VA: { $in: foundMahasiswa.map(mahasiswa => mahasiswa.VA) } }).toArray();
        
        if (!foundMahasiswa || foundMahasiswa.length === 0) {
            return res.status(404).json({ message: "No students found" });
        }
        
        // Combine Mahasiswa and Tagihan details
        const combinedDetails = foundMahasiswa.map(mahasiswa => {
            const tagihanDetails = foundTagihan.filter(tagihan => tagihan.VA === mahasiswa.VA);
            return { ...mahasiswa, tagihanDetails };
        });
        
        res.json(combinedDetails);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});

//get method
router.get('/:nim', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Convert NIM string to number
        const nimNumber = parseInt(req.params.nim);
        
        // Use the native MongoDB driver through mongoose to match shell command
        const found = await mongoose.connection.db.collection('Mahasiswa').findOne({ NIM: nimNumber });
        
        if (!found) {
            return res.status(404).json({ message: "No student found" });
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
        const requiredFields = ['NIM', 'Password', 'Tanggal Lahir', 'NamaOrangTua', 'IdInstansi', 'nama', 'Jurusan'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }

        // Check if IdInstansi exists in Instansi collection
        const instansiData = await mongoose.connection.db.collection('Instansi')
            .findOne({ IdInstansi: req.body.IdInstansi });
        if (!instansiData) {
            return res.status(404).json({ message: 'Institution not found' });
        }

        // Generate VA in the format of IdInstansi + NIM
        const VA = req.body.IdInstansi + req.body.NIM;

        // Construct mahasiswa data with auto-generated saldo and VA
        const mahasiswaData = {
            NIM: req.body.NIM,
            Password: req.body.Password,
            'Tanggal Lahir': req.body['Tanggal Lahir'],
            NamaOrangTua: req.body.NamaOrangTua,
            VA: VA,
            IdInstansi: req.body.IdInstansi,
            nama: req.body.nama,
            saldo: 0,
            Jurusan: req.body.Jurusan
        };

        // Construct default tagihan data
        const tagihanData = {
            VA: VA,
            Tagihan: 0,
            Keterangan: "",
            Status: "",
            TenggatBayar: "",
            TahunAkademik: ""
        };

        // Use the native MongoDB driver through mongoose to match shell command
        const resultMahasiswa = await mongoose.connection.db.collection('Mahasiswa').insertOne(mahasiswaData);
        const resultTagihan = await mongoose.connection.db.collection('Tagihan').insertOne(tagihanData);

        res.status(201).json({
            message: "Mahasiswa and Tagihan created successfully",
            data: mahasiswaData,
            tagihanData: tagihanData
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});

router.put('/:nim', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Convert NIM string to number
        const nimNumber = parseInt(req.params.nim);

        // Validate required fields
        const requiredFields = ['Password', 'Tanggal Lahir', 'NamaOrangTua', 'IdInstansi', 'nama', 'Jurusan'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }

        // Check if IdInstansi is available in Instansi collection
        const instansiData = await mongoose.connection.db.collection('Instansi')
            .findOne({ IdInstansi: req.body.IdInstansi });
        if (!instansiData) {
            return res.status(404).json({ message: 'Institution not found' });
        }

        // Generate VA in the format of IdInstansi + NIM if NIM or IdInstansi changed
        const VA = req.body.IdInstansi + req.body.NIM;

        // Construct update data from request body
        const updateData = {
            Password: req.body.Password,
            'Tanggal Lahir': req.body['Tanggal Lahir'],
            NamaOrangTua: req.body.NamaOrangTua,
            VA: VA,
            IdInstansi: req.body.IdInstansi,
            nama: req.body.nama,
            Jurusan: req.body.Jurusan
        };

        // Allow client to set saldo to 0 if specified
        if (req.body.saldo !== undefined) {
            updateData.saldo = req.body.saldo;
        }

        // Use the native MongoDB driver through mongoose to match shell command
        const result = await mongoose.connection.db.collection('Mahasiswa').updateOne({ NIM: nimNumber }, { $set: updateData });
        
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "No student found" });
        }
        
        res.json({ message: "Mahasiswa updated successfully" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }
});

router.delete('/:nim', async (req, res) => {
    try {
        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: "Database connection not ready" });
        }

        // Convert NIM string to number
        const nimNumber = req.params.nim;

        // First, find the mahasiswa to get the VA
        const mahasiswa = await mongoose.connection.db.collection('Mahasiswa').findOne({ NIM: nimNumber });
        if (!mahasiswa) {
            return res.status(404).json({ message: "No student found" });
        }

        // Delete tagihan based on VA
        const tagihanResult = await mongoose.connection.db.collection('Tagihan').deleteMany({ VA: mahasiswa.VA });
        if (tagihanResult.deletedCount > 0) {
            console.log(`Deleted ${tagihanResult.deletedCount} tagihan records`);
        }

        // Then, delete the mahasiswa data
        const mahasiswaResult = await mongoose.connection.db.collection('Mahasiswa').deleteOne({ NIM: nimNumber });

        if (mahasiswaResult.deletedCount === 0) {
            return res.status(404).json({ message: "No student found" });
        }

        res.json({ message: "Mahasiswa and related tagihan deleted successfully" });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ 
            message: "Database error occurred", 
            error: err.message 
        });
    }    
});


// Don't forget to export the router
module.exports = router;