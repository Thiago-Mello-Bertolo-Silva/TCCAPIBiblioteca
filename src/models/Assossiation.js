import Usuario from './Usuario.js';
import Livro from './Livro.js';
import Emprestimo from './Emprestimo.js';

// Um usuário pode ter vários empréstimos
Usuario.hasMany(Emprestimo, { foreignKey: 'usuarioId' });
Emprestimo.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Um livro pode estar em vários empréstimos
Livro.hasMany(Emprestimo, { foreignKey: 'livroId' });
Emprestimo.belongsTo(Livro, { foreignKey: 'livroId' });

Emprestimo.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Emprestimo.belongsTo(Livro, { foreignKey: 'livroId', as: 'Livro' });

export { Usuario, Livro, Emprestimo };
