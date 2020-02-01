// @flow
import express from 'express'
import cors from 'cors'
import config from './config'
import responseTime from 'response-time'
import logger from 'morgan'
import log from '@bit/kriscarle.maphubs-utils.maphubs-utils.log'
import shrinkRay from 'shrink-ray-current'

var app = express()
app.enable('trust proxy')
app.disable('x-powered-by')
app.use('*', cors({ origin: '*' }))
app.use(responseTime())
app.use(logger('dev'))
app.use(shrinkRay())

// load all route files
require('./routes/tiles')(app)

app.listen(config.internal_port, () => {
  log.info(`Server running on port ${config.internal_port}`)
})
