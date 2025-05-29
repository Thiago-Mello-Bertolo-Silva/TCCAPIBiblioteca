import { Sequelize } from 'sequelize'
import database from '../db/database.js'
import Emprestimo from './Emprestimo.js';

const Usuario = database.define('usuario', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  cargo: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'usuario'
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  telefone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false
  },
}, {
  tableName: 'usuarios'
})


export default Usuario
