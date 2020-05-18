var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.listen(3000);

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//Express-session for web login
var session = require('express-session');
app.set('trust proxy', 1) // trust first proxy 'A&SDha*&^@H46'
app.use(session({ secret: 'keyboard cat' , cookie: { maxAge: 60000000 }}));

//mongoose 
var mongoose = require ('mongoose');
mongoose.connect('mongodb+srv://NgHuong:374451Ha@cluster0-uwyux.mongodb.net/Moitruong?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
    if(err){
        console.log("Mongo connect err:", +err);
    }else
    {
        console.log("Mongo connected successfully");
    }
});

//bcrypt

const bcrypt = require('bcrypt');
const saltRounds = 10;

//JWT
var jwt = require('jsonwebtoken');
const secret = "Mr.KAsh*(&!@yASD??AAAA)";
//Model
const Category = require("./Models/Category");
const Hoctap = require("./Models/Hoctap");
const Giadinh = require("./Models/Giadinh");
const Vanphong = require("./Models/Vanphong");
const Khac = require("./Models/Khac");
const User = require("./Models/User");

//Upload image
//multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload/hoctap')
      cb(null, 'public/upload/vanphong')
      cb(null, 'public/upload/giadinh')
      cb(null, 'public/upload/khac')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if( file.mimetype=="image/bmp" || 
            file.mimetype=="image/png"||
            file.mimetype=="image/git"||
            file.mimetype=="image/jpg"||
            file.mimetype=="image/jpeg"
            )
        {
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("fileImage");


//Hoctap
app.get("/page/listhoctap", function(req, res){
    Hoctap.find(function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "listhoctap", hoctaps:[]});
        }else {
            console.log(items);
            res.render("home", {page: "listhoctap", hoctaps:items});
        }
    });
});


app.get("/page/hoctap", function(req, res){
    Category.find(function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "hoctap" });
        }else {
           //res.json(items);
           res.render("home", {page: "hoctap", cats:items});
        }
    });
});
app.post("/page/hoctap", function(req, res){
    //upload
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading."); 
          //res.json({kq:0});
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
          //res.json({kq:0});
        }else{
            //console.log("Upload is okay");
            //console.log(req.file); // Thông tin file đã upload
            // req.file.filename
            var hoctap = new Hoctap({
                name: req.body.txtName,
                ordering:1,
                image:req.file.filename,
                category:req.body.selectCate,
                entryprice:req.body.txtEntryprice,
                exportprice:req.body.txtExportprice,
                number:req.body.txtNumber,
                date:req.body.txtDate,
                description:req.body.txtPdfurl,
                hoctap_id:[]
            });
            hoctap.save(function(err){
                if(err){
                   // console.log("Save category error :" + err);
                    res.render("home", {page:"hoctap", message:"Save category error"});
                }else{
                    
                    Hoctap.find(function(err, items){
                        if(err){
                            console.log(err);
                            res.render("home", {page: "hoctap", hoctaps:[]});
                        }else {
                           // console.log(items);
                            res.render("home", {page: "listhoctap", hoctaps:items});
                        }
                    });        
                }
            });
            
        }
    });  
});

app.get("/page/edithoctap/:id", function(req, res){
   
    Hoctap.findById(req.params.id, function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "edithoctap" });
        }else {
           console.log(items);
           res.render("home", {page: "edithoctap", cat:items});
        }
    });
});
app.post("/page/edithoctap/:id", function(req, res){
    
        let query = {_id:req.params.id}
        upload(req, res, function(err){
        if(err){
                res.send("Xay ra loi");
        }else{
                let hoctap ={};

                hoctap.name = req.body.txtName,
                hoctap.ordering = 1,
               // hoctap.image = req.file.filedname,
                hoctap.category = req.body.selectCate,
                hoctap.entryprice = req.body.txtEntryprice,
                hoctap.exportprice = req.body.txtExportprice,
                hoctap.number =Number(req.body.txtNumber) ,
                hoctap.date = Date.parse(req.body.txtDate),
                hoctap.description = req.body.txtPdfurl;

                if(typeof(req.file)=='undefined'){
                    Hoctap.update( query, hoctap, function(err){
                        if(err){
                            console.log("Save hoctap error :" + err);
                            res.render("home", {page:"edithoctap", message:"Save hoctap error"});
                        }else{
                            res.redirect("http://localhost:3000/page/listhoctap")  ;
                        }
                    });
                }else{
                    let hoctap ={};
                    hoctap.name = req.body.txtName,
                    hoctap.ordering = 1,
                    hoctap.image = req.file.originalname,
                    hoctap.category = req.body.selectCate,
                    hoctap.entryprice = req.body.txtEntryprice,
                    hoctap.exportprice = req.body.txtExportprice,
                    hoctap.number =Number(req.body.txtNumber) ,
                    hoctap.date =Date.parse(req.body.txtDate),
                    hoctap.description = req.body.txtPdfurl;
                    Hoctap.update( query, hoctap, function(err){
                        if(err){
                            console.log("Save hoctap error :" + err);
                            res.render("home", {page:"edithoctap", message:"Save hoctap error"});
                        }else{
                            res.redirect("http://localhost:3000/page/listhoctap")  ;
                        }
                    });

                }
            }
         });   
});

app.get("/page/hoctap/delete/:id",  function(req, res){
    Hoctap.findById(req.params.id)
    .then(item => item.remove().then(()=> res.redirect("http://localhost:3000/page/listhoctap")))
    .catch(err => res.status(404).json({success: false}));
});


//Văn phòng
app.get("/page/listvanphong", function(req, res){
    Vanphong.find(function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "listvanphong", vanphongs:[]});
        }else {
            console.log(items);
            res.render("home", {page: "listvanphong", vanphongs:items});
        }
    });
});


app.get("/page/vanphong", function(req, res){
    Category.find(function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "vanphong" });
        }else {
           //res.json(items);
           res.render("home", {page: "vanphong", cats:items});
        }
    });
});
app.post("/page/vanphong", function(req, res){
    //upload
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading."); 
          //res.json({kq:0});
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
          //res.json({kq:0});
        }else{
            //console.log("Upload is okay");
            //console.log(req.file); // Thông tin file đã upload
            // req.file.filename
            var vanphong = new Vanphong({
                name: req.body.txtName,
                ordering:1,
                image:req.file.filename,
                category:req.body.selectCate,
                entryprice:req.body.txtEntryprice,
                exportprice:req.body.txtExportprice,
                number:req.body.txtNumber,
                date:req.body.txtDate,
                description:req.body.txtPdfurl,
                vanphong_id:[]
            });
            vanphong.save(function(err){
                if(err){
                   // console.log("Save category error :" + err);
                    res.render("home", {page:"vanphong", message:"Save vanphongerror"});
                }else{
                    
                    Vanphong.find(function(err, items){
                        if(err){
                            console.log(err);
                            res.render("home", {page: "vanphong", vanphongs:[]});
                        }else {
                           // console.log(items);
                            res.render("home", {page: "listvanphong", vanphongs:items});
                        }
                    });        
                }
            });
            
        }
    });  
});

app.get("/page/editvanphong/:id", function(req, res){
   
    Vanphong.findById(req.params.id, function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "editvanphong" });
        }else {
           console.log(items);
           res.render("home", {page: "editvanphong", cat:items});
        }
    });
});
app.post("/page/editvanphong/:id", function(req, res){
    
        let query = {_id:req.params.id}
        upload(req, res, function(err){
        if(err){
                res.send("Xay ra loi");
        }else{
                let vanphong ={};

                vanphong.name = req.body.txtName,
                vanphong.ordering = 1,
               // hoctap.image = req.file.filedname,
               vanphong.category = req.body.selectCate,
               vanphong.entryprice = req.body.txtEntryprice,
               vanphong.exportprice = req.body.txtExportprice,
               vanphong.number =Number(req.body.txtNumber) ,
               vanphong.date = Date.parse(req.body.txtDate),
               vanphong.description = req.body.txtPdfurl;

                if(typeof(req.file)=='undefined'){
                    Vanphong.update( query, vanphong, function(err){
                        if(err){
                            console.log("Save vanphong error :" + err);
                            res.render("home", {page:"editvanphong", message:"Save vanphong error"});
                        }else{
                            res.redirect("http://localhost:3000/page/listvanphong")  ;
                        }
                    });
                }else{
                    let vanphong ={};
                    vanphong.name = req.body.txtName,
                    vanphong.ordering = 1,
                    vanphong.image = req.file.originalname,
                    vanphong.category = req.body.selectCate,
                    vanphong.entryprice = req.body.txtEntryprice,
                    vanphong.exportprice = req.body.txtExportprice,
                    vanphong.number =Number(req.body.txtNumber) ,
                    vanphong.date =Date.parse(req.body.txtDate),
                    vanphong.description = req.body.txtPdfurl;
                    Vanphong.update( query,vanphong, function(err){
                        if(err){
                            console.log("Save vanphong error :" + err);
                            res.render("home", {page:"editvanphong", message:"Save vanphong error"});
                        }else{
                            res.redirect("http://localhost:3000/page/listvanphong")  ;
                        }
                    });

                }
            }
         });   
});


app.get("/page/vanphong/delete/:id",  function(req, res){
    Vanphong.findById(req.params.id)
    .then(item => item.remove().then(()=> res.redirect("http://localhost:3000/page/listvanphong")))
    .catch(err => res.status(404).json({success: false}));
});


//Giadinh
app.get("/page/listgiadinh", function(req, res){
    Giadinh.find(function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "listgiadinh", giadinhs:[]});
        }else {
            console.log(items);
            res.render("home", {page: "listgiadinh", giadinhs:items});
        }
    });
});

app.get("/page/giadinh", function(req, res){
    Category.find(function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "giadinh" });
        }else {
           //res.json(items);
           res.render("home", {page: "giadinh", cats:items});
        }
    });
});
app.post("/page/giadinh", function(req, res){
    //upload
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading."); 
          //res.json({kq:0});
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
          //res.json({kq:0});
        }else{
            //console.log("Upload is okay");
            //console.log(req.file); // Thông tin file đã upload
            // req.file.filename
            var giadinh = new Giadinh({
                name: req.body.txtName,
                ordering:1,
                image:req.file.filename,
                category:req.body.selectCate,
                entryprice:req.body.txtEntryprice,
                exportprice:req.body.txtExportprice,
                number:req.body.txtNumber,
                date:req.body.txtDate,
                description:req.body.txtPdfurl,
                giadinh_id:[]
            });
            giadinh.save(function(err){
                if(err){
                   // console.log("Save category error :" + err);
                    res.render("home", {page:"giadinh", message:"Save giadinh error"});
                }else{
                    
                    Giadinh.find(function(err, items){
                        if(err){
                            console.log(err);
                            res.render("home", {page: "giadinh", giadinhs:[]});
                        }else {
                           // console.log(items);
                            res.render("home", {page: "listgiadinh", giadinhs:items});
                        }
                    });        
                }
            });
            
        }
    });  
});

app.get("/page/editgiadinh/:id", function(req, res){
   
    Giadinh.findById(req.params.id, function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "editgiadinh" });
        }else {
           console.log(items);
           res.render("home", {page: "editgiadinh", cat:items});
        }
    });
});
app.post("/page/editgiadinh/:id", function(req, res){
    
        let query = {_id:req.params.id}
        upload(req, res, function(err){
        if(err){
                res.send("Xay ra loi");
        }else{
                let giadinh ={};

                giadinh.name = req.body.txtName,
                giadinh.ordering = 1,
               // hoctap.image = req.file.filedname,
               giadinh.category = req.body.selectCate,
               giadinh.entryprice = req.body.txtEntryprice,
               giadinh.exportprice = req.body.txtExportprice,
               giadinh.number =Number(req.body.txtNumber) ,
               giadinh.date = Date.parse(req.body.txtDate),
               giadinh.description = req.body.txtPdfurl;

                if(typeof(req.file)=='undefined'){
                    Giadinh.update( query, giadinh, function(err){
                        if(err){
                            console.log("Save giadinh error :" + err);
                            res.render("home", {page:"editgiadinh", message:"Save giadinh error"});
                        }else{
                            res.redirect("http://localhost:3000/page/listgiadinh")  ;
                        }
                    });
                }else{
                    let giadinh ={};
                    giadinh.name = req.body.txtName,
                    giadinh.ordering = 1,
                    giadinh.image = req.file.originalname,
                    giadinh.category = req.body.selectCate,
                    giadinh.entryprice = req.body.txtEntryprice,
                    giadinh.exportprice = req.body.txtExportprice,
                    giadinh.number =Number(req.body.txtNumber) ,
                    giadinh.date =Date.parse(req.body.txtDate),
                    giadinh.description = req.body.txtPdfurl;
                    Giadinh.update( query, giadinh, function(err){
                        if(err){
                            console.log("Save giadinh error :" + err);
                            res.render("home", {page:"editgiadinh", message:"Save giadinh error"});
                        }else{
                            res.redirect("http://localhost:3000/page/listgiadinh")  ;
                        }
                    });

                }
            }
         });   
});

app.get("/page/giadinh/delete/:id",  function(req, res){
    Giadinh.findById(req.params.id)
    .then(item => item.remove().then(()=> res.redirect("http://localhost:3000/page/listgiadinh")))
    .catch(err => res.status(404).json({success: false}));
});

//Khác
app.get("/page/listkhac", function(req, res){
    Khac.find(function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "listkhac", khacs:[]});
        }else {
            console.log(items);
            res.render("home", {page: "listkhac", khacs:items});
        }
    });
});


app.get("/page/khac", function(req, res){
    Category.find(function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "khac" });
        }else {
           //res.json(items);
           res.render("home", {page: "khac", cats:items});
        }
    });
});
app.post("/page/khac", function(req, res){
    //upload
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading."); 
          //res.json({kq:0});
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
          //res.json({kq:0});
        }else{
            //console.log("Upload is okay");
            //console.log(req.file); // Thông tin file đã upload
            // req.file.filename
            var khac = new Khac({
                name: req.body.txtName,
                ordering:1,
                image:req.file.filename,
                category:req.body.selectCate,
                entryprice:req.body.txtEntryprice,
                exportprice:req.body.txtExportprice,
                number:req.body.txtNumber,
                date:req.body.txtDate,
                description:req.body.txtPdfurl,
                khac_id:[]
            });
            khac.save(function(err){
                if(err){
                   // console.log("Save category error :" + err);
                    res.render("home", {page:"khac", message:"Save khac error"});
                }else{
                    
                    Khac.find(function(err, items){
                        if(err){
                            console.log(err);
                            res.render("home", {page: "khac", khacs:[]});
                        }else {
                           // console.log(items);
                            res.render("home", {page: "listkhac", khacs:items});
                        }
                    });        
                }
            });
            
        }
    });  
});

app.get("/page/editkhac/:id", function(req, res){
   
    Khac.findById(req.params.id, function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "editkhac" });
        }else {
           console.log(items);
           res.render("home", {page: "editkhac", cat:items});
        }
    });
});
app.post("/page/editkhac/:id", function(req, res){
    
        let query = {_id:req.params.id}
        upload(req, res, function(err){
        if(err){
                res.send("Xay ra loi");
        }else{
                let khac ={};

                khac.name = req.body.txtName,
                khac.ordering = 1,
               // hoctap.image = req.file.filedname,
               khac.category = req.body.selectCate,
               khac.entryprice = req.body.txtEntryprice,
               khac.exportprice = req.body.txtExportprice,
               khac.number =Number(req.body.txtNumber) ,
               khac.date = Date.parse(req.body.txtDate),
               khac.description = req.body.txtPdfurl;

                if(typeof(req.file)=='undefined'){
                    Khac.update( query, khac, function(err){
                        if(err){
                            console.log("Save giadinh error :" + err);
                            res.render("home", {page:"editkhac", message:"Save khac error"});
                        }else{
                            res.redirect("http://localhost:3000/page/listkhac")  ;
                        }
                    });
                }else{
                    let khac ={};
                    khac.name = req.body.txtName,
                    khac.ordering = 1,
                    khac.image = req.file.originalname,
                    khac.category = req.body.selectCate,
                    khac.entryprice = req.body.txtEntryprice,
                    khac.exportprice = req.body.txtExportprice,
                    khac.number =Number(req.body.txtNumber) ,
                    khac.date =Date.parse(req.body.txtDate),
                    khac.description = req.body.txtPdfurl;
                    Khac.update( query, khac, function(err){
                        if(err){
                            console.log("Save giadinh error :" + err);
                            res.render("home", {page:"editkhac", message:"Save khac error"});
                        }else{
                            res.redirect("http://localhost:3000/page/listkhac")  ;
                        }
                    });

                }
            }
         });   
});

app.get("/page/khac/delete/:id",  function(req, res){
    Khac.findById(req.params.id)
    .then(item => item.remove().then(()=> res.redirect("http://localhost:3000/page/listkhac")))
    .catch(err => res.status(404).json({success: false}));
});


//Category
app.post("/page/category", function(req, res){
    var cate = new Category({
        name:req.body.txtName,
        ordering:1,
        description:req.body.txtMota,
        number:req.body.txtNumber,
        date:req.body.txtDate,
        product_id:[]
    });
    cate.save(function(err){
        if(err){
            console.log("Save category error :" + err);
            res.render("home", {page:"category", message:"Save category error"});
        }else{
            Category.find(function(err, items){
                if(err){
                    console.log(err);
                    res.render("home", {page: "category", categories:[]});
                }else {
                    console.log(items);
                    res.render("home", {page: "category", categories:items});
                }
            });        
        }
    });
});

app.get("/page/category", function(req, res){
    Category.find(function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "category", categories:[]});
        }else {
            console.log(items);
            res.render("home", {page: "category", categories:items});
        }
    });
    
});

app.get("/page/editcategory/:id", function(req, res){
   
    Category.findById(req.params.id, function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "editcategory" });
        }else {
           console.log(items);
           res.render("home", {page: "editcategory", cat:items});
        }
    });
});
app.post("/page/editcategory/:id", function(req, res){
    
        let query = {_id:req.params.id}
        upload(req, res, function(err){
        if(err){
                res.send("Xay ra loi");
        }else{
                let category ={};

                category.name = req.body.txtName,
                category.ordering = 1,
                category.number =Number(req.body.txtNumber) ,
                category.date = Date.parse(req.body.txtDate),
                category.description = req.body.txtPdfurl;

                    Category.update( query, category, function(err){
                        if(err){
                            console.log("Save category error :" + err);
                            res.render("home", {page:"category", message:"Save category error"});
                        }else{
                            res.redirect("http://localhost:3000/page/category")  ;
                        }
                    });

            }
         });   
});


app.get("/page/category/delete/:id",  function(req, res){
    Category.findById(req.params.id)
    .then(item => item.remove().then(()=> res.redirect("http://localhost:3000/page/category")))
    .catch(err => res.redirect("http://localhost:3000/server"));
});


//login
app.get("/login", function(req, res){
    res.render("login");
});
app.get("/server", function(req, res){
    res.render("server");
});

app.post("/login", function(req, res){
    User.findOne({username:req.body.txtUsername}, function(err, item){
        if(! err && item != null){
            bcrypt.compare(req.body.txtPassword, item.password, function(err2, res2) {
                if(res2==false){
                    res.json({kq:0, err: "Wrong password"});
                }else {
                    jwt.sign(item.toJSON(), secret, { expiresIn: '168h'}, function(err, token){
                        if(err){
                            res.json({kq:0, err:"Token generate error:" + err});
                        }else{
                            req.session.token = token;
                           //res.json({token:token})
                           if(typeof(Storage) !== "undefined"){
                            sessionStorage.setItem('user', req.body.txtUsername);
                           }
                           
                           res.render("server");
                           
                        }
                    });
                }
            });
        }else{
            res.json({kq:0, err: "Wrong username"});
        }
    });
});

app.get("/", function(req, res){
    checkToken(req, res);
});
//function newFunction(res, hoctap) {
   // res.render('edithoctap', { hoctaps: hoctap });
//}

function checkToken(req, res){
    if(req.session.token){
        jwt.verify(req.session.token, secret, function(err,decoded){
            if(err){
                res.send("Wrong");
                //res.redirect("http://localhost:3000/login");
            }else{
                //res.json(decoded);
                //res.render("server");
                if(typeof(Storage) !== "undefined"){
                    sessionStorage.setItem('user', 'admin');
                   }
            }
        });
    }else{
        res.send("Not login");
       // res.redirect("http://localhost:3000/login");
    }
}


//User
app.post("/addUser", function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        let admin = new User({
            username    : req.body.username,
            password    : hash,
            level       : req.body.level,
            active      : req.body.active,
            name        : req.body.name,
            email       : req.body.email,
            address     : req.body.address,
            phone       : req.body.phone
        });
        admin.save(function(err){
            if(err){
                res.json({kq:0});
            }else{
                res.json(admin);
            }
        });
    });
});

app.get("/page/thongke", function(req, res){
    Category.find(function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "thongke" });
        }else {
           //res.json(items);
           res.render("home", {page: "thongke"});
        }
    });
});

app.get("/page/contact", function(req, res){
    Category.find(function(err, items){
        if(err){
            console.log(err);
            res.render("home", {page: "contact" });
        }else {
           //res.json(items);
           res.render("home", {page: "contact"});
        }
    });
});

