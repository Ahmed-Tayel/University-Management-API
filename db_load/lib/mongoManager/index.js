'use strict';

const config = require('../../config');
const {DocDB} = require('./DB/index');
const examItem = require('./DB/models/examItem');

class NoSQLManager {
    constructor(){
        this.db = config.mongoDB;
        this.collection = config.mongoColl;
        this.uri = config.mongoURL;
        this.instance = new DocDB(this.uri, this.db, this.collection);
    }

    async init(){
        await this.instance.init();
    }

    /**
     * Available Courses: 12345
     */
    async dumb_db(){
        var Item = new examItem();
        Item.Id = 'Ahmed';
        Item.enrolled = [12345, 23456, 34567];
        Item.booked = [12345, 23456];
        Item.registered = [{course : 12345, grade: 2.5}, {course : 23456, grade: 2.0}]
        await this.instance.insert_item(Item);

        Item.Id = 'Tom';
        Item.enrolled = [23456, 34567, 45678];
        Item.booked = [23456, 34567];
        Item.registered = [{course : 23456, grade: 3.2}, {course : 34567, grade: 3.6}]
        await this.instance.insert_item(Item);

        Item.Id = 'Ted';
        Item.enrolled = [34567, 45678, 56789];
        Item.booked = [34567, 45678];
        Item.registered = [{course : 34567, grade: 4}, {course : 45678, grade: 3}]
        await this.instance.insert_item(Item);
    }

    async close_conn(){
        await this.instance.close_connection();
    }
}

module.exports = {NoSQLManager};