'use-strict';
var express = require('express');
var assert =require('assert');
const jwt = require('jsonwebtoken');

class StudentRouter {
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
    
    /**
     * The req body form: {Courses: [CourseCode,...]}
     */
    router.post('/studyplan/new', async function (req, res, next) {
        try{
            let username = getUserFromToken(req);
            let result = await manager.addCourses(username, req.body.Courses)
            if (result === 0){
                await manager.registerStudent(username, req.body.Courses)
                res.status(200).json({message: "User is Not Registered... New Study Plan Created... Operation Successfull"})
            }
            else{
                res.status(200).json({message: "Operation Successful"})
            }
        }
        catch(e){
            next(e)
        }
    })
    
    /**
     * The req bocy form: {Remove : [CourseCode,...], Add: [CourseCode,...]}
     */
    router.post('/studyplan/edit', async function (req, res, next) {
        try{
            let username = getUserFromToken(req);
            let result = await manager.editCourses(username, req.body.Remove, req.body.Add)
            if (result === 0){
                res.status(400).json({message: "User is Not Registered"})
            }
            else{
                res.status(200).json({message: "Operation Successful"})
            }
        }
        catch(e){
            next(e)
        }
    })

    /**
     * The req body form: {Remove : [CourseCode,...], Add: [CourseCode,...]}
     */
    router.post('/exams/book/edit', async function (req, res, next) {
        try{
            let username = getUserFromToken(req);
            let result = await manager.editBookings(username, req.body.Remove, req.body.Add)
            if (result === 0){
                res.status(400).json({message: "User is Not Registered"})
            }
            else{
                res.status(200).json({message: "Operation Successful"})
            }
        }
        catch(e){
            next(e)
        }
    })

    /**
     * The req body form: {course: CourseCode, grade: courseGrade}
     */
    router.post('/grades/register', async function (req, res, next) {
        try{
            let username = getUserFromToken(req);
            let result = await manager.registerGrade(username, req.body.course, req.body.grade)
            if (result === 0){
                res.status(400).json({message: "User is Not Registered"})
            }
            else{
                res.status(200).json({message: "Operation Successful"})
            }
        }
        catch(e){
            next(e)
        }
    })

    router.get('/exams/book', async function (req, res, next) {
        try{
            let username = getUserFromToken(req);
            let result = await manager.getBookedCourses(username)
            if (result === 0){
                res.status(400).json({message: "User is Not Registered"})
            }
            else{
                res.status(200).json(result)
            }
        }
        catch(e){
            next(e)
        }
    })

    router.get('/grades', async function (req, res, next) {
        try{
            let username = getUserFromToken(req);
            let result = await manager.getRegisteredCourses(username)
            if (result === 0){
                res.status(400).json({message: "User is Not Registered"})
            }
            else{
                res.status(200).json(result)
            }
        }
        catch(e){
            next(e)
        }
    })

    router.get('/studyplan', async function (req, res, next) {
        try{
            let username = getUserFromToken(req);
            let result = await manager.getStudentStudyPlan(username)
            if (result === 0){
                res.status(400).json({message: "User is Not Registered"})
            }
            else{
                res.status(200).json(result)
            }
        }
        catch(e){
            next(e)
        }
    })
}

function getUserFromToken(req) {
    let token = req.headers.authorization.split(' ')[1]
    return jwt.decode(token).user
}

module.exports = StudentRouter