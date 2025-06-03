const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'sua_chave_secreta'; // Idealmente use process.env.JWT_SECRET

async function sendConfirmationEmail({ to, nome, email, telefone, senha }) {
  const token = jwt.sign({ nome, email, telefone, senha }, JWT_SECRET, { expiresIn: '1d' });
  const confirmLink = `https://s44w4okwc8k0swgwkks0kcw0.212.85.1.115.sslip.io/confirmar/${token}`; // backend confirmador

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'seuemail@gmail.com',
      pass: 'sua-senha-ou-app-pass',
    },
  });

  const mailOptions = {
    from: '"Biblioteca Virtual" <seuemail@gmail.com>',
    to,
    subject: 'Confirme seu cadastro',
    html: `
      <h2>Olá, ${nome}!</h2>
      <p>Obrigado por se cadastrar. Clique no botão abaixo para confirmar seu cadastro:</p>
      <a href="${confirmLink}" style="background: green; color: white; padding: 10px 15px; border-radius: 5px;">Confirmar Cadastro</a>
      <p>Este link expira em 24 horas.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendConfirmationEmail;
