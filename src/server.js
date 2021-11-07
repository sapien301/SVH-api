const express = require('express');
const multer = require('multer')
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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now()+file.originalname)
  }
})
var upload = multer({
  storage: storage,
})


app.post('/api/getPic', upload.single('picture'), function (req, res, next) {
  if (!req.file) {
    res.json({
      message: "Something went wrong",
      fname : ""
    })


  } else {
    res.json({
      message: "Picture Uploaded",
      fname: req.file.filename

    })
  }
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})


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

        // "cart_id": this.lastID

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

app.post("/api/order/", (req, res) => {
  var data = {
    o_id: req.body.cart_id,
    user_id: req.body.user_id,
    prod_id: req.body.prod_id,
    prod_name: req.body.prod_name,
    prod_image: req.body.prod_image,
    prod_price: req.body.prod_price,


  }
  var sql = 'INSERT INTO orders (o_id,user_id, prod_id, prod_name, prod_image, prod_price) VALUES (?,?,?,?,?,?)'
  var params = [data.o_id, data.user_id, data.prod_id, data.prod_name, data.prod_image, data.prod_price]
  db.run(sql, params, function (err, result) {
    if (err) {
      res.json({
        "data": null,

      })
      return;
    } else {
      res.json({
        "data": data,

      })
    }
  });
});

app.post("/api/shipD/", (req, res) => {
  var data = {
    user_id: req.body.user_id,
    Add1: req.body.Add1,
    Add2: req.body.Add2,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode,
    date: req.body.date,
    name: req.body.name,
    mobile: req.body.mobile,
    o_id: req.body.o_id,
    p_id: req.body.p_id,


  }

  var sql = 'UPDATE orders SET Address1= ? ,Address2= ? ,city = ?,state= ?,pincode=?,day = ?,name = ?,mobile = ? where o_id = ?'
  var params = [data.Add1, data.Add2, data.city, data.state, data.pincode, data.date, data.name, data.mobile, data.o_id]
  db.run(sql, params, function (err, result) {
    if (err) {
      res.json({
        "data": null,

      })
      return;
    } else {
      res.json({
        "data": data,

      })
    }
  });

  var sql1 = 'UPDATE Saaree SET stock=stock - 1 where saaree_id= ?'
  var params1 = [data.p_id]
  db.run(sql1, params1, function (err, result) {

    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }

  });
});

app.post("/api/uorders/", function (req, res) {
  var data = {
    id: req.body.id
  }
  var sql = 'SELECT * FROM orders where user_id = ?'
  var params = [data.id]
  db.all(sql, params, function (err, order) {
    if (err) {
      res.status(400).json({ "error": err.message });

      return;
    } else {
      if (order) {

        res.json({
          "data": order,
        });
      } else {
        res.json({
          "data": [],
        });
      }
    }
  })
});

app.post("/api/cop/", function (req, res) {
  var data = {
    id: req.body.cart_id
  }
  var sql = 'SELECT * FROM orders where o_id = ?'
  var params = [data.id]
  db.all(sql, params, function (err, order) {
    if (err) {
      res.status(400).json({ "error": err.message });

      return;
    } else {
      if (order) {

        res.json({
          "data": order,
        });
      } else {
        res.json({
          "data": [],
        });
      }
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

app.get("/api/orders", (req, res, next) => {
  var sql = "SELECT * from orders where Address1 != 'NULL' AND dstatus != 1"
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        "data": null,
      });
      return;
    }

    res.json({

      "data": rows
    })
  });
});

app.get("/api/corders", (req, res, next) => {
  var sql = "SELECT name,city,prod_name,prod_price,delivery,day,dday from orders where dstatus = 1"
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        "data": null,
      });
      return;
    }

    res.json({

      "data": rows
    })
  });
});

app.post("/api/uDDetails", (req, res, next) => {
  var data = {
    o_id: req.body.o_id,
    t_id: req.body.t_id,
    dp: req.body.dp
  }
  var sql = 'UPDATE orders SET tracking_id = ?,delivery = ? where o_id = ?'
  var params = [data.t_id, data.dp, data.o_id]
  db.run(sql, params, function (err, result) {
    if (err) {
      res.json({
        "data": null,

      })
      return;
    } else {
      res.json({
        "data": data,

      })
    }
  });
})

app.post("/api/dstat", (req, res, next) => {
  var data = {
    o_id: req.body.o_id,
    stat: req.body.stat,
    comment: req.body.comment,
    dday: req.body.date,
  }
  var sql = 'UPDATE orders SET dstatus = ?,comment = ?, dday = ? where o_id = ?'
  var params = [data.stat, data.comment, data.dday, data.o_id]
  db.run(sql, params, function (err, result) {
    if (err) {
      res.json({
        "data": null,

      })
      return;
    } else {
      res.json({
        "data": data,

      })
    }
  });
})

app.post("/api/myorders", (req, res) => {
  var data = {
    id: req.body.user_id
  }
  var sql = "SELECT * FROM orders where user_id = ? AND day != 'NULL'"
  var params = [data.id]
  db.all(sql, params, function (err, orders) {
    if (err) {
      res.json({
        "data": null
      })

      return;
    } else {


      res.json({
        "data": orders,
      });

    }
  }
  )
})


app.post("/api/removeproduct", (req, res) => {
  var data = {
    prod_id: req.body.prod_id
  }
  var sql = 'DELETE FROM Saaree WHERE saaree_id = ?'
  var params = [data.prod_id]
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

app.post("/api/addProduct",(req,res)=>{
  var data = {
    name : req.body.name,
    price : req.body.price,
    description : req.body.description,
    stock : req.body.stock,
    image1 : req.body.image1,
    image2 : req.body.image2,
    image3 : req.body.image3,
  }
  var sql = 'INSERT INTO Saaree (saaree_name,price,description,stock,image1,image2,image3) VALUES (?,?,?,?,?,?,?)'
  var params = [data.name,data.price,data.description,data.stock,data.image1,data.image2,data.image3]
  db.run(sql, params, function (err, result) {
    if (err) {
      res.json({
        "data": null,
        "report" : "Something went wrong"
      })
      return;
    } else {
      res.json({
        "data": 1,
        "report" : "Product Added"
      })
    }
  })

})

// app.post("/api/sProducts", (req, res) => {
//   var data = {
//     keyword: req.body.keyword,
//   }
//   var sql = "SELECT * from Saaree WHERE keywords='?'"
//   var params = [data.keyword]
//   db.all(sql, params, function (err, result) {
//     if (err) {
//       res.status(400).json({ "error": err.message });
//       console.log(err.message)

//       return;
//     } else {


//       res.json({
//         "data": result,
//       });

//     }
//   }
//   )
// })

