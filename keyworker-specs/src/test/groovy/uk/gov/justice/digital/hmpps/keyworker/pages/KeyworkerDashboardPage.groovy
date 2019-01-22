package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page
import uk.gov.justice.digital.hmpps.keyworker.modules.HeaderModule

class KeyworkerDashboardPage extends Page {
    static url = "/manage-key-workers/key-worker-statistics"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Key worker statistics')
        keyworkerStats != null
    }

    static content = {
        headingText { $('h1').text() }
        header(required: false) { module(HeaderModule) }
        fromDateInput { $('#keyWorkerStatsFromDate') }
        fromDateTopBar { $('.from-date-picker th.rdtSwitch') }
        fromDateYearBox { value -> $('.from-date-picker  td', 'data-value': String.valueOf(value)) }
        fromDateMonthBox { value -> $('.from-date-picker  td', 'data-value': String.valueOf(value-1)) } // text: String.valueOf(value)) }
        fromDateDayBox { value -> $('.from-date-picker  td.rdtDay:not(.rdtOld):not(.rdtNew)', 'data-value': String.valueOf(value)) }
        toDateInput { $('#keyWorkerStatsToDate') }
        toDateTopBar { $('.to-date-picker th.rdtSwitch') }
        toDateYearBox { value -> $('.to-date-picker  td', 'data-value': String.valueOf(value)) }
        toDateMonthBox { value -> $('.to-date-picker  td', 'data-value': String.valueOf(value-1)) } // text: String.valueOf(value)) }
        toDateDayBox { value -> $('.to-date-picker  td.rdtDay:not(.rdtOld):not(.rdtNew)', 'data-value': String.valueOf(value)) }
        formSubmit { $('form button') }
        keyworkerStats { $("[data-qa='percentagePrisonersWithKeyworker-value']")}
        numberOfActiveKeyworkers { $("[data-qa='numberOfActiveKeyworkers-value']").text() }
        numberKeyWorkerSessions { $("[data-qa='numberKeyWorkerSessions-value']").text() }
        percentagePrisonersWithKeyworker { $("[data-qa='percentagePrisonersWithKeyworker-value']").text() }
        numProjectedKeyworkerSessions { $("[data-qa='numProjectedKeyworkerSessions-value']").text() }
        complianceRate { $("[data-qa='complianceRate-value']").text() }
        avgNumDaysFromReceptionToAllocationDays { $("[data-qa='avgNumDaysFromReceptionToAllocationDays-value']").text() }
        avgNumDaysFromReceptionToKeyWorkingSession { $("[data-qa='avgNumDaysFromReceptionToKeyWorkingSession-value']").text() }
        prisonerToKeyworkerRation {  $("[data-qa='prisonerToKeyworkerRation-value']").text() }

    }


    def setDatePickers(def fromYear, def fromMonth, def fromDay, def toYear, def toMonth, def toDay) {
        fromDateInput.click()
        fromDateTopBar.click()
        fromDateTopBar.click()
        fromDateYearBox(fromYear).click()
        fromDateMonthBox(fromMonth).click()
        fromDateDayBox(fromDay).click()
        toDateInput.click()
        toDateTopBar.click()
        toDateTopBar.click()
        toDateYearBox(toYear).click()
        toDateMonthBox(toMonth).click()
        toDateDayBox(toDay).click()
        formSubmit.click()
    }
}
