// controllers/feedbackController.js
import nodemailer from "nodemailer"

export async function enviarFeedback(req, res) {
  const { titulo, mensagem } = req.body

  if (!titulo || !mensagem) {
    return res.status(400).json({ error: "Título e mensagem são obrigatórios" })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bibliotecadoppge@gmail.com", // seu email
        pass: "jofb wavf gwjj svgb", // senha de app
      },
    })

    await transporter.sendMail({
      from: '"Feedback Biblioteca" <bibliotecadoppge@gmail.com>',
      to: "bibliotecadoppge@gmail.com",
      subject: `Feedback: ${titulo}`,
      text: mensagem,
    })

    res.status(200).json({ message: "Feedback enviado com sucesso" })
  } catch (error) {
    console.error("Erro ao enviar feedback:", error)
    res.status(500).json({ error: "Erro ao enviar e-mail" })
  }
}
