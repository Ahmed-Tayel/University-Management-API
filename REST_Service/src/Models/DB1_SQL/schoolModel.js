const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database.sqlite',
  logging: false
});

class Auth extends Model {}

Auth.init({
  serialNumber: {type: DataTypes.STRING, allowNull: false, primaryKey: true},
  hashedpass: {type: DataTypes.STRING, allowNull: false}
}, {
  sequelize,
  modelName: 'Auth'
});

class Profile extends Model {}

Profile.init({
  firstName: {type: DataTypes.STRING, allowNull: false},
  lastName: {type: DataTypes.STRING},
  role: {type: DataTypes.STRING},
  serialNumber: {type: DataTypes.INTEGER, allowNull: false, references: {model: Auth, key: 'serialNumber'}, unique: true},
  placeOfBirth: {type: DataTypes.STRING},
  sex: {type: DataTypes.STRING},
  dateOfBirth: {type: DataTypes.STRING},
  country: {type: DataTypes.STRING},
  academicYear: {type: DataTypes.INTEGER}
}, {
  sequelize,
  modelName: 'Profile'
});

class Courses extends Model {}

Courses.init({
  course: {type: DataTypes.STRING, allowNull: false, unique: true},
  credits: {type: DataTypes.INTEGER},
  courseCode: {type: DataTypes.INTEGER, primaryKey: true},
  academicYear: {type: DataTypes.INTEGER}
}, {
  sequelize,
  modelName: 'Courses'
});

class Prof extends Model {}

Prof.init({
  serialNumber: {type: DataTypes.INTEGER, allowNull: false, references: {model: Auth, key: 'serialNumber'}},
  courseCode: {type: DataTypes.INTEGER, unique: true,  references: {model: Courses, key: 'courseCode'}}
}, {
  sequelize,
  modelName: 'Prof'
});


module.exports = {sequelize ,Profile, Courses, Prof, Auth};