'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class file_general extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  file_general.init({
    name: DataTypes.STRING,
    size_bytes: DataTypes.INTEGER,
    extension: DataTypes.STRING,
    type_readable: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'file_general',
  });
  return file_general;
};
