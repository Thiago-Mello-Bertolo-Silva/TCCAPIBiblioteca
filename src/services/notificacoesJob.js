// src/jobs/notificacoesJob.js
import cron from "node-cron"
import { Op } from "sequelize"
import Emprestimo from "../models/Emprestimo.js"
import Notificacao from "../models/notificacao.js"
import Livro from "../models/Livro.js"
import Usuario from "../models/Usuario.js"
import nodemailer from "nodemailer"

// Configura o transporter do Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
})

cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Verificando notificações...")
  const hoje = new Date()
  const amanha = new Date(hoje)
  amanha.setDate(hoje.getDate() + 1)

  const emprestimos = await Emprestimo.findAll({
    where: {
      status: { [Op.ne]: "Concluído" },
      dataPrevistoDevolucao: {
        [Op.lte]: amanha.toISOString().split("T")[0],
      },
    },
    include: [
      { model: Livro, as: "Livro" },
      { model: Usuario, as: "usuario" }, // importante para pegar email/nome
    ],
  })

  for (const emp of emprestimos) {
    const diasRestantes = Math.ceil(
      (new Date(emp.dataPrevistoDevolucao) - hoje) / (1000 * 60 * 60 * 24)
    )

    let msg = ""
    if (diasRestantes === 0)
      msg = `Hoje é o dia da devolução do livro "${emp.Livro?.titulo}".`
    else if (diasRestantes < 0)
      msg = `O livro "${emp.Livro?.titulo}" está em atraso para devolução.`
    else if (diasRestantes === 1)
      msg = `Falta 1 dia para devolver o livro "${emp.Livro?.titulo}".`

    if (msg) {
      // 🔹 1) Cria notificação no banco (cards no site)
      await Notificacao.create({
        usuarioId: emp.usuarioId,
        mensagem: msg,
        data: new Date(),
      })

      // 🔹 2) Envia e-mail
      if (emp.usuario?.email) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: emp.usuario.email,
            subject: "Notificação de Empréstimo - Biblioteca",
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Olá, ${emp.usuario.nome}!</h2>
                <p>${msg}</p>
                <p>Acesse a Biblioteca Virtual para mais detalhes.</p>
              </div>
            `,
          })
          console.log(`📧 E-mail enviado para ${emp.usuario.email}`)
        } catch (error) {
          console.error("Erro ao enviar e-mail:", error)
        }
      }
    }
  }
})
