package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page

class SearchForKeyworkerPage extends Page {

    static url = '/keyworker/search'

    static at = {
        browser.currentUrl.contains(url)
        headingText == 'Search for a key worker'
    }

    static content = {
        headingText { $('h1').text() }
        searchField { $('#search-text') }
        searchButton(to: KeyworkerResultsPage) { $('button') }
    }
}