var config = {
    "jwtSecret" : process.env.jwtSecret,
    'mongoURL' : process.env.mongoURL,
    'jwtExcluded': ['/auth/login','/auth/signup'],
    'salt': process.env.salt,
    'mongoDB': process.env.mongoDB,
    'mongoColl': process.env.mongoColl
}

module.exports = config