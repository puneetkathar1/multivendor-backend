'use strict';
module.exports = (sequelize, DataTypes) => {
  const ch_salon_category = sequelize.define('ch_salon_category', {
    salonCategoryName: DataTypes.STRING,
    salonSlug: DataTypes.STRING,
    sortDesc: DataTypes.TEXT,
    Gender: DataTypes.STRING,
    Thumbnail: DataTypes.STRING,
    Status: DataTypes.BOOLEAN
  }, {});
  ch_salon_category.associate = function(models) {
    // associations can be defined here
    models.ch_salon_category.hasMany(models.ch_salon_service, {as:"service", foreignKey: 'CAT_ID' });

  };
  return ch_salon_category;
};