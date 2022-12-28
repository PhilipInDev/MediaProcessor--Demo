'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FileMetadata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FileMetadata.init({
    name: DataTypes.STRING,
    size_kb: DataTypes.INTEGER,
    extension: DataTypes.STRING,
    length_ms: DataTypes.INTEGER,
    resolution: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FileMetadata',
  });
  return FileMetadata;
};
