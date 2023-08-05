import EErrors from "../services/errors/enums.js"

export const errorHandler = (error, req, res, next) => {
  switch(error.code){
    case EErrors.AUTHORIZATION_ERROR:
      res.status(400).send({ status: "error", error: error.name })
      break
    case EErrors.DATABASE_ERROR:
      res.status(400).send({ status: "error", error: error.name })
      break
    case EErrors.EXISTING_DATA_ERROR:
      res.status(400).send({ status: "error", error: error.name })
      break
    case EErrors.EXPIRED_TIME_ERROR:
      res.status(400).send({ status: "error", error: error.name })
      break
    case EErrors.INVALID_FIELDS_ERROR:
      res.status(400).send({ status: "error", error: error.name })
      break
    case EErrors.LOGGING_ERROR:
      res.status(400).send({ status: "error", error: error.name })
      break
    case EErrors.NOT_DATA_FOUND_ERROR:
      res.status(400).send({ status: "error", error: error.name })
      break
    default:
      res.send({ status: "error", error: "Error no identificado"})
  }
}