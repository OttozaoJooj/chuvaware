const pool = require("../db")

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

      return {
        success: true,
        data: result.rows[0]
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
}

module.exports = sensorRoutes