import { Sequelize } from 'sequelize';
import database from '../db/database.js';

const Notificacao = database.define('notificacao', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  mensagem: {
    type: Sequelize.STRING,
    allowNull: false
  },
  data: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  tableName: 'notificacoes'
});

export default Notificacao;
