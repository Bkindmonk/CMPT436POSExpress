'use strict';
var debug = require('debug');
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var path = require('path');

var app = express();

app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//default port 80
app.set('port', process.env.PORT || 80);



var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});


var con = mysql.createConnection({
    host: "localhost",
    user: "tempuser",
    password: "temppass",
    insecureAuth: true,
    port: 3306
});

//SETUP database
var sql_create_table = "CREATE TABLE items (name VARCHAR(255) KEY, description TEXT, quantity INT, image LONGTEXT)";
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    con.query("USE mydb", function (err, result) {
        if (err) throw err;
        console.log("mydb selected");
    });

    con.query("DROP TABLE IF EXISTS items", function (err, result) {
        if (err) throw err;
        console.log("Tables dropped");
    });

    con.query(sql_create_table, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
});

function checkToken(token) {
    return true;
}

//list all items
app.get("/list", function (req, res) {
    
    var ClientReq = req.body;
    var authToken = ClientReq.auth_token;
    if (!checkToken(authToken)) {
        res.statusCode = 403;
        res.body = "<h1>403 Forbidden</h1>"
        res.end();
        throw Error;
    }
    console.log("Get got");
        con.query("SELECT * FROM items ORDER BY name", function (err, result, fields) {
            if (err) throw err;
            //RESPOND TO CLIENT WITH ALL ITEMS
            res.json({
                items:result
            });
            //console.log(result);
            //res.send(result);
            res.end();
        });
});


var sql_show_item_info = "";
app.get('/item', function (req, res) {
    var ClientReq = req.body;
    var authToken = ClientReq.auth_token;
    if (!checkToken(authToken)) {
        res.statusCode = 403;
        res.body = "<h1>403 Forbidden</h1>"
        res.end();
        throw Error;
    }
    //TODO Show item information
        console.log("Connected!");
        con.query(sql_show_item_info, function (err, result) {
            if (err) throw err;
            //RESPOND TO CLIENT WITH INFO
            console.log(result);
        });
});

var sql_update_item_qty_1 = "UPDATE items SET quantity = ";
var sql_update_item_qty_2 = " WHERE name = '"
app.post('/itemQty', function (req, res) {
    var ClientReq = req.body;
    var authToken = ClientReq.auth_token;
    if (!checkToken(authToken)) {
        res.statusCode = 403;
        res.body = "<h1>403 Forbidden</h1>"
        res.end();
        throw Error;
    }
    //TODO update item
    var itemName = "temp";
    var newQty = 0;
    //set new quantity and name
    console.log(req.body);
    itemName = ClientReq.name;
    newQty = newQty + ClientReq.quantity;

    var sql_update_item_qty = sql_update_item_qty_1 + newQty + sql_update_item_qty_2 + itemName+ "'";

        console.log("Connected!");
        con.query(sql_update_item_qty, function (err, result) {
            if (err) throw err;
            //RESPOND TO CLIENT WITH NEW ITEM DETAILS
            res.json({
                name: itemName,
                quantity: newQty
            })
            res.end();
            console.log(result);
        });
});

var sql_receive_item = "INSERT IGNORE INTO items (name, description, quantity, image) VALUES ('";
app.put('/item', function (req, res) {
    var ClientReq = req.body;
    var authToken = ClientReq.auth_token;
    if (!checkToken(authToken)) {
        res.statusCode = 403;
        res.body = "<h1>403 Forbidden</h1>"
        res.end();
        throw Error;
    }

    //TODO receive new item
    var itemName = "temp";
    var descr = "description"
    var image = "tempImage"
    var newQty = 0;


    itemName = ClientReq.name;
    descr = ClientReq.description;
    newQty = ClientReq.quantity;
    image = ClientReq.image;

    if (image == null) {
        image = "NULL"
    }
    console.log(image);
    var sql_receive_item2 = sql_receive_item + itemName + "' , '" + descr + "' , " + newQty + " , '" +image + "')";
    
        con.query(sql_receive_item2, function (err, result) {
            if (err) throw err;
            res.json({
                name: itemName,
                description: descr,
                quantity: newQty
            });
            res.end();
            console.log(result);
        });
});

app.delete('/', function (req, res) {
    res.statusCode = 403;
    res.body = "<h1>403 Forbidden</h1>"
    res.end();
    throw Error;
});
