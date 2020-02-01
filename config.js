require('dotenv').config()
const getenv = require('getenv')

const config = {
  connection: {
    url: `postgres://${getenv('DB_USER')}:${getenv('DB_PASS')}@${getenv('DB_HOST')}:${getenv('DB_PORT')}/${getenv('DB_DATABASE')}`
  },
  database: {
    host: getenv('DB_HOST'),
    user: getenv('DB_USER'),
    database: getenv('DB_DATABASE'),
    password: getenv('DB_PASS'),
    port: getenv('DB_PORT')
  },
  internal_port: getenv('INTERNAL_PORT')
}

module.exports = config
