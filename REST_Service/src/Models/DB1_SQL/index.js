const {sequelize ,Profile, Courses, Prof, Auth} = require('./schoolModel')
const path = require('path')
const SysErrors = require(path.join(__dirname.split('src')[0], 'src' , 'SystemErrors')).Database

class SQLDB {

    constructor(){
        this.sequelize = sequelize
    }

    async init(){
        try{
            await this.sequelize.authenticate();
            await Profile.sync();
            await Courses.sync();
            await Prof.sync();
            await Auth.sync();
        }
        catch(error){
            console.error(error);
            throw new Error(SysErrors.DBNOINIT);
        }
    }

    async close(){
        try{
            await this.sequelize.close();
        }
        catch(error){
            console.error(error);
            throw new Error(SysErrors.DBCLOSE);
        }
    }

    async insert(table, item){
        const target = this.get_table(table);
        try{
            const result = await target.create(item);
            //console.log("result auto-generated ID:", result.id);
            return result;
        }
        catch(error){
            console.error(error);
            throw new Error(SysErrors.DBCRUD);
        }
    }

    get_table(tableStr){
        let target;
        switch (tableStr){
        case 'Profile':
            target = Profile;
            break;
        
        case 'Courses':
            target = Courses;
            break;

        case 'Prof':
            target = Prof;
            break;

        case 'Auth':
            target = Auth;
            break;
        }
        return target;
    }

    async find_all(table){
        const target = this.get_table(table);
        try{
            const result = await target.findAll({raw: true});
            return result;
            //console.log("All table results:", JSON.stringify(result, null, 2));
        }
        catch(error){
            throw new Error(SysErrors.DBCRUD);
        }
    }

    async select(table, queryObject){
        const target = this.get_table(table);
        try{
            const result = await target.findAll({
                where: queryObject,
                raw: true
            });
            return result
        }
        catch(err){
            throw new Error(SysErrors.DBCRUD);
        }
    }

    async getUsername(serialNumber){
        try {
            const result = await Auth.findAll({
                where: {
                    serialNumber: serialNumber
                }
              });

            return result
        }
        catch(err){
            throw new Error(SysErrors.DBCRUD);
        }
    }

}

module.exports = SQLDB;