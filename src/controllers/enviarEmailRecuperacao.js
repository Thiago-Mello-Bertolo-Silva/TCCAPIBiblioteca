import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import  Usuario  from '../models/Usuario.js'; 

const enviarEmailRecuperacao = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'E-mail é obrigatório.' });
  }

  try {
    // Verifica se o usuário existe no banco
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: 'E-mail não encontrado.' });
    }

    // Gera token JWT com ID do usuário (ou email)
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // 15 minutos
    );

    // Link para página de nova senha (FRONTEND)
    const linkRedefinirSenha = `${process.env.FRONTEND_URL}/nova-senha/${token}`;

    // Configurar o Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Conteúdo do e-mail
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Recuperação de Senha - Biblioteca do PPGE',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2>Olá, ${usuario.nome}!</h2>
          <p>Você solicitou a recuperação da sua senha.</p>
          <p>Clique no botão abaixo para redefinir sua senha. Este link é válido por 15 minutos:</p>
          <a href="${linkRedefinirSenha}"
             style="display:inline-block;padding:12px 24px;background-color:#2563eb;color:#ffffff;
                    text-decoration:none;border-radius:6px;font-weight:bold;">
            Redefinir Senha
          </a>
          <p>Se você não solicitou essa recuperação, ignore este e-mail.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'E-mail de recuperação enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail de recuperação:', error);
    res.status(500).json({ error: 'Erro ao enviar e-mail de recuperação.' });
  }
};

export default enviarEmailRecuperacao;