# University-Management-API

This API simulates part of the functionality of how a university system works, it manages student authentication, study plan, booking exams, and it provides some statistics about the courses and the university in general

## How to Start the Server
1. configure the environment variables in "db_load/config.js" and "REST_Service/config.js", which is responsible for logging-in to both the SQL database and MongoDB, besides some jwt and bcrypt configurations 
2. run npm install in both "db_load" and "REST_Service" to install dependencies
3. run npm start in "db_load" directory to populate both the SQL and NoSQL databases
4. run npm start in "REST_Service" directory to start the server