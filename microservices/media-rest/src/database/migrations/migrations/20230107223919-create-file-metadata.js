'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('file_metadata', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      file_id: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      size_kb: {
        type: Sequelize.INTEGER
      },
      extension: {
        type: Sequelize.STRING
      },
      duration_ms: {
        type: Sequelize.INTEGER
      },
      resolution: {
        type: Sequelize.INTEGER
      },
      width: {
        type: Sequelize.INTEGER
      },
      height: {
        type: Sequelize.INTEGER
      },
      type_readable: {
        type: Sequelize.STRING
      },
      codec_name: {
        type: Sequelize.STRING
      },
      codec_long_name: {
        type: Sequelize.STRING
      },
      codec_type: {
        type: Sequelize.STRING
      },
      aspect_ratio: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('file_metadata');
  }
};