import Notificacao from "../models/notificacao.js"

export async function verificarNotificacoes(req, res) {
  try {
    const { id } = req.params
    const notificacoes = await Notificacao.findAll({
      where: { usuarioId: id },
      order: [["data", "DESC"]],
    })
    res.json(notificacoes)
  } catch (error) {
    console.error("Erro ao buscar notificações:", error)
    res.status(500).json({ error: "Erro ao buscar notificações" })
  }
}