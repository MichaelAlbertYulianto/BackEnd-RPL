const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Define port
const port = process.env.PORT || 3000;

    // Swagger configuration
    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Payment API',
                version: '1.0.0',
                description: 'API for managing payments and transactions',
            },
            servers: [
                {
                    url: '{url}',
                    description: 'Ngrok server',
                    variables: {
                        url: {
                            default: ''
                        }
                    }
                }
            ],
            tags: [
                { name: 'Mahasiswa', description: 'Student operations' },
                { name: 'Admin', description: 'Admin operations' },
                { name: 'Instansi', description: 'Institution operations' },
                { name: 'Tagihan', description: 'Bill operations' },
                { name: 'LogTransaksi', description: 'Transaction log operations' },
                { name: 'DataTagihan', description: 'Tagihan data operations' }
            ],
            paths: {
                '/API/Mahasiswa': {
                    get: {
                        tags: ['Mahasiswa'],
                        summary: 'Get all students with their tagihan details',
                        responses: {
                            '200': {
                                description: 'List of all students with their tagihan details',
                            },
                            '404': {
                                description: 'No students found',
                            },
                            '500': {
                                description: 'Database error occurred',
                            }
                        }
                    },
                    post: {
                        tags: ['Mahasiswa'],
                        summary: 'Create new student and associated tagihan',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['NIM', 'Password', 'Tanggal Lahir', 'NamaOrangTua', 'IdInstansi', 'nama', 'Jurusan'],
                                        properties: {
                                            NIM: {
                                                type: 'integer',
                                                description: 'Student ID number'
                                            },
                                            Password: {
                                                type: 'string',
                                                description: 'Student password'
                                            },
                                            'Tanggal Lahir': {
                                                type: 'string',
                                                description: 'Student birthdate'
                                            },
                                            NamaOrangTua: {
                                                type: 'string',
                                                description: 'Student parent name'
                                            },
                                            IdInstansi: {
                                                type: 'integer',
                                                description: 'Institution ID'
                                            },
                                            nama: {
                                                type: 'string',
                                                description: 'Student name'
                                            },
                                            Jurusan: {
                                                type: 'string',
                                                description: 'Student major'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            '201': {
                                description: 'Student and associated tagihan created successfully',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: {
                                                    type: 'string',
                                                    example: 'Student and associated tagihan created successfully'
                                                },
                                                data: {
                                                    type: 'object',
                                                    properties: {
                                                        NIM: {
                                                            type: 'string',
                                                            description: 'Student ID number'
                                                        },
                                                        VA: {
                                                            type: 'string',
                                                            description: 'Virtual Account number'
                                                        }
                                                    }
                                                },
                                                tagihanData: {
                                                    type: 'object',
                                                    properties: {
                                                        VA: {
                                                            type: 'string',
                                                            description: 'Virtual Account number'
                                                        },
                                                        Tagihan: {
                                                            type: 'integer',
                                                            description: 'Initial bill amount'
                                                        },
                                                        Keterangan: {
                                                            type: 'string',
                                                            description: 'Bill description'
                                                        },
                                                        Status: {
                                                            type: 'string',
                                                            description: 'Bill status'
                                                        },
                                                        TenggatBayar: {
                                                            type: 'string',
                                                            description: 'Payment deadline'
                                                        },
                                                        TahunAkademik: {
                                                            type: 'string',
                                                            description: 'Academic year'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            '400': {
                                description: 'Missing required field or invalid input'
                            },
                            '404': {
                                description: 'Institution not found'
                            },
                            '500': {
                                description: 'Database error occurred'
                            }
                        }
                    }
                },
                '/API/Mahasiswa/{NIM}': {
                    get: {
                        tags: ['Mahasiswa'],
                        summary: 'Get student by NIM',
                        parameters: [
                            {
                                name: 'NIM',
                                in: 'path',
                                required: true,
                                description: 'Student ID number',
                                schema: { type: 'string' }
                            }
                        ],
                        responses: {
                            '200': { description: 'Student found' },
                            '404': { description: 'Student not found' }
                        }
                    },
                    put: {
                        tags: ['Mahasiswa'],
                        summary: 'Update student by NIM',
                        parameters: [
                            {
                                name: 'NIM',
                                in: 'path',
                                required: true,
                                description: 'Student ID number',
                                schema: { type: 'string' }
                            }
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['NIM', 'Password', 'Tanggal Lahir', 'NamaOrangTua', 'IdInstansi', 'nama', 'saldo', 'Jurusan'],
                                        properties: {
                                            NIM: {
                                                type: 'string',
                                                description: 'Student ID number'
                                            },
                                            Password: {
                                                type: 'string',
                                                description: 'Student password'
                                            },
                                            'Tanggal Lahir': {
                                                type: 'string',
                                                description: 'Student birthdate'
                                            },
                                            NamaOrangTua: {
                                                type: 'string',
                                                description: 'Student parent name'
                                            },
                                            IdInstansi: {
                                                type: 'string',
                                                description: 'Institution ID'
                                            },
                                            nama: {
                                                type: 'string',
                                                description: 'Student name'
                                            },
                                            saldo: {
                                                type: 'number',
                                                description: 'Student balance'
                                            },
                                            Jurusan: {
                                                type: 'string',
                                                description: 'Student major'
                                            }
                                        }
                                    }
                                }
                            },
                            responses: {
                                '200': { description: 'Student updated successfully' },
                                '404': { description: 'Student not found' },
                                '500': { description: 'Database error occurred' }
                            }
                        }
                    },
                    delete: {
                        tags: ['Mahasiswa'],
                        summary: 'Delete a student by NIM',
                        parameters: [
                            {
                                name: 'NIM',
                                in: 'path',
                                required: true,
                                description: 'Student ID number',
                                schema: { type: 'integer' }
                            }
                        ],
                        responses: {
                            '200': { description: 'Student deleted successfully' },
                            '404': { description: 'Student not found' },
                            '500': { description: 'Database error occurred' }
                        }
                    }
                },
                '/API/Instansi': {
                    get: {
                        tags: ['Instansi'],
                        summary: 'Get all institutions',
                        responses: {
                            '200': { description: 'List of all institutions' }
                        }
                    },
                    post: {
                        tags: ['Instansi'],
                        summary: 'Create new institution',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['NamaInstansi', 'Logo'],
                                        properties: {
                                            NamaInstansi: {
                                                type: 'string',
                                                description: 'Institution name'
                                            },
                                            Logo: {
                                                type: 'string',
                                                description: 'Institution logo URL'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            '201': {
                                description: 'Institution created successfully',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: {
                                                    type: 'string',
                                                    example: 'Institution created successfully'
                                                },
                                                data: {
                                                    type: 'object',
                                                    properties: {
                                                        IdInstansi: {
                                                            type: 'integer',
                                                            description: 'Institution ID'
                                                        },
                                                        NamaInstansi: {
                                                            type: 'string',
                                                            description: 'Institution name'
                                                        },
                                                        Saldo: {
                                                            type: 'integer',
                                                            description: 'Initial balance'
                                                        },
                                                        Logo: {
                                                            type: 'string',
                                                            description: 'Institution logo URL'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            '400': {
                                description: 'Missing required field',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: {
                                                    type: 'string',
                                                    example: 'Missing required field: NamaInstansi or Logo'
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            '500': {
                                description: 'Database error occurred',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: {
                                                    type: 'string',
                                                    example: 'Database error occurred'
                                                },
                                                error: {
                                                    type: 'string',
                                                    description: 'Error message'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                '/API/Admin': {
                    get: {
                        tags: ['Admin'],
                        summary: 'Retrieve a list of all admins including their associated institution data',
                        responses: {
                            '200': { description: 'List of all admins with their institution details' },
                            '404': { description: 'No admins found' },
                            '500': { description: 'Database connection not ready or database error occurred' }
                        }
                    },
                    post: {
                        tags: ['Admin'],
                        summary: 'Create new admin',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['Nama', 'Password', 'IdInstansi', 'Email'],
                                        properties: {
                                            Nama: {
                                                type: 'string',
                                                description: 'Admin name'
                                            },
                                            Password: {
                                                type: 'string',
                                                description: 'Admin password'
                                            },
                                            IdInstansi: {
                                                type: 'integer',
                                                description: 'Institution ID'
                                            },
                                            Email: {
                                                type: 'string',
                                                description: 'Admin email'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            '201': {
                                description: 'Admin created successfully',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                message: {
                                                    type: 'string',
                                                    example: 'Admin created successfully'
                                                },
                                                data: {
                                                    type: 'object',
                                                    properties: {
                                                        IdAdmin: {
                                                            type: 'integer',
                                                            description: 'Auto-generated Admin ID'
                                                        },
                                                        Role: {
                                                            type: 'string',
                                                            example: 'Admin Instansi'
                                                        },
                                                        Nama: {
                                                            type: 'string'
                                                        },
                                                        Email: {
                                                            type: 'string'
                                                        },
                                                        Password: {
                                                            type: 'string'
                                                        },
                                                        Instansi: {
                                                            type: 'object',
                                                            properties: {
                                                                IdInstansi: {
                                                                    type: 'integer'
                                                                },
                                                                'NamaInstansi': {
                                                                    type: 'string'
                                                                },
                                                                'Saldo': {
                                                                    type: 'integer',
                                                                    description: 'Initial balance'
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            '400': {
                                description: 'Missing required fields'
                            },
                            '404': {
                                description: 'Institution not found'
                            },
                            '500': {
                                description: 'Database error occurred'
                            }
                        }
                    }
                },
                '/API/Admin/{IdAdmin}': {
                    get: {
                        tags: ['Admin'],
                        summary: 'Get admin by ID',
                        parameters: [
                            {
                                name: 'IdAdmin',
                                in: 'path',
                                required: true,
                                description: 'Admin ID',
                                schema: { type: 'integer' }
                            }
                        ],
                        responses: {
                            '200': { description: 'Admin found' },
                            '404': { description: 'Admin not found' }
                        }
                    },
                    delete: {
                        tags: ['Admin'],
                        summary: 'Delete admin by ID',
                        parameters: [
                            {
                                name: 'IdAdmin',
                                in: 'path', // Change from 'query' to 'path'
                                required: true,
                                description: 'Admin ID',
                                schema: { type: 'integer' }
                            }
                        ],
                        responses: {
                            '200': { description: 'Admin deleted successfully' },
                            '404': { description: 'Admin not found' }
                        }
                    },
                    put: {
                        tags: ['Admin'],
                        summary: 'Update admin by ID',
                        parameters: [
                            {
                                name: 'IdAdmin',
                                in: 'path',
                                required: true,
                                description: 'Admin ID',
                                schema: { type: 'integer' }
                            }
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['Nama', 'Email', 'Password'],
                                        properties: {
                                            Nama: {
                                                type: 'string',
                                                description: 'Admin name'
                                            },
                                            Email: {
                                                type: 'string',
                                                description: 'Admin email'
                                            },
                                            Password: {
                                                type: 'string',
                                                description: 'Admin password'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            '200': { description: 'Admin updated successfully' },
                            '404': { description: 'Admin not found' },
                            '500': { description: 'Database error occurred' }
                        }
                    }
                },
                '/API/Instansi/{IdInstansi}': {
                    get: {
                        tags: ['Instansi'],
                        summary: 'Get institution by ID',
                        parameters: [
                            {
                                name: 'IdInstansi',
                                in: 'path',
                                required: true,
                                description: 'Institution ID',
                                schema: { type: 'integer' }
                            }
                        ],
                        responses: {
                            '200': { description: 'Institution found' },
                            '404': { description: 'Institution not found' },
                            '500': { description: 'Database error occurred' }
                        }
                    },
                    delete: {
                        tags: ['Instansi'],
                        summary: 'Delete institution by ID',
                        parameters: [
                            {
                                name: 'IdInstansi',
                                in: 'path',
                                required: true,
                                description: 'Institution ID',
                                schema: { type: 'integer' }
                            }
                        ],
                        responses: {
                            '200': { description: 'Institution deleted successfully' },
                            '404': { description: 'Institution not found' },
                            '500': { description: 'Database error occurred' }
                        }
                    },
                    put: {
                        tags: ['Instansi'],
                        summary: 'Update institution by ID',
                        parameters: [
                            {
                                name: 'IdInstansi',
                                in: 'path',
                                required: true,
                                description: 'Institution ID',
                                schema: { type: 'integer' }
                            }
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            NamaInstansi: { type: 'string', description: 'Institution name' },
                                            Logo: { type: 'string', description: 'Institution logo URL' }
                                        },
                                        required: ['NamaInstansi', 'Logo']
                                    }
                                }
                            }
                        },
                        responses: {
                            '200': { description: 'Institution updated successfully' },
                            '404': { description: 'Institution not found' },
                            '500': { description: 'Database error occurred' }
                        }
                    }
                },
                '/API/Tagihan': {
                    get: {
                        tags: ['Tagihan'],
                        summary: 'Get all bills',
                        responses: {
                            '200': { description: 'List of all bills' }
                        }
                    }
                },
                '/API/Tagihan/{VA}': {
                    get: {
                        tags: ['Tagihan'],
                        summary: 'Get bill by VA number',
                        parameters: [
                            {
                                name: 'VA',
                                in: 'path',
                                required: true,
                                description: 'Virtual Account number',
                                schema: { type: 'string' }
                            }
                        ],
                        responses: {
                            '200': { description: 'Bill found' },
                            '404': { description: 'Bill not found' }
                        }
                    },
                    put: {
                        tags: ['Tagihan'],
                        summary: 'Update bill by VA number',
                        parameters: [
                            {
                                name: 'VA',
                                in: 'path',
                                required: true,
                                description: 'Virtual Account number',
                                schema: { type: 'string' }
                            }
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['Tagihan', 'Keterangan', 'Status', 'TenggatBayar', 'TahunAkademik'],
                                        properties: {
                                            Tagihan: { type: 'number', description: 'Bill amount' },
                                            Keterangan: { type: 'string', description: 'Bill description' },
                                            Status: { type: 'string', description: 'Bill status' },
                                            TenggatBayar: { type: 'string', description: 'Payment deadline' },
                                            TahunAkademik: { type: 'string', description: 'Academic year' }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            '200': { description: 'Bill updated successfully' },
                            '404': { description: 'Bill not found' },
                            '500': { description: 'Database error occurred' }
                        }
                    }
                },
                '/API/LogTransaksi': {
                    get: {
                        tags: ['LogTransaksi'],
                        summary: 'Get all transaction logs',
                        responses: {
                            '200': { description: 'List of all transaction logs' }
                        }
                    },
                    post: {
                        tags: ['LogTransaksi'],
                        summary: 'Create a new transaction log',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            VA: { type: 'string' },
                                            TanggalBayar: { type: 'string' },
                                            JumlahBayar: { type: 'number' },
                                            Keterangan: { type: 'string' },
                                            TenggatBayar: { type: 'string' },
                                            TahunAkademik: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            '201': { description: 'Transaction log created' },
                            '400': { description: 'Invalid request' }
                        }
                    }
                },
                '/API/LogTransaksi/{NoTransaksi}': {
                    get: {
                        tags: ['LogTransaksi'],
                        summary: 'Get transaction log by number',
                        parameters: [
                            {
                                name: 'NoTransaksi',
                                in: 'path',
                                required: true,
                                description: 'Transaction number',
                                schema: { type: 'string' }
                            }
                        ],
                        responses: {
                            '200': { description: 'Transaction log found' },
                            '404': { description: 'Transaction log not found' }
                        }
                    }
                },
                '/API/DataTagihan': {
                    get: {
                        tags: ['DataTagihan'],
                        summary: 'Get all Tagihan data',
                        responses: {
                            '200': { description: 'List of all Tagihan data' },
                            '404': { description: 'No Tagihan data found' },
                            '500': { description: 'Database error occurred' }
                        }
                    },
                    post: {
                        tags: ['DataTagihan'],
                        summary: 'Create new Tagihan data',
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['Tetap', 'Sks', 'Kesehatan', 'Terintegrasi', 'ICE', 'Tahun Ajaran'],
                                        properties: {
                                            Tetap: { type: 'number' },
                                            Sks: { type: 'number' },
                                            Kesehatan: { type: 'number' },
                                            Terintegrasi: { type: 'number' },
                                            ICE: { type: 'number' },
                                            'Tahun Ajaran': { type: 'string' }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            '201': { description: 'Tagihan created successfully' },
                            '400': { description: 'Invalid request' },
                            '500': { description: 'Database error occurred' }
                        }
                    }
                },
                '/API/DataTagihan/{IdTagihan}': {
                    put: {
                        tags: ['DataTagihan'],
                        summary: 'Update Tagihan data by IdTagihan',
                        parameters: [
                            {
                                name: 'IdTagihan',
                                in: 'path',
                                required: true,
                                description: 'Tagihan ID',
                                schema: { type: 'string' }
                            }
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            Tetap: { type: 'number' },
                                            Sks: { type: 'number' },
                                            Kesehatan: { type: 'number' },
                                            Terintegrasi: { type: 'number' },
                                            ICE: { type: 'number' }
                                        }
                                    }
                                }
                            }
                        },
                        responses: {
                            '200': { description: 'Tagihan updated successfully' },
                            '404': { description: 'No Tagihan found' },
                            '500': { description: 'Database error occurred' }
                        }
                    },
                    delete: {
                        tags: ['DataTagihan'],
                        summary: 'Delete Tagihan data by IdTagihan',
                        parameters: [
                            {
                                name: 'IdTagihan',
                                in: 'path',
                                required: true,
                                description: 'Tagihan ID',
                                schema: { type: 'string' }
                            }
                        ],
                        responses: {
                            '200': { description: 'Tagihan deleted successfully' },
                            '404': { description: 'No Tagihan found' },
                            '500': { description: 'Database error occurred' }
                        }
                    }
                }
            }
        },
        apis: ['./routes/api/*.js'], // Path to the API routes
    };

    let swaggerSpec = swaggerJsdoc(swaggerOptions);

    // Create webserver using Express instead of raw http
   // Middleware to parse JSON
app.use(express.json());

// Define a sample endpoint
app.get("/test", (req, res) => {
    res.send("Congrats, your Express app is running!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Successfully connected to MongoDB.");
    // Log database name
    const db = mongoose.connection.db;
    console.log(`Connected to database: ${db.databaseName}`);
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
});

// Monitor database connection
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB");
    // Log connection details
    const { host, port, name } = mongoose.connection;
    console.log("Connection details:");
    console.log(`Host: ${host}`);
    console.log(`Port: ${port}`);
    console.log(`Database name: ${name}`);
});

mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from MongoDB");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Routes
app.use("/API/Mahasiswa", require("./routes/api/mahasiswa"));
app.use("/API/Admin", require("./routes/api/admin"));
app.use("/API/Instansi", require("./routes/api/instansi"));
app.use("/API/Tagihan", require("./routes/api/tagihan"));
app.use("/API/LogTransaksi", require("./routes/api/logtransaksi"));
app.use("/API/DataTagihan", require("./routes/api/datatagihan"));

// Swagger setup
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
