


async function sensorRoutes(fastify) {

  //
  // POST dados sensores
  //

  fastify.post("/api/sensor-data", async (request, reply) => {

    try {

      const data = request.body

      console.log(data);
    } catch (error) {

      console.error(error)

      return reply.status(500).send({
        success: false,
        error: "Erro interno"
      })
    }
  })

  //
  // GET últimas leituras
  //

  fastify.get("/api/readings", async () => {

    const readings = 'tete'

    return readings
  })
}

module.exports = sensorRoutes