const log = require('../log');
const logError = require('../logError').logError;
const properCaseName = require('../../src/stringUtils').properCaseName;
const telemetry = require('../azure-appinsights');

// TODO: There's a lot of duplication in this module...

const serviceFactory = (elite2Api, keyworkerApi, offenderSearchResultMax) => {
  const unallocated = async (context, agencyId) => {
    const offenderWithLocationDtos = await keyworkerApi.unallocated(context, agencyId);
    log.debug({ data: offenderWithLocationDtos }, 'Response from unallocated offenders request');

    const offenderNumbers = offenderWithLocationDtos.map(offenderWithLocation => offenderWithLocation.offenderNo);
    if (offenderNumbers.length > 0) {
      const allReleaseDates = await elite2Api.sentenceDetailList(context, offenderNumbers);
      log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request');

      const allCsras = await elite2Api.csraList(context, offenderNumbers);
      log.debug({ data: allCsras }, 'Response from csraList request');

      for (const offenderWithLocation of offenderWithLocationDtos) {
        const offenderNo = offenderWithLocation.offenderNo;
        offenderWithLocation.crsaClassification = findCrsaForOffender(allCsras, offenderNo);
        offenderWithLocation.confirmedReleaseDate = findReleaseDateForOffender(allReleaseDates, offenderNo);
      }
    }
    return offenderWithLocationDtos;
  };

  /**
   * 1) Run the auto-allocation process for an agency/prison
   * 2) Return information about the keyworker allocations for an agency/prison.
   * @param context
   * @param agencyId
   * @returns {Promise<{keyworkerResponse: *, allocatedResponse: *, warning: string}>}
   */
  const allocated = async (context, agencyId) => {
    let insufficientKeyworkers = '';
    try {
      await keyworkerApi.autoAllocate(context, agencyId);
    } catch (error) {
      const msg = warning(error);
      if (msg) {
        log.warn({ data: error.response }, 'Caught warning');
        insufficientKeyworkers = msg;
      } else {
        throw error;
      }
    }

    const availableKeyworkers = await keyworkerApi.availableKeyworkers(context, agencyId);
    log.debug({ availableKeyworkers }, 'Response from available keyworker request');

    const offenderWithAllocatedKeyworkerDtos = await keyworkerApi.autoallocated(context, agencyId);
    log.debug({ offenders: offenderWithAllocatedKeyworkerDtos }, 'Response from allocated offenders request');

    if (telemetry) {
      telemetry.trackEvent({ name: "Auto allocation" });
    }

    const offenderNumbers = offenderWithAllocatedKeyworkerDtos.map(offender => offender.offenderNo);
    if (offenderNumbers.length > 0) {
      const allReleaseDates = await elite2Api.sentenceDetailList(context, offenderNumbers);
      log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request');

      const allCsras = await elite2Api.csraList(context, offenderNumbers);
      log.debug({ data: allCsras }, 'Response from csraList request');

      for (const offenderWithAllocatedKeyworker of offenderWithAllocatedKeyworkerDtos) {
        const keyworker = availableKeyworkers.find(keyworker => keyworker.staffId === offenderWithAllocatedKeyworker.staffId);
        if (keyworker) {
          offenderWithAllocatedKeyworker.keyworkerDisplay = `${properCaseName(keyworker.lastName)}, ${properCaseName(keyworker.firstName)}`;
          offenderWithAllocatedKeyworker.numberAllocated = keyworker.numberAllocated;
        } else {
          const details = await getKeyworkerDetails(
            context,
            offenderWithAllocatedKeyworker.staffId,
            offenderWithAllocatedKeyworker.agencyId,
            offenderWithAllocatedKeyworker.offenderNo);
          offenderWithAllocatedKeyworker.keyworkerDisplay = details.keyworkerDisplay;
          offenderWithAllocatedKeyworker.numberAllocated = details.numberAllocated;
        }
        const offenderNo = offenderWithAllocatedKeyworker.offenderNo;
        offenderWithAllocatedKeyworker.crsaClassification = findCrsaForOffender(allCsras, offenderNo);
        offenderWithAllocatedKeyworker.confirmedReleaseDate = findReleaseDateForOffender(allReleaseDates, offenderNo);
      }
    }
    return {
      keyworkerResponse: availableKeyworkers,
      allocatedResponse: offenderWithAllocatedKeyworkerDtos,
      warning: insufficientKeyworkers
    };
  };

  const keyworkerAllocations = async (context, staffId, agencyId) => {
    const keyworkers = await keyworkerApi.availableKeyworkers(context, agencyId);
    log.debug({ data: keyworkers }, 'Response from availableKeyworkers request');
    const keyworkerAllocationDetailsDtos = await keyworkerApi.keyworkerAllocations(context, staffId, agencyId);
    log.debug({ data: keyworkerAllocationDetailsDtos }, 'Response from keyworkerAllocations request');

    const offenderNumbers = keyworkerAllocationDetailsDtos.map(keyworkerAllocationDetails => keyworkerAllocationDetails.offenderNo);
    if (offenderNumbers.length > 0) {
      const allReleaseDates = await elite2Api.sentenceDetailList(context, offenderNumbers);
      log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request');

      const allCsras = await elite2Api.csraList(context, offenderNumbers);
      log.debug({ data: allCsras }, 'Response from csraList request');

      const kwDates = await elite2Api.caseNoteUsageList(context, offenderNumbers);
      log.debug({ data: kwDates }, 'Response from case note usage request');

      for (const keyworkerAllocation of keyworkerAllocationDetailsDtos) {
        const offenderNo = keyworkerAllocation.offenderNo;
        keyworkerAllocation.crsaClassification = findCrsaForOffender(allCsras, offenderNo);
        keyworkerAllocation.confirmedReleaseDate = findReleaseDateForOffender(allReleaseDates, offenderNo);
        keyworkerAllocation.lastKeyWorkerSessionDate = findKeyworkerCaseNoteDate(kwDates, offenderNo);
      }
    }

    return {
      keyworkerResponse: keyworkers,
      allocatedResponse: keyworkerAllocationDetailsDtos
    };
  };

  const searchOffenders = async (
    context,
    {
      agencyId,
      keywords,
      locationPrefix,
      allocationStatus
    }) => {
    const availableKeyworkers = await keyworkerApi.availableKeyworkers(context, agencyId);
    log.debug({ availableKeyworkers }, 'Response from available keyworker request');

    const resultsLimit = allocationStatus === 'all' ? offenderSearchResultMax : 4000;

    const offenders = await elite2Api.searchOffenders(context, keywords, locationPrefix, resultsLimit);
    log.debug({ searchOffenders: offenders }, 'Response from searchOffenders request');


    if (!(offenders && offenders.length > 0)) {
      return {
        keyworkerResponse: availableKeyworkers,
        offenderResponse: offenders,
        partialResults: false
      };
    }

    const offenderNumbers = getOffenderNumbers(offenders);
    const offenderKeyworkers = await keyworkerApi.offenderKeyworkerList(context, agencyId, offenderNumbers);
    log.debug({ data: offenderKeyworkers }, 'Response from getOffenders request');

    const filteredOffenders = applyAllocationStatusFilter(allocationStatus, offenders, offenderKeyworkers); //adjust results if filtering by unallocated

    const partialResults = filteredOffenders.length > offenderSearchResultMax;
    if (partialResults) {
      /* truncate array to max length */
      filteredOffenders.length = offenderSearchResultMax;
    }

    if (filteredOffenders.length > 0) {
      const filteredOffenderNumbers = getOffenderNumbers(filteredOffenders);
      const allReleaseDates = await elite2Api.sentenceDetailList(context, filteredOffenderNumbers);
      log.debug({ data: allReleaseDates }, 'Response from sentenceDetailList request');

      const allCsras = await elite2Api.csraList(context, filteredOffenderNumbers);
      log.debug({ data: allCsras }, 'Response from csraList request');

      for (const offender of filteredOffenders) {
        const offenderNo = offender.offenderNo;
        const staffId = findKeyworkerStaffIdForOffender(offenderKeyworkers, offenderNo);

        offender.staffId = staffId;

        if (staffId) {
          const keyworker = availableKeyworkers.find(keyworker => keyworker.staffId === staffId);
          if (keyworker) { // eslint-disable-line max-depth
            offender.keyworkerDisplay = `${properCaseName(keyworker.lastName)}, ${properCaseName(keyworker.firstName)}`;
            offender.numberAllocated = keyworker.numberAllocated;
          } else {
            const details = await getKeyworkerDetails(context, staffId, offender.agencyId, offenderNo);
            offender.keyworkerDisplay = details.keyworkerDisplay;
            offender.numberAllocated = details.numberAllocated;
          }
        }
        offender.crsaClassification = findCrsaForOffender(allCsras, offenderNo);
        offender.confirmedReleaseDate = findReleaseDateForOffender(allReleaseDates, offenderNo);
      }
    }
    return {
      keyworkerResponse: availableKeyworkers,
      offenderResponse: filteredOffenders,
      partialResults: partialResults
    };
  };

  const findKeyworkerStaffIdForOffender = (offenderKeyworkers, offenderNo) => {
    const keyworkerAssignmentsForOffender = offenderKeyworkers.filter(offenderKeyworker => offenderKeyworker.offenderNo === offenderNo);
    if (keyworkerAssignmentsForOffender.length >= 1) {
      const offenderKeyworker = keyworkerAssignmentsForOffender[0];
      return offenderKeyworker && offenderKeyworker.staffId;
    }
  };

  function warning (error) {
    if (error.response && error.response.data) {
      const msg = error.response.data.userMessage;
      if (msg === 'No Key workers available for allocation.' ||
        msg === 'All available Key workers are at full capacity.') {
        return msg;
      }
    }
    return null;
  }

  const applyAllocationStatusFilter = function (allocationStatus, currentOffenderResults, offenderKeyworkers) {
    let offenderResults = currentOffenderResults;

    switch (allocationStatus) {
      case "unallocated":
        offenderResults = offenderResults.filter(offender => !offenderKeyworkers.find(keyWorker => keyWorker.offenderNo === offender.offenderNo));
        break;
      case "allocated":
        offenderResults = offenderResults.filter(offender => offenderKeyworkers.find(keyWorker => keyWorker.offenderNo === offender.offenderNo));
        break;
    }
    log.debug(`After allocation status filter of ${allocationStatus} - new offender list is:`, { searchOffenders: offenderResults });
    return offenderResults;
  };

  const getOffenderNumbers = function (offenderResults) {
    return offenderResults && offenderResults.length && offenderResults.map(row => row.offenderNo);
  };


  /**
   *
   * @param context
   * @param staffId
   * @param agencyId
   * @param offenderNo
   * @returns {Promise<{}>} of { keyworkerDisplay, numberAllocated }
   *
   * TODO: Too many arguments!
   */
  const getKeyworkerDetails = async function (context, staffId, agencyId, offenderNo) {
    try {
      const keyworkerData = await keyworkerApi.keyworker(context, staffId, agencyId);

      const details = {};

      if (keyworkerData) {
        details.keyworkerDisplay = `${properCaseName(keyworkerData.lastName)}, ${properCaseName(keyworkerData.firstName)}`;
        details.numberAllocated = keyworkerData.numberAllocated;
      }
      return details;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        log.info(`No keyworker found for staffId Id ${staffId} on offenderNo ${offenderNo}`);
        return {
          keyworkerDisplay: '--',
          numberAllocated: 'n/a'
        };
      } else {
        logError('Not available', error, 'Error in addMissingKeyworkerDetails');
        throw error;
      }
    }
  };

  const findCrsaForOffender = (csras, offenderNo) => {
    const details = csras.filter(details => details.offenderNo === offenderNo);
    if (details.length < 1) {
      return;
    }
    const detail = details[0];
    return detail && detail.classification;
  };

  const findReleaseDateForOffender = (allReleaseDates, offenderNo) => {
    const details = allReleaseDates.filter(details => details.offenderNo === offenderNo);
    if (details.length < 1) {
      return;
    }
    const detail = details[0];
    return detail && detail.sentenceDetail && detail.sentenceDetail.releaseDate;
  };

  const findKeyworkerCaseNoteDate = function (kwDates, offenderNo) {
    const details = kwDates.filter(details => details.offenderNo === offenderNo);
    if (details.length < 1) {
      return;
    }
    //  TODO: m,v,i - really?
    return details.reduce((m, v, i) => (v.latestCaseNote > m.latestCaseNote) && i ? v : m).latestCaseNote;
  };

  // const offenderNoParamsSerializer = params => {
  //   s = '';
  //   for (const offenderNo of params) {
  //     s += 'offenderNo=' + offenderNo + '&';
  //   }
  //   return s;
  // };
  return {
    unallocated,
    allocated,
    keyworkerAllocations,
    searchOffenders
  };
};

module.exports = {
  serviceFactory
};
