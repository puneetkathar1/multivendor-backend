'use strict';
module.exports = (sequelize, DataTypes) => {
  const ch_salon_owner = sequelize.define('ch_salon_owner', {
    NAME: DataTypes.STRING,
    EMAIL: DataTypes.STRING,
    PHONENO: DataTypes.STRING,
    GENDER: DataTypes.STRING,
    STATUS: DataTypes.STRING,
    ADDRESS: DataTypes.STRING,
    CITY: DataTypes.INTEGER
  }, {});
  ch_salon_owner.associate = function(models) {
    // associations can be defined here
    models.ch_salon_owner.hasMany(models.ch_salon_detail, {as:"salondetail", foreignKey: 'OWNERID' });
    

  };
  return ch_salon_owner;
};