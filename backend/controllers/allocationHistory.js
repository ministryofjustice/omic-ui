const log = require('../log')

const allocationHistoryFactory = (keyworkerApi) => {
  const allocationHistory = async (req, res) => {
    const { offenderNo } = req.query
    const allocationHistoryData = await keyworkerApi.allocationHistory(res.locals, offenderNo)
    log.debug('Response from allocation history request')
    res.json(allocationHistoryData)
  }

  return {
    allocationHistory,
  }
}

module.exports = {
  allocationHistoryFactory,
}
