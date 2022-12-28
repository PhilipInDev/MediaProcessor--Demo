'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FileMetadata', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      length_ms: {
        type: Sequelize.INTEGER
      },
      resolution: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FileMetadata');
  }
};
