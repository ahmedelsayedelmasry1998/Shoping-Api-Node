var express = require("express");
var router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "This Is jsonwebtoken Secret From My App";

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", (req, res, next) => {
  User.find({ username: req.body.username })
    .then((doc) => {
      if (doc.length < 1) {
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            const user = new User({
              username: req.body.username,
              password: hash,
            });
            user
              .save()
              .then((doc) => {
                console.log(doc);
                res.status(200).json({
                  message: doc,
                });
              })
              .catch((err) => {
                res.status(404).json({
                  message: err.message,
                });
              });
          })
          .catch((err) => {
            res.status(404).json({
              message: err.message,
            });
          });
      } else {
        res.status(404).json({
          message: "This User Is Aleardy Exisit",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/signin", (req, res, next) => {
  User.find({ username: req.body.username })
    .then((doc) => {
      if (doc.length >= 1) {
        bcrypt.compare(req.body.password, doc[0].password)
          .then((resault) => {
            if (resault) {
              res.status(200).json({
                message: 'Success Signin'
              });
            } else {
              res.status(404).json({
                message: 'Wrong Password'
              });
            }
          })
          .catch((err) => {
            res.status(404).json({
              message: err.message,
            });
          });
      } else {
        res.status(404).json({
          message: "Wrong Username ...",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: err.message,
      });
    });

});

router.get("/login",(req,res,next)=>{
User.find({username : req.body.username})
.then((user)=>{

console.log(user);
let token = jwt.sign({user},JWT_SECRET,{
  expiresIn : "1h"
});
res.json({
  token : token,
})

})
.catch((err) =>{
  console.log(err);
})
});


router.post("/login",(req,res,next)=>{

  let token = req.header('Authorization');
 // console.log(token);
    
    try{
     let data =  jwt.verify(token,JWT_SECRET);
     res.json({
      data
     });
    }
    catch(err)
    {
      res.json({
        user : false,
      });
    }
  });



router.patch("/updateUser/:id", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = {
        username: req.body.username,
        password: hash,
      };
      User.updateOne({ _id: req.params.id }, { $set: user })
        .then((doc) => {
          if (doc) {
            res.status(202).json({
              message: 'User Aleardy Updated'
            });
          } else {
            res.status(404).json({
              message: 'User Not Found'
            });
          }
        })
        .catch((err) => {
          res.status(404).json({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        message: err.message,
      });
    });

});

router.delete("/deleteUser/:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          message: 'User Deleted',
        });
      } else {
        res.status(404).json({
          message: 'User Not Found',
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: err.message,
      });
    });
});

/** Token
 * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjpbeyJfaWQiOiI2NWE3MTllYWZiZjA4YTcwZTNjNTgwYmQiLCJ1c2VybmFtZSI6IkFobWVkIEVMbWFzcnkiLCJwYXNzd29yZCI6IiQyYiQxMCRRc1RJN0xZdFZCbi9ocTFUZ1hoc3ouSkguVlB0T0Zlei9KMW4wSmRxQ0c4cXpmTldZYkl1TyIsIl9fdiI6MH1dLCJpYXQiOjE3MDYyMzc3MDgsImV4cCI6MTcwNjI0MTMwOH0.LPTXjNX6Ez7kbPsrEdUzjFwmkS81Bky865Hbc-R-KFw
 */

module.exports = router;
