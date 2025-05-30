

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('livros', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      autores: {
        type: Sequelize.STRING,
        allowNull: false
      },
      editora: {
        type: Sequelize.STRING,
        allowNull: false
      },
      anoPublicacao: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      edicao: {
        type: Sequelize.STRING,
        allowNull: false
      },
      linkOnline: {
        type: Sequelize.STRING,
        allowNull: false
      },
      disponivel: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('livros');
  }
};
