'use strict';

const { MongoClient } = require('mongodb');
const {examItem} = require('./models/examItem')
const assert = require('assert');

/**
 * @class DocDB
 */
class DocDB {

    /**
     * 
     * @param {String} uri 
     * @param {String} db 
     * @param {String} collection 
     */
    constructor(uri, db, collection){

        assert.equal(typeof uri, 'string');
        assert.equal(typeof db, 'string');
        assert.equal(typeof collection, 'string');

        this.uri = uri;
        this.collection = collection;
        this.db = db;
        this.dbColl;
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    }

    async init(){
        try {
            // Connect the client to the server
            await this.client.connect();
      
            // Establish and verify connection
            const database = this.client.db(this.db);
            this.dbColl = database.collection(this.collection);
          }
          catch(e){
              console.log(e);
          }
    }

    /**
     * 
     * @param {examItem} itemObj 
     */
    async insert_item(itemObj){
        try {
            const Item = {'_id': itemObj.Id, 'enrolled': itemObj.enrolled,
                'booked': itemObj.booked, 'registered': itemObj.registered}
            const result = await this.dbColl.insertOne(Item);
            console.log(`A document was inserted with the _id: ${result.insertedId}`,);
        }
        catch (e){
            console.log(e);
        }
    }

    async select(query){
        try{
            let result = await this.dbColl.find(query).toArray();
            return result;
        }
        catch(e){
            throw new Error(e);
        }
    }

    async selectByEnrolledCourse(course){
        try{
            let result = await this.dbColl.find({
                enrolled: {$in: [course]}
            }).toArray()
            return result
        }
        catch(e){
            throw new Error(e);
        }
    }

    async selectByRegisteredCourse(course){
        try{
            if(! Array.isArray(course)){
                course = [course]
            }
            let result = await this.dbColl.find({
                registered: {$elemMatch: {course: {$in: course}}}
            }).toArray()
            return result
        }
        catch(e){
            throw new Error(e);
        }
    }

    async close_connection(){
        await this.client.close();
    }
}

module.exports = {DocDB}