const express = require('express');
var cors = require('cors');
var db = require('./database.js')
// var http = require('http');
var bodyParser = require("body-parser");


const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('public'));
app.use('/images', express.static('images'));

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.listen(port, () => {
  console.log(`server running successfully http://localhost:${port}`)
})

app.get("/api/users", (req, res, next) => {
  var sql = "select * from user"
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    else {
      res.send(rows);

    }

  });
});

app.get("/api/users/:id", (req, res, next) => {
  var sql = "select * from user where id = ?"
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.send(row)

  });
});

app.post("/api/user/", (req, res, next) => {

  var data = {
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    password: req.body.password,
  }
  var sql = 'INSERT INTO user (name, email, mobile, password) VALUES (?,?,?,?)'
  var params = [data.name, data.email, data.mobile, data.password]
  db.run(sql, params, function (err, result) {
    if (err) {

      res.json({
        "message": "User already exsits for this Number",
      })
      return;
    } else {
      res.json({
        "message": "User Successfully Registered",
        "data": data,
        "id": this.lastID
      })
    }
  });
});

app.post("/api/addtocart/", (req, res) => {
  var data = {
    user_id: req.body.user_id,
    prod_id: req.body.prod_id,
    prod_name: req.body.prod_name,
    prod_image: req.body.prod_image,
    prod_price: req.body.prod_price,


  }
  var sql = 'INSERT INTO cart (user_id, prod_id, prod_name, prod_image, prod_price) VALUES (?,?,?,?,?)'
  var params = [data.user_id, data.prod_id, data.prod_name, data.prod_image, data.prod_price]
  db.run(sql, params, function (err, result) {
    if (err) {
      res.json({
        "data": null,

      })
      return;
    } else {
      res.json({
        "data": data,

        "cart_id": this.lastID

      })
    }
  });
});

app.post("/api/removefromcart/", (req, res) => {
  var data = {
    cart_id: req.body.cart_id
  }
  var sql = 'DELETE FROM cart WHERE cart_id = ?'
  var params = [data.cart_id]
  db.run(sql, params, function (err, result) {
    if (err) {
      res.json({
        "data": null
      })
      return;
    } else {
      res.json({
        "data": 1
      })
    }
  })
});

app.post("/api/cart/", function (req, res) {
  var data = {
    id: req.body.id
  }
  var sql = 'SELECT * FROM cart where user_id = ?'
  var params = [data.id]
  db.all(sql, params, function (err, cart) {
    if (err) {
      res.status(400).json({ "error": err.message });

      return;
    } else {
      if (cart) {

        res.json({
          "data": cart,
        });
      } else {
        res.json({
          "data": [],
        });
      }
    }
  })
});

app.get("/api/cart", function (req, res) {
  var sql = "select * from cart"
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    else {
      res.send(rows);

    }

  })
});

app.post("/api/userLogin/", (req, res, next) => {
  var data = {
    mobile: req.body.mobile,
    password: req.body.password,
  }
  var sql = 'SELECT * FROM user where mobile = ?'
  var params = [data.mobile]
  db.get(sql, params, function (err, user) {
    if (err) {
      res.status(400).json({ "error": err.message });

      return;

    } else {
      if (user) {
        if (user.password == data.password) {
          res.json({
            "data": user,
            "message": "User Logged in",

          });
        } else {
          res.json({
            "data": null,
            "message": "Incorrect Password",

          });
        }
      } else {
        res.json({
          "data": null,
          "message": "Account Does Not Exists",

        })
      }
    }
  });
});






app.get("/api/saarees", (req, res, next) => {
  var sql = "select * from Saaree"
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.send(rows)
    // res.json({
    //     "message":"success",
    //     "data":rows
    // })
  });
});

app.get("/api/saarees/:saaree_id", (req, res, next) => {
  var sql = "select * from Saaree where saaree_id = ?"
  var params = [req.params.saaree_id]
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.send(row)
    // res.json({
    //     "message":"success",
    //     "data":row
    // })
  });
});

