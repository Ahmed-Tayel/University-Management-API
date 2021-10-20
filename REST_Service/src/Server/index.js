'use-strict';
const express = require('express');
const jwt = require('express-jwt');
const Router = require('./Routers/index')
const Manager = require('../Manager/index');
const config = require('../../config')

class Server{
    
    constructor(){
        this.app = express();
        this.port = 3000;
        this.Manager = new Manager(config.mongoURL, config.mongoDB, config.mongoColl);
        this.router = new Router(this.Manager);
        
    }

    async init() {
        //init middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(express.json());
        this.app.use(jwt({secret: config.jwtSecret, algorithms: ['HS256'], requestProperty: 'auth'}).unless({path: config.jwtExcluded}))

        //init manager and routers
        await this.Manager.init();
        await this.router.initRouter();
        this.app.use('/', this.router.getRouter());

        //define error handlers
        this.app.use(function (err, req, res, next) {
            res.status(err.statusCode || 500).json({error: err.message})
        })

        this.app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`)
          })
    }
}

module.exports = Server