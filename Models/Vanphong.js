const mongoose = require("mongoose");
const vanphongSchema = new mongoose.Schema({
    name: String,
    ordering: Number,
    image: String,
    file:String,
    description: { type: String},
    category: { type: String},
    entryprice: {type: String},
    exportprice: {type: String},
    number: {type: Number},
    date:{type: Date},
    vanphongs_id:[{type: mongoose.Schema.Types.ObjectId}]
});

module.exports = mongoose.model("Vanphong", vanphongSchema);