// @flow
import log from '@bit/kriscarle.maphubs-utils.maphubs-utils.log'
import xml from 'xml'
import url from 'url'
import mapnikXML from '../services/mapnik-xml'
import config from '../config'

const tilelive = require('@mapbox/tilelive')
const fs = require('fs')
require('@mapbox/tilelive-mapnik').registerProtocols(tilelive)

module.exports = function (app: any) {
  app.get('/tiles/:aoi_id/:module_id/:result_id/:z(\\d+)/:x(\\d+)/:y(\\d+).png', (req, res) => {
    const z = parseInt(req.params.z)
    const x = parseInt(req.params.x)
    const y = parseInt(req.params.y)

    const { aoi_id, module_id, result_id } = req.params

    if (!module_id.startsWith('glad')) {
      res.status(404).send('Only GLAD modules supported')
      return
    }

    // build mapnik XML
    const layerXML = mapnikXML(aoi_id, module_id, result_id)

    let xmlString = '<?xml version="1.0" encoding="utf-8"?>'
    xmlString += '<!DOCTYPE Map[]>'
    xmlString += xml(layerXML)

    if (config.DEBUG) {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.writeFile(`temp/mapnik-${aoi_id}-${module_id}-${result_id}.xml`, xmlString, (err) => {
        if (err) {
          log.error(err.message)
          throw err
        }
      })
    }

    // defeat tilelive/mapnik caching by adding timestamp
    const uri: any = new url.URL(`mapnik://tiles/${aoi_id}/${module_id}/${result_id}/${Date.now()}`)
    uri.xml = xmlString
    uri.base = uri.pathname

    tilelive.load(uri, (err, source) => {
      if (err) {
        log.error(err.message)
        console.log(err)
        res.status(404)
        res.send(err.message)
        return
      }

      source.getTile(z, x, y, (err, tile, headers) => {
        if (err) {
          res.status(404)
          res.send(err.message)
        } else if (tile === null) {
          res.status(404).send('Not found')
        } else {
          // console.log(tile)
          res.set(headers)
          res.status(200).send(tile)
        }
      })
    })
  })
}
