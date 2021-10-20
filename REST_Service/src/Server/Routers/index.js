'use-strict';
var express = require('express');
var assert =require('assert');
const AuthRouter = require('./Authentication/index');
const StudentRouter = require('./Student/index');
const statRouter = require('./Statistics/index');

class Router {

    constructor(manager){
        this.router = express.Router();
        this.currentManager = manager;
        this.authRouter = new AuthRouter(manager)
        this.studentRouter = new StudentRouter(manager)
        this.statRouter = new statRouter(manager);
    }

    async initRouter(){
        //invoke paths mount function
        this.authRouter.initRouter();
        this.studentRouter.initRouter();
        this.statRouter.initRouter();

        this.router.use('/auth', this.authRouter.getRouter());
        this.router.use('/student', this.studentRouter.getRouter());
        this.router.use('/statistics', this.statRouter.getRouter());

        
    }

    getRouter(){
        return this.router;
    }

}

module.exports = Router