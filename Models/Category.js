const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    name: String,
    ordering: Number,
    description: { type: String},
    number: {type: Number},
    date:{type: Date},
    products_id:[{type: mongoose.Schema.Types.ObjectId}]
});

module.exports = mongoose.model("Category", categorySchema);