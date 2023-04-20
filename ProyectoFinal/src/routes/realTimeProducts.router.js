const express = require('express')
const router = express.Router()

router.get('/', (req, resp) => {
  resp.render('realTimeProducts', {})
})

module.exports = router