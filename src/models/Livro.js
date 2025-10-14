import { Sequelize } from 'sequelize';
import database from '../db/database.js';

const Livro = database.define('livro', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  categorias: {
    type: Sequelize.STRING,
    allowNull: true
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
    allowNull: true
  },
  disponivel: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'Sim'
  },
}, {
  tableName: 'livros'
});

export default Livro;
