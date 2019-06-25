require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.SERVER_PORT || 3011;
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.listen(port, () => {
    console.log(`Aplikasi sedang berjalan pada port ${port} ya gan`);
    
});

//GET data
// app.get('/', (req, res) => {
//     res.send('Hello Good People');
// });

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
        res.json(result);
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
        res.json(result);
    });
});

// Delete
app.delete('/:bookid', (req, res) => {
    const bookid = req.params.bookid;

    connection.query('DELETE FROM data WHERE bookid = ?', bookid, (err, result) => {
        if (err) console.log(err);
        res.json(result);
    });
});


app.get('/', (req, res) => {
    const categoryid = req.query.categoryid;

    if (categoryid) {
        connection.query('SELECT * FROM data INNER JOIN category ON data.categoryid = category.categoryid WHERE data.categoryid = ?', categoryid, (err, result) => {
            if (err) console.log(err);
            res.json(result);
        });
    } else {
        connection.query('Select * from data', (err, result) => {
            if (err) console.log(err);
            res.json(result);
        });
    }
  
});




