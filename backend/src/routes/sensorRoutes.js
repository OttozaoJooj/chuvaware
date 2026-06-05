const pool = require("../db")

const {
  sendTelegramMessage
} = require("../services/telegramService")

const {
  getRiskLevel
} = require("../services/riskService")

async function sensorRoutes(fastify) {

  fastify.post(
    "/api/sensor-data",
    async (request, reply) => {

      const {
        temperatura,
        umidade,
        chuva,
        nivel_chuva_raw,
        distancia_agua_cm
      } = request.body

      const risk = getRiskLevel(distancia_agua_cm);

      const result = await pool.query(
        `
        INSERT INTO sensor_reading
        (
          temperatura,
          umidade,
          chuva,
          nivel_chuva_raw,
          distancia_agua_cm
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5
        )
        RETURNING *
        `,
        [
          temperatura,
          umidade,
          chuva,
          nivel_chuva_raw,
          distancia_agua_cm
        ]
      )

    if(chuva && risk){
        const channelLevelPercent = Math.trunc(100 - (distancia_agua_cm * 100)/200);
        const rainIntensityPercent = Math.trunc((nivel_chuva_raw * 100)/1024);
        await sendTelegramMessage(
            `🚨 ${risk}

            🌧️ Chuva detectada

            📏 Nível do Canal: ${channelLevelPercent}%

            💧 Intensidade da chuva: ${rainIntensityPercent}%

            🕒 Horário: ${new Date().toLocaleString()}`
        )
        
    }

    return {
    success: true,
    data: 'Dados Cadastrados com Sucesso'
    }
  }
)

  fastify.get(
    '/api/sensor-data',
    async (request, reply) =>{
        const result = pool.query("SELECT temperatura, umidade, chuva,nivel_chuva_raw, distancia_agua_cm, created_at FROM sensor_reading WHERE created_at >= NOW() - interval '1 hours' ORDER BY created_at ASC;")

        return {
            success: true,
            data: (await result).rows
        }
    }
  )

  fastify.get(
  "/api/test-telegram",
  async () => {

    await sendTelegramMessage(
      "🚨 Teste do sistema ChuvaWare"
    )

    return {
      success: true,
      message: "Mensagem enviada"
    }
  }
)
}

module.exports = sensorRoutes