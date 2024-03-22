'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User);
      Profile.hasMany(models.Post);
    }
    static getTotalUser() {
      return Profile.count();
    }

    get street() {
      return this.address + ' ' + 'Street'
    }

  }
  Profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Name is required`
        },
        notNull: {
          msg: `Name cannot be Null`
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `Address is required`
        },
        notNull: {
          msg: `Address cannot be Null`
        }
      }
    },
    photoProfile: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    userName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
    hooks: {
      beforeCreate: (profile, options) => {
        profile.userName = `User_` + profile.name.toLowerCase().split(' ').join('_');
        profile.photoProfile = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';
      }
    }
  });
  return Profile;
};