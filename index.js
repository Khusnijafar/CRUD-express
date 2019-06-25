require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.SERVER_PORT || 3011;
var cors = require('cors');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors());

app.listen(port, () => {
    console.log(`Aplikasi sedang berjalan pada port ${port} ya gan`);
    
});

app.get('/', (req, res) => {
    const data = req.query.categoryid;
    const location = req.query.location;

    if (data) {
        connection.query('SELECT * FROM data INNER JOIN category ON data.categoryid = category.categoryid WHERE data.categoryid = ?', data, (err, result) => {
            if (err) console.log(err);
            res.status(200).json({
                success: true,
                message: "Berikut datanya ya pemirsa",
                data: result,
            });
            
        });
    } else if (location) {
        connection.query('SELECT * FROM data WHERE location = ?', location, (err, result) => {
            if (err) console.log(err);
            res.status(200).json({
                success: true,
                message: "Berikut datanya ya pemirsa",
                data: result,
            });
        });
    } else {
        connection.query('SELECT * FROM data', (err, result) => {
            if (err) console.log(err);
            res.status(200).json({
                message: "Berikut datanya ya pemirsa",
                data: result,
            });
        });
        
    }
  
});

// POST data
app.post('/', (req, res) => {
    const index = {
        title : req.body.title,
        writer : req.body.writer,
        location : req.body.location,
        categoryid : req.body.categoryid,
    };
    connection.query('INSERT INTO data SET ?', index, (err, result) => {
        if (err) console.log(err);
        res.status(200).json({
            success: true,
            message: "Mantap, data berhasil ditambahkan agan,sista",
            data: result,
        });
    });
});

// Patch
app.patch('/:bookid', (req, res) => {
    const bookid = req.params.bookid;

    const index = {
        title : req.body.title,
        writer : req.body.writer,
        location : req.body.location,
        categoryid : req.body.categoryid,
    };
    connection.query(`UPDATE data SET ? WHERE bookid = ?`, [index, bookid], (err, result) => {
        if (err) console.log(err);
        res.status(200).json({
            success: true,
            message: "Datanya berhasil kamu edit ya, selamat",
            data: result,
        });
    });
});

// Delete
app.delete('/:bookid', (req, res) => {
    const bookid = req.params.bookid;

    connection.query('DELETE FROM data WHERE bookid = ?', bookid, (err, result) => {
        if (err) console.log(err);
        res.status(200).json({
            success: true,
            message: "Datanya berhasil dihapus",
            data: result,
        });
    });
});






