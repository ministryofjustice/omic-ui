package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page

class UnallocatedPage extends Page {

    static url ="/manage-key-workers/unallocated"

    static at = {
        browser.currentUrl.contains(url)
        headingText == 'Auto-allocate key workers'
    }

    static content =  {
        headingText { $('h1').first().text() }
        table { $('table') }
        rows { $('table tbody tr') }
        allocateButton { $('button') }
    }
}
