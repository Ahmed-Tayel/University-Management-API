const {sequelize ,Profile, Courses, Prof, Auth} = require('../DB/models/school')

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
            throw new Error(error)
        }
    }

    async close(){
        try{
            await this.sequelize.close();
        }
        catch(error){
            throw new Error(error)
        }
    }

    async insert(table, item){
        const target = this.get_table(table);
        try{
            const result = await target.create(item);
            console.log("result auto-generated ID:", result.id);
            return result;
        }
        catch(error){
            throw new Error(error)
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
            const result = await target.findAll({raw: true,});
            return result
        }
        catch(error){
            console.log("Error Occured find all OPs");
        }
    }

}

module.exports = {SQLDB};