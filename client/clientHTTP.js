const axios = require("axios")

const API_URL =
  "http://localhost:3000/api/sensor-data"

// 45 min / 30s = 90 leituras
const TOTAL_LEITURAS = 180

let leituraAtual = 0

async function enviarLeitura() {

  leituraAtual++

  const progresso =
    leituraAtual / TOTAL_LEITURAS

  // temperatura cai com a chuva
  const temperatura =
    Number(
      (
        26 -
        (progresso * 4) +
        ((Math.random() - 0.5) * 0.4)
      ).toFixed(1)
    )

  // umidade aumenta
  const umidade =
    Math.min(
      99,
      Math.round(
        65 +
        (progresso * 34) +
        ((Math.random() - 0.5) * 3)
      )
    )

  // intensidade da chuva
  const nivel_chuva_raw =
    Math.min(
      1024,
      Math.max(
        0,
        Math.round(
          progresso * 1024 +
          ((Math.random() - 0.5) * 50)
        )
      )
    )

  // começa a chover após alguns minutos
  const chuva =
    leituraAtual > 5

  // canal enchendo
  const distancia_agua_cm =
    Math.max(
      15,
      Math.round(
        195 -
        (progresso * 160) +
        ((Math.random() - 0.5) * 3)
      )
    )

  const payload = {
    temperatura,
    umidade,
    chuva,
    nivel_chuva_raw,
    distancia_agua_cm
  }

  try {

    await axios.post(
      API_URL,
      payload
    )

    console.log(
      `[${leituraAtual}/${TOTAL_LEITURAS}]`,
      payload
    )

  } catch (err) {

    console.error(
      "Erro ao enviar:",
      err.message
    )
  }

  if (
    leituraAtual >= TOTAL_LEITURAS
  ) {

    console.log(
      "\nSimulação concluída."
    )

    clearInterval(timer)
  }
}

console.log(
  "Iniciando simulação..."
)

enviarLeitura()

const timer =
  setInterval(
    enviarLeitura,
    30000
  )