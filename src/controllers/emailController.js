// src/controllers/emailController.js
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export const enviarEmailCadastro = async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Gerar token com os dados do usuário
    const token = jwt.sign(
      { nome, email, telefone, senha },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Link de confirmação com token apontando para o BACKEND
    const confirmLink = `${process.env.FRONTEND_URL}/confirmar/${token}`;

    // Configurar transportador
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Confirmação de Cadastro - Biblioteca Digital Universitária',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2>Olá, ${nome}!</h2>
          <p>
            Muito obrigado por se cadastrar na <strong>Biblioteca Digital Universitária</strong>! ☁️📚
          </p>
          <p>
            Nosso objetivo é simples: oferecer a você acesso rápido, fácil e confiável a um vasto acervo de livros,
            artigos e materiais acadêmicos, para apoiar seus estudos e sua jornada de aprendizado.
          </p>
          <p>
            Mas antes de liberar o acesso completo à plataforma, precisamos que você confirme seu cadastro clicando no botão abaixo:
          </p>
          <p>
            Não queremos enviar e-mails indesejados ou ativar contas que não foram realmente solicitadas.
          </p>
          <p>
            Então, o que acha? Vamos começar essa jornada de conhecimento juntos?
          </p>
          <a href="${confirmLink}"
             style="display:inline-block;padding:12px 24px;background-color:#2563eb;color:#ffffff;
                    text-decoration:none;border-radius:6px;font-weight:bold;">
            Validar Conta
          </a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ message: 'Erro ao enviar e-mail.', error });
  }
};
