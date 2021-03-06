package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class KeyworkerEditConfirmPage extends Page {


    static url = "/confirm-edit"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Update status')
    }

    static content = {
        headingText { $('h1').first().text() }
        status { $('#keyworker-status')}
        inactiveWarning (required: false) {$('#inactiveWarning')}
        errorMessage (required: false) {$('.error-message')}
        annualLeaveDatePicker (required: false) {$('.datePickerInput')}
        allocationOptions { $('input', name: 'allocationOption') }
        saveButton(to: KeyworkerProfilePage) { $('.button-save') }
        saveButtonValidationError{ $('.button-save') }
        cancelButton(to: KeyworkerEditPage) { $('.button-cancel') }
        backLink { $('a.backlink')}
        parentPageLink { $("[data-qa='breadcrumb-parent-page-link']")}
    }
}
