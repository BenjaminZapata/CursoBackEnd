import winston from "winston"
import dotenv from "dotenv"

dotenv.config()

const winstonConfig = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
  },
  colors: {
    debug: 'white',
    http: 'green',
    info: 'blue',
    warning: 'yellow',
    error: 'orange',
    fatal: 'red'
  }
}

winston.addColors(winstonConfig.colors)

const createLogger = ( env ) => {
  if (env == "PRODUCTION"){
    return winston.createLogger({
      levels: winstonConfig.levels,
      level: 'info',
      transports: [
        new winston.transports.File({ 
          filename: './errors.log',
          level: 'error'
        }),
        new winston.transports.Console({ 
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    })
  } else {
    return winston.createLogger({
      levels: winstonConfig.levels,
      level: 'debug',
      transports: [
        new winston.transports.File({ 
          filename: './errors.log',
          level: 'error'
        }),
        new winston.transports.Console({ 
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    })
  }
}

const logger = createLogger(process.env.ENVIRONMENT)

export default logger