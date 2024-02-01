const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const multer = require("multer");
//Using Filter
const fileFilter = function(req,file,cb){
    if(file.minetype === 'image/jpeg')
    {
        cb(null,true);
    }else{
        cb(new Error("Please Upload jpeg File"),false);
    }
}
//Using Filter
const storage = multer.diskStorage({
    destination : function (req,file,cb){
        cb(null,"./productImage/");
    },
    filename : function (req,file,cb)
    {
        cb(null,new Date().toDateString() + file.originalname);
    }
});

const upload = multer({
    storage:storage,
    limits:{
        fieldSize : 1024*1024*5,
    },
    fileFilter : fileFilter,
})

router.get("/",(req,res,next)=>{
    Product.find({},"name price _id")
    .then((doc)=>{
        const response = {
            doc : doc.map((resault)=>{
                return {
                    name  : resault.name,
                    price : resault.price,
                    _id   : resault._id,
                    url   : {
                        type : "GET",
                        urls  : "localhost:3000/products/"+resault._id,
                    }
                }
            })
        };

        res.status(200).json({
            products : response
        });
    })
    .catch((err)=>{
        res.status(404).json({
            message : err.message,
        });
    });
});

router.post("/addProduct",upload.single('myfile'),(req,res,next)=>{
    
    console.log(req.file);

const product = new Product({
    name : req.body.name,
    price : req.body.price,
    image : req.file.path,
});
product.save()
.then((product)=>{
    res.status(200).json({
        message : "Added Product",
        product : product,
    });
})
.catch((err)=>{
    res.status(404).json({
        message : err.message,
    });
});
});

//Get Single Product
router.get("/:productId",(req,res,next)=>{
Product.find({_id : req.params.productId},"name price _id")
.then((product) => {
    const response = {
        doc : product.map((resault)=>{
            return {
                name  : resault.name,
                price : resault.price,
                _id   : resault._id,
                url   : {
                    type : "GET",
                    urls  : "localhost:3000/products/"+resault._id,
                }
            }
        })
    };
    res.status(200).json({
        product : response,
    });
})
.catch((err)=>{
    res.status(404).json({
        message : err.message,
    });
});
});

router.patch("/:productId",(req,res,next)=>{
const newProduct = {
    name  : req.body.name,
    price : req.body.price,
}
Product.updateOne({_id:req.params.productId},{$set : newProduct})
.then((product)=>{
    res.status(200).json({
        message : product,
        product : newProduct
    });
})
.catch((err)=>{
    res.status(404).json({
        message : err.message,
    });
});

});

router.delete("/:productId",(req,res,next)=>{
Product.deleteOne({_id : req.params.productId})
.then((product)=>{
    res.status(200).json({
        product:"Deleted Succefually",
    });
})
.catch((err)=>{
    res.status(404).json({
        message : err.message,
    });
});
});

module.exports = router;