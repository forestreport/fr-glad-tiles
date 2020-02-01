// @flow
import config from '../config'
import knex from '../connection'

export default (aoi_id: string, module_id: string, result_id: string) => {
  const query = knex.raw('(SELECT ST_GeomFromGeoJSON(features.geometry) as geometry FROM fr.results, jsonb_to_recordset(fr.results.details -> \'geoms\') AS features (geometry jsonb) WHERE aoi_id = (:aoiid)::text AND module_id = (:moduleid)::text AND result_id = (:resultid)::text) data',
    { aoiid: aoi_id, moduleid: module_id, resultid: result_id })
  const table = query.toString()
  return {
    Map: [
      {
        _attr:
              {
                srs: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs +over'
              }
      },
      {
        Parameters: [
          { Parameter: { _attr: { name: 'name' }, _cdata: 'forestreport' } },
          { Parameter: [{ _attr: { name: 'format' } }, 'png'] },
          { Parameter: [{ _attr: { name: 'minzoom' } }, 0] },
          { Parameter: [{ _attr: { name: 'maxzoom' } }, 22] }
        ]
      },
      {
        Style: [
          {
            _attr:
                  {
                    name: 'glad'
                  }
          },
          {
            Rule: [
              { PolygonSymbolizer: { _attr: { fill: 'rgba(255,0,0,0.7)' } } }
            ]
          }
        ]
      },
      {
        Layer: [
          {
            _attr:
                  {
                    name: 'data',
                    srs: '+init=epsg:4326',
                    status: 'on'
                  }
          },
          {
            StyleName: { _cdata: 'glad' }
          },
          {
            Datasource: [

              { Parameter: { _attr: { name: 'type' }, _cdata: 'postgis' } },
              { Parameter: { _attr: { name: 'host' }, _cdata: config.database.host } },
              { Parameter: { _attr: { name: 'dbname' }, _cdata: config.database.database } },
              { Parameter: { _attr: { name: 'port' }, _cdata: config.database.port } },
              { Parameter: { _attr: { name: 'user' }, _cdata: config.database.user } },
              { Parameter: { _attr: { name: 'password' }, _cdata: config.database.password } },
              { Parameter: { _attr: { name: 'extent' }, _cdata: '-180,-90,180,89.99' } },
              { Parameter: { _attr: { name: 'estimate_extent' }, _cdata: 'false' } },
              { Parameter: { _attr: { name: 'geometry_field' }, _cdata: 'geometry' } },
              { Parameter: { _attr: { name: 'geometry_table' }, _cdata: table } },
              { Parameter: { _attr: { name: 'table' }, _cdata: table } }

              // { Parameter: { _attr: { name: 'file' }, _cdata: 'fr-glad-tiles/temp/test.shp' } },
              // { Parameter: { _attr: { name: 'type' }, _cdata: 'shape' } }
            ]
          }
        ]
      }
    ]
  }
}

//          { LineSymbolizer: { _attr: { stroke: '#FFF', 'stroke-width': '0.5' } } }
