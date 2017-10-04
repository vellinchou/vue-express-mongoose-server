var mongoose = require('mongoose')
var Schema = require('mongoose').Schema
var model = mongoose.model

var goodSchema = new Schema({
    title: {type: String, required: true},
    keywords: Array,
    price: Number,
    hidden: Boolean,
    createTime: { type: Date, default: Date.now },
    meta: {
        favs: Number,
        buys: Number
    }
})


var Good = mongoose.model('Good', goodSchema)

module.exports = Good