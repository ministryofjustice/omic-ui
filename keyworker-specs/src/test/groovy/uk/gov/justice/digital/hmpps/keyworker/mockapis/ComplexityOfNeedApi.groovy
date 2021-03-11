package uk.gov.justice.digital.hmpps.keyworker.mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.get

class ComplexityOfNeedApi extends WireMockRule {

    ComplexityOfNeedApi() {
        super(18081)
    }

    void stubHealth() {
        this.stubFor(
                get('/health')
                        .willReturn(
                                aResponse()
                                        .withStatus(200)
                                        .withHeader('Content-Type', 'application/json')
                                        .withBody("{\"status\":\"UP\"}")))
    }

}