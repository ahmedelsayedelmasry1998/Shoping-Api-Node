var express = require("express");
var router = express.Router();
const Order = require("../models/order");

router.post("/addOrder",(req,res,next)=>{
const order = new Order({
user : req.body.user,
product : req.body.product
});

order.save()
.then((doc)=>{
    res.status(200).json({
        message : doc,
    });
})
.catch((err)=>{
    res.status(404).json({
        message : err.message,
    })
});
});

router.get("/",(req,res,next)=>{
Order.find({}).populate("user","username")//This Field Name Refrace In User Schema
.then((docs)=>{
    res.status(200).json({
        message : docs,
    })
})
.catch((err)=>{
    res.status(404).json({
        message : err.message,
    })
});
});


router.patch("/updateOrder/:orderId",(req,res,next)=>{
    var newProduct = req.body.product;
   // console.log(newProduct);
Order.find({_id : req.params.orderId})
.then((doc)=>{
    var oldProduct = doc[0].product;
    for(var indexOfNewProduct = 0 ; indexOfNewProduct < newProduct.length ; indexOfNewProduct++)
    {
        for(var indexOfOldProduct = 0 ; indexOfOldProduct < oldProduct.length ; indexOfOldProduct++)
        {
            if(newProduct[indexOfNewProduct]._id === oldProduct[indexOfOldProduct]._id)
            {
                oldProduct[indexOfOldProduct].quantity = Number(oldProduct[indexOfOldProduct].quantity)
                 + Number(newProduct[indexOfNewProduct].quantity); 
                newProduct.splice(indexOfNewProduct,1);
                break;
            }
        }
    }
    // console.log(newProduct);
    // console.log(oldProduct);
    oldProduct = oldProduct.concat(newProduct);
    // console.log(oldProduct);

   const newOrder = {
    product : oldProduct,
   };
   Order.updateOne({_id : req.params.orderId},{$set : newOrder})
   .then((doc)=>{
    
    res.status(200).json({
        message : doc,
    })
   })
   .catch((err)=>{
    res.status(404).json({
            message : err.message,
        })
   });
})
.catch((err)=>{
    res.status(404).json({
        message : err.message,
    })
});
});


router.delete("/:orderId",(req,res,next)=>{
Order.deleteOne({_id : req.params.orderId})
.then((doc)=>{
    res.status(200).json({
        message : "Order Deleted",
    });
})
.catch((err)=>{
    res.status(404).json({
        message : err.message,
    });
});
});

module.exports = router;