const asyncMiddleware = require('../middleware/asyncHandler')

const contextUserRolesFactory = elite2Api => {
  const contextUserRoles = asyncMiddleware(async (req, res) => {
    const { username, hasAdminRole } = req.query
    const data = await elite2Api.contextUserRoles(res.locals, username, hasAdminRole)
    res.json(data)
  })

  return {
    contextUserRoles,
  }
}

module.exports = {
  contextUserRolesFactory,
}
