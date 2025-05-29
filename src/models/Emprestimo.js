import { Sequelize } from 'sequelize';
import database from '../db/database.js';

const Emprestimo = database.define('emprestimo', {
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
  livroId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  dataInicio: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  dataPrevistoDevolucao: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'Pendente'
  }
}, {
  tableName: 'emprestimos',
});

export default Emprestimo;
