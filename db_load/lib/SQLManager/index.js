const {SQLDB} = require('./DB/index')
const bcrypt = require('bcrypt')
const config = require('../../config')

/**
 * @class SQLManager
 */
class SQLManager {
    
    constructor(){
        this.db = new SQLDB();
    }

    async init(){await this.db.init();}

    async close(){await this.db.close();}

    async dump_db(){

        /////////////////////////////////////// COURSES
        /////////////////////////////////////// Course 1:
        table = 'Courses';
        var item = {
            course: "Algorithms Design",
            credits: 6,
            courseCode: 12345,
            academicYear: 2020
        }
        await this.db.insert(table, item);
        ///////////////////////////////////////
        /////////////////////////////////////// Course 2:
        table = 'Courses';
        var item = {
            course: "Mobile Apps",
            credits: 6,
            courseCode: 23456,
            academicYear: 2020
        }
        await this.db.insert(table, item);
        ///////////////////////////////////////
        /////////////////////////////////////// Course 3:
        table = 'Courses';
        var item = {
            course: "Big Data",
            credits: 6,
            courseCode: 34567,
            academicYear: 2020
        }
        await this.db.insert(table, item);
        ///////////////////////////////////////
        /////////////////////////////////////// Course 4:
        table = 'Courses';
        var item = {
            course: "Programming",
            credits: 6,
            courseCode: 45678,
            academicYear: 2020
        }
        await this.db.insert(table, item);
        ///////////////////////////////////////
        /////////////////////////////////////// Course 5:
        table = 'Courses';
        var item = {
            course: "Cloud Computing",
            credits: 6,
            courseCode: 56789,
            academicYear: 2020
        }
        await this.db.insert(table, item);
        ///////////////////////////////////////
        
        //////////////////////////////////////////////      STUDENTS
        /////////////////////////////////////// Student 1:
        var table = 'Auth'
        var username = "Ahmed"
        var hashedpass = bcrypt.hashSync("PassA", config.salt)
        var item = {
            username: username,
            hashedpass: hashedpass
        }
        await this.db.insert(table, item);

        table = 'Profile';
        var item = {
            firstName: 'ahmed',
            lastName: 'tayel',
            role: 'student',
            serialNumber: 111222,
            placeOfBirth: 'AAU',
            sex: 'Male',
            dateOfBirth: '18/01/1994',
            country: 'Egypt',
            academicYear: 2021
        }
        await this.db.insert(table, item);
        //////////////////////////////////////////////
        /////////////////////////////////////// Student 2:
        var table = 'Auth'
        var username = "Tom"
        var hashedpass = bcrypt.hashSync("PassT", config.salt)
        var item = {
            username: username,
            hashedpass: hashedpass
        }
        await this.db.insert(table, item);

        table = 'Profile';
        var item = {
            firstName: 'Tom',
            lastName: 'Hardy',
            role: 'student',
            serialNumber: 333444,
            placeOfBirth: 'AAU',
            sex: 'Male',
            dateOfBirth: '18/01/1990',
            country: 'USA',
            academicYear: 2021
        }
        await this.db.insert(table, item);
        //////////////////////////////////////////////
        /////////////////////////////////////// Student 3:
        var table = 'Auth'
        var username = "Ted"
        var hashedpass = bcrypt.hashSync("PassT", config.salt)
        var item = {
            username: username,
            hashedpass: hashedpass
        }
        await this.db.insert(table, item);

        table = 'Profile';
        var item = {
            firstName: 'Ted',
            lastName: 'Mosby',
            role: 'student',
            serialNumber: 555666,
            placeOfBirth: 'NYC',
            sex: 'Male',
            dateOfBirth: '18/01/1980',
            country: 'USA',
            academicYear: 2021
        }
        await this.db.insert(table, item);
        //////////////////////////////////////////////

        //////////////////////////////////////////////      PROFESSORS
        /////////////////////////////////////// Professor 1:
        var table = 'Auth'
        var username = "Emanuelle"
        var hashedpass = bcrypt.hashSync("PassEma", config.salt)
        var item = {
            username: username,
            hashedpass: hashedpass
        }
        await this.db.insert(table, item);

        table = 'Profile';
        var item = {
            firstName: 'Emanuelle',
            lastName: 'Rosatelli',
            role: 'professor',
            serialNumber: 11234,
            placeOfBirth: 'LLA',
            sex: 'Male',
            dateOfBirth: '18/01/1955',
            country: 'Italy',
            academicYear: 2021
        }
        await this.db.insert(table, item);

        table = 'Prof';
        var item = {
            serialNumber: 11234,
            courseCode: 12345
        }
        await this.db.insert(table, item);

        var item = {
            serialNumber: 11234,
            courseCode: 23456
        }
        await this.db.insert(table, item);
        //////////////////////////////////////////////
        /////////////////////////////////////// Professor 2:
        var table = 'Auth'
        var username = "Silvia"
        var hashedpass = bcrypt.hashSync("PassSil", config.salt)
        var item = {
            username: username,
            hashedpass: hashedpass
        }
        await this.db.insert(table, item);

        table = 'Profile';
        var item = {
            firstName: 'Silvia',
            lastName: 'Bonomi',
            role: 'professor',
            serialNumber: 15987,
            placeOfBirth: 'Roma',
            sex: 'Female',
            dateOfBirth: '18/01/1955',
            country: 'Italy',
            academicYear: 2021
        }
        await this.db.insert(table, item);

        table = 'Prof';
        var item = {
            serialNumber: 15987,
            courseCode: 34567
        }
        await this.db.insert(table, item);
        var item = {
            serialNumber: 15987,
            courseCode: 45678
        }
        await this.db.insert(table, item);

        //////////////////////////////////////////////
        /////////////////////////////////////// Professor 3:
        var table = 'Auth'
        var username = "Fabio"
        var hashedpass = bcrypt.hashSync("PassFab", config.salt)
        var item = {
            username: username,
            hashedpass: hashedpass
        }
        await this.db.insert(table, item);

        table = 'Profile';
        var item = {
            firstName: 'Fabio',
            lastName: 'Patrizi',
            role: 'professor',
            serialNumber: 75321,
            placeOfBirth: 'Milano',
            sex: 'Male',
            dateOfBirth: '18/01/1955',
            country: 'Italy',
            academicYear: 2021
        }
        await this.db.insert(table, item);

        table = 'Prof';
        var item = {
            serialNumber: 75321,
            courseCode: 56789
        }
        await this.db.insert(table, item);
        
        var item = {
            serialNumber: 75321,
            courseCode: 12345
        }
        await this.db.insert(table, item);
        //////////////////////////////////////////////

    }

    async display_results(){
        await this.db.find_all('Profile');
        await this.db.find_all('Auth');
        await this.db.find_all('Courses');
        await this.db.find_all('Prof');

    }
}

module.exports = {SQLManager};