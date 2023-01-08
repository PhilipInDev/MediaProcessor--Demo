'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class file_metadata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  file_metadata.init({
    file_id: DataTypes.STRING,
    duration_ms: DataTypes.INTEGER,
    resolution: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    type_readable: DataTypes.STRING,
    codec_name: DataTypes.STRING,
    codec_long_name: DataTypes.STRING,
    codec_type: DataTypes.STRING,
    aspect_ratio: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'file_metadata',
  });
  return file_metadata;
};
