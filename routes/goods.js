const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Goods = require('./../models/goods.js')
const defaultParams = require('./../services/apiConfig')
const async = require('async')


mongoose.connect('mongodb://127.0.0.1:27017/demo')

mongoose.connection.on('connected', (event) => {
    console.log('connected')
})

mongoose.connection.on('error', (event) => {
    console.log('error')
})

mongoose.connection.on('disconnected', (event) => {
    console.log('disconnected')
})


/* GET goods page. */
router.get('/', (req, res, next) => {

    let params = {}  // filter params
    let searchParams = {}   // params search by keywords 
    let keywordsParam = null

    const sort = JSON.parse(req.query.sort) || {}   //传来的是sort规则对像，需要JSON.parse
    const page = parseInt(req.query.page) || defaultParams.page
    const size = parseInt(req.query.size) || defaultParams.size
    const pageNumber = (page - 1) * size

    const {pricelt, pricegt, keywords} = req.query

    keywordsParam = keywords ? new RegExp(keywords, "i") : null

    if (pricelt > 0) {
        params = {
            price: {
                $lte: pricelt,
                $gte: pricegt || 0 
            }
        }
    }

    if (keywordsParam) {
        searchParams = {
            $or: [
                { title: { $regex: keywordsParam } },
                { keywords: { $regex: keywordsParam } }
            ]
        }
    }

    params = Object.assign(params, searchParams) //合并两个搜索对象

   // 接口需要返回带参数查询的总个数
    Goods.count(params, function (err, count) {

        if (err) {
            res.json({
                status: false,
                errorMessage: err.message
            })
            next()
        }

        let goodModel = Goods.find(params).skip(pageNumber).limit(size)  //返回一个model实体
        goodModel
        .sort(sort)
        .exec((err, doc) => {
       
            if (err) {
                res.json({
                    status: false,
                    errorMessage: err.message
                })
            } else {
                res.json({
                    status: true,
                    msg: '',
                    data: {
                        page: page,
                        size: doc.length,
                        total: count,
                        data: doc
                    }
                })
            }
        })
    })

});

router.put('/:id', (req, res, next) => {
    const id = req.params.id
    const body = req.body

    Goods.findById(id,  (err, good) => { 
        if (err) return handleError(err);
        good.set(body)
        good.save((err, doc) => {
            if (err) {
                res.json({
                     status: false,
                     data: err.message
                })
            }else {
                res.json({
                    status: true,
                    data: doc
                })
            }
            
        })
    })
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    Goods.remove({ _id: id }, (err, doc) => {
        if (err) return handleError(err);
        res.send({
            status: true,
            data: ""
        })
    })
})

router.post('/add', (req, res, next) => {
    const body = req.body
    let good = new Goods(body)
    good.save((err, doc) => {
        if (err) {
            res.send({
                status: false,
                errorMessage: err.message
            })
        } else {
            console.log(doc)
            res.send({
                status: true,
                data: doc
            })
        }
    })

})

module.exports = router;