'use strict';

const {NoSQLManager} = require('./lib/mongoManager/index');
const {SQLManager} = require('./lib/SQLManager/index');

async function main() {

    /*
    const noSqlManager = new NoSQLManager();
    await noSqlManager.init();
    await noSqlManager.dumb_db();
    await noSqlManager.close_conn();
    */

    const sqlManager = new SQLManager();
    await sqlManager.init();
    //await sqlManager.dump_db();
    //await sqlManager.display_results();
    await sqlManager.close();

}
main();