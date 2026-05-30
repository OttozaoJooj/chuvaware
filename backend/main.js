//https://api.thingspeak.com/channels/3334856/feeds.json?api_key=NS5N1TSW1ULKFX3O&results=2
import Fastify from "fastify"
import cors from "@fastify/cors"

import sensorRoutes from "./routes/sensorRoutes"

const app = Fastify({
  logger: true
})

//
// CORS
//

app.register(cors, {
  origin: true
})

//
// Rotas
//

app.register(sensorRoutes)

//
// Start
//

const start = async () => {

  try {

    await app.listen({
      port: process.env.PORT || 3000,
      host: "0.0.0.0"
    })

    console.log("Servidor iniciado!")

  } catch (error) {

    app.log.error(error)

    process.exit(1)
  }
}

start()