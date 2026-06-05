require("dotenv").config()

const pool = require("./src/db")

async function test() {

 /* const result = await pool.query(
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
      28.5,
      90,
      true,
      1400,
      45
    ]
  )*/
  const result = pool.query('SELECT * FROM sensor_reading');

  console.log((await result).rows);
}

test()