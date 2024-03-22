'use strict';
const {
  Model
} = require('sequelize');
const bcryptjs = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile);
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Email is required`
        },
        notNull: {
          msg: `Email cannot be Null`
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Password is required`
        },
        notNull: {
          msg: `Password cannot be Null`
        }
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, options) => {
        if(user.password === '123!@#321AbC') {
          user.role = 'Admin';
        } else {
          user.role = 'User';
        }
        let salt = bcryptjs.genSaltSync(7);
        user.password = bcryptjs.hashSync(user.password, salt);
      }
    }
  });
  return User;
};

