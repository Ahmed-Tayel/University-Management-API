'use-strict';
const path = require('path')
const bcrypt = require('bcrypt');
const SQLDB = require('../Models/DB1_SQL/index')
const assert = require('assert')
const SysErrors = require(path.join(__dirname.split('src')[0], 'src' , 'SystemErrors')).Manager
const DBErrors = require(path.join(__dirname.split('src')[0], 'src' , 'SystemErrors')).Database
const jwt = require('jsonwebtoken');
const config = require(path.join(__dirname.split('src')[0], 'config'))
const DocDB = require('../Models/DB2_NoSQL/index');
const examItem = require('../Models/DB2_NoSQL/examModel')


class Manager {
    constructor(NoSqluri, noSqlDB, NoSqlCollection){
        
        this.NoSqluri = NoSqluri;
        this.noSqlDB = noSqlDB;
        this.NoSqlCollection = NoSqlCollection;

        this.dbSQL = new SQLDB();
        this.dbNoSQL = new DocDB(this.NoSqluri, this.noSqlDB, this.NoSqlCollection);
    }

    async init(){
        await this.dbSQL.init();
        await this.dbNoSQL.init();
    }

    async signUpUser(username, password){
        try{
            assert.equal(typeof username, 'string');
            assert.equal(typeof password, 'string');
        }
        catch(err){
            throw new Error(SysErrors.INVALUSRPWD);
        }

        let userQuery = await this.dbSQL.getUsername(username);
        if(userQuery.length > 0){
            throw new Error(SysErrors.USREXIST)
        }
        else{
            let hashedPass = bcrypt.hashSync(password, config.salt);
            let item = {
                serialNumber: username,
                hashedpass: hashedPass
            }
            try{
                await this.dbSQL.insert('Auth', item);
            }
            catch(err){
                throw new Error(DBErrors.DBINSERT)
            }
        }

        let token = await this.loginUser(username, password);
        return token;
    }

    async loginUser(username, password){
        try{
            assert.equal(typeof username, 'string');
            assert.equal(typeof password, 'string');
        }
        catch(err){
            throw new Error(SysErrors.INVALUSRPWD);
        }

        let userQuery = await this.dbSQL.getUsername(username);
        if (userQuery.length == 0){
            throw new Error(SysErrors.USRNOTFOUND)
        }
        else{
            let passCheck = bcrypt.compareSync(password, userQuery[0].hashedpass)
            if (passCheck){
                let token = jwt.sign({user: username}, config.jwtSecret)
                return {jwt: token}
            }
            else{
                throw new Error(SysErrors.PWDINVALID)
            }
        }
    }

    async addCourses(username,CoursesList){
        try{
            this.CoursesValidityCheck(CoursesList)
            return await this.updateField(username, 'enrolled', [], CoursesList)
        }
        catch(e){
            throw new Error(e)
        }
    }

    async bookCourses(username, CoursesList){
        try{
            this.CoursesValidityCheck(CoursesList)
            return await this.updateField(username, 'booked', [], CoursesList)
        }
        catch(e){
            throw new Error(e)
        }
    }

    async editCourses(username, toRemove, toAdd){
        try{
            this.CoursesValidityCheck(toRemove)
            this.CoursesValidityCheck(toAdd)
            return await this.updateField(username, 'enrolled', toRemove, toAdd)
        }
        catch(e){
            throw new Error(e)
        }
    }

    async editBookings(username, toRemove, toAdd){
        try{
            this.CoursesValidityCheck(toRemove)
            this.CoursesValidityCheck(toAdd)
            return await this.updateField(username, 'booked', toRemove, toAdd)
        }
        catch(e){
            throw new Error(e)
        }
    }

    CoursesValidityCheck(CoursesList){
        try{
            assert.equal(Array.isArray(CoursesList) , true)
            CoursesList.forEach(element => {
                assert.equal(typeof element ,'string')
            })
        }
        catch(e){
            throw new Error(SysErrors.BADREQ)
        }
    }

    async updateField(username, Field, toRemArr, toAddArr){
        try{
            let Item = await this.getStudentStudyPlan(username)
            if (Item != 0){
                let retArr;
                if(Field === "enrolled"){
                    retArr = Item.enrolled
                }
                else{
                    retArr = Item.booked
                }
    
                this.removeFromArray(retArr, toRemArr)
                this.appendToArray(retArr, toAddArr)
    
                try{
                    await this.dbNoSQL.updateUserData(username, Item)
                    return 1
                }
                catch(e){
                    throw new Error(e)
                }
            }
            else{
                return 0
            }
        }
        catch(e){
            throw new Error(e)
        }
    }

    removeFromArray(oldArr, newArr){
        newArr.forEach(element => {
            if(oldArr.includes(element)){
                oldArr.splice(oldArr.indexOf(element),1)
            }
        });
    }

    appendToArray(oldArr, newArr){
        newArr.forEach(element => {
            if(! oldArr.includes(element)){
                oldArr.push(element)
            }
        });
    }

    async getRegisteredCourses(username){
        try{
            let Item = await this.getStudentStudyPlan(username)
            if(Item != 0){
                return Item.registered
            }
            else{
                return 0
            }
        }
        catch(e){
            throw new Error(e)
        }
    }

    async getBookedCourses(username){
        try{
            let Item = await this.getStudentStudyPlan(username)
            if(Item != 0){
                return Item.booked
            }
            else{
                return 0
            }
        }
        catch(e){
            throw new Error(e)
        }
    }

    async registerStudent(username, Courses){
        let studentRecord = new examItem(username, Courses, [], [])
        try{
            this.CoursesValidityCheck(Courses)
            await this.dbNoSQL.insert_item(studentRecord)
            return 1
        }
        catch(e){
            if(e.message === SysErrors.BADREQ){
                throw new Error(e)
            }
            else{
                throw new Error(DBErrors.DBINSERT)
            }
        }
    }

    async registerGrade(username, course, grade){
        try{
            assert.equal(typeof course, 'string', 'AssError')
            assert.equal(typeof grade , 'number', 'AssError')
            let Item = await this.getStudentStudyPlan(username)
            if(Item != 0){
                let found = false
                Item.registered.forEach((element) => {
                    if(element.course === course){
                        found = true
                        element.grade = grade
                    }
                })
                if (found === false){
                    Item.registered.push({course: course, grade: grade})
                }
                await this.dbNoSQL.updateUserData(username, Item)
                return 1
            }
            else{
                return 0
            }
        }
        catch(e){
            if (e.message == "AssError"){
                throw new Error(SysErrors.BADREQ)    
            }
            else{
                throw new Error(e)
            }
        }
    }

    async getStudentStudyPlan(username){
        try{
            assert.equal(typeof username, 'string');
        }
        catch(err){
            throw new Error(SysErrors.INVALUSR);
        }

        try{
            let userData = await this.dbNoSQL.getUserData(username)
            if(userData != 0){
                return userData
            }
            else{
                return 0
            }
        }
        catch(e){
            //throw new Error(DBErrors.DBCRUD)
            throw new Error(DBErrors.DBUPDATE)
        }
    }

    async getCourseStat() {
        /**
         * Todo:
         * 1) number of registered students
         * 2) average grade in the subject
         * 3) professors teaching the subject
         */
        try{
            var retValArr = [];
            var coursesList = await this.dbSQL.find_all('Courses')

            for(let element of coursesList){
                let studentsEnrolled = await this.dbNoSQL.selectByEnrolledCourse(element.courseCode)
                let avgGrades = this.getAverageGradeFromDocDB(studentsEnrolled, element.courseCode)
                let profArr = await this.dbSQL.select('Prof', {courseCode: element.courseCode})
                profArr.map(profelement =>{
                    delete profelement.createdAt
                    delete profelement.updatedAt
                    delete profelement.id
                })

                retValArr.push({
                    Course: element.course,
                    NumofStudents: studentsEnrolled.length,
                    AvgGrade: avgGrades,
                    Professors: profArr
                })
            }
            return retValArr
        }
        catch(e){
            throw new Error(e)
        }
    }

    async getProfStat(){
        /**
         * Todo:
         * 1) number of assigned courses
         * 2) avg grade of all courses
         */
        try{
            var retValArr = [];
            var ProfList = await this.dbSQL.find_all('Prof')
            var profCourses = {}

            for(let element of ProfList){
                if(profCourses[element.serialNumber]){
                    profCourses[element.serialNumber].push(element.courseCode)
                }
                else{
                    profCourses[element.serialNumber] = [element.courseCode]
                }
            }

            let avgTotal = 0
            let numofAvs = 0
            for (let key in profCourses){
                let courseArr = profCourses[key]
                let gradeList = await this.dbNoSQL.selectByRegisteredCourse(courseArr)
                for (let course of courseArr){
                    avgTotal += this.getAverageGradeFromDocDB(gradeList, course)
                    numofAvs += 1
                }
                retValArr.push({
                    Professor: key,
                    NumofCourses: courseArr.length,
                    avgGrades: (avgTotal / numofAvs)
                })
                avgTotal = 0
                numofAvs = 0
            }

            return retValArr
        }
        catch(e){
            throw new Error(e)
        }
    }

    async getUniStat(){
        /**
         * 1) no of registered students
         * 2) avg grades among all courses
         */
        try{
            let StudentsStudyPlans = await this.dbNoSQL.select({});

            let avGrade = 0
            let numofCourses =0
            for(let studentData of StudentsStudyPlans){
                for(let courseData of studentData.registered){
                    avGrade += courseData.grade;
                    numofCourses += 1;
                }
            }

            let retVal = {
                RegisteredStudents: StudentsStudyPlans.length,
                TotalAVGrades: (avGrade / numofCourses)
                }
                

            return retVal
        }
        catch(e){
            throw new Error(e)
        }
    }

    getAverageGradeFromDocDB(DBresult, courseCode){
        let numofStudents = DBresult.length
        let gradesSum = 0.0

        for (let res of DBresult){
            for(let courseobj of res.registered){
                if(courseobj.course == courseCode){
                    gradesSum += courseobj.grade
                }
            }
        }
        return (gradesSum / numofStudents)
    }
}

module.exports = Manager