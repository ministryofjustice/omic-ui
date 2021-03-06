const { possessive } = require('../utils')

module.exports = ({ keyworkerApi }) => {
  const renderTemplate = async (req, res, pageData = {}) => {
    const { errors = [], inputtedFormValues = {} } = pageData
    const {
      userDetails: { activeCaseLoadId },
      allCaseloads,
    } = req.session || {}
    const activeCaseLoad = allCaseloads.find((cl) => cl.caseLoadId === activeCaseLoadId)
    const caseloadWithoutBrackets = activeCaseLoad.description.replace(/ *\([^)]*\) */g, '')
    const prisonStatus = await keyworkerApi.getPrisonMigrationStatus(res.locals, activeCaseLoadId)
    const allowAuto = prisonStatus.autoAllocatedSupported ? 'yes' : 'no'

    return res.render('manageKeyWorkerSettings', {
      errors,
      formValues: {
        allowAuto: inputtedFormValues.allowAuto || allowAuto,
        standardCapacity: (inputtedFormValues.standardCapacity || prisonStatus.capacityTier1).toString(),
        extendedCapacity: (inputtedFormValues.extendedCapacity || prisonStatus.capacityTier2).toString(),
        frequency: Number(inputtedFormValues.frequency || prisonStatus.kwSessionFrequencyInWeeks),
      },
      title: `Manage ${possessive(caseloadWithoutBrackets)} key worker settings`,
    })
  }

  const index = (req, res) => renderTemplate(req, res)

  const post = async (req, res) => {
    const { activeCaseLoadId } = req.session?.userDetails || {}
    const { allowAuto, standardCapacity, extendedCapacity, frequency } = req.body
    const { supported } = await keyworkerApi.getPrisonMigrationStatus(res.locals, activeCaseLoadId)

    if (Number(standardCapacity) > Number(extendedCapacity)) {
      return renderTemplate(req, res, {
        errors: [
          {
            href: '#extendedCapacity',
            text: 'Enter a maximum number of prisoners a key worker is able to have which is not less than the number of prisoners a key worker can have allocated',
          },
        ],
        inputtedFormValues: req.body,
      })
    }

    const capacity = `${standardCapacity},${extendedCapacity}`

    if (allowAuto === 'yes') {
      await keyworkerApi.enableAutoAllocationAndMigrate(res.locals, activeCaseLoadId, !supported, capacity, frequency)
    } else {
      await keyworkerApi.enableManualAllocationAndMigrate(res.locals, activeCaseLoadId, !supported, capacity, frequency)
    }

    return res.redirect('/')
  }

  return { index, post }
}
