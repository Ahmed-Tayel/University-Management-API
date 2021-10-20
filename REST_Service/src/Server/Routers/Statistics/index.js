'use-strict';
var express = require('express');
var assert =require('assert');

class StatRouter {
    constructor(manager){
        this.router = express.Router();
        this.currentManager = manager;
    }

    async initRouter(){
        //invoke paths mount function
        mountPaths(this.router, this.currentManager);
    }

    getRouter(){
        return this.router;
    }
}

function mountPaths(router, manager) {

    router.get('/course', async function (req, res, next) {
        try{
            var result = await manager.getCourseStat();
            res.status(200).json(result)
        }
        catch(e){
            next(e)
        }
    })

    router.get('/professor', async function (req, res, next) {
         try{
            var result = await manager.getProfStat();
            res.status(200).json(result)
        }
        catch(e){
            next(e)
        }
    })

    router.get('/university', async function (req, res, next) {
         try{
            var result = await manager.getUniStat();
            res.status(200).json(result)
        }
        catch(e){
            next(e)
        }
    })
}

module.exports = StatRouter