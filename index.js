//Ejecutar servicios
import {initServer} from './configs/server.js'
import {connect} from './configs/mongo.js'
initServer()
connect()