import org.openqa.selenium.Dimension
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions

waiting {
    timeout = 2
}

environments {
    chrome {
        driver = { new ChromeDriver() }
    }

    chromeHeadless {
        driver = {
            ChromeOptions options = new ChromeOptions()
            options.addArguments('headless')
            new ChromeDriver(options)
        }
    }
}

// Default if geb.env is not set to one of 'chrome', or 'chromeHeadless'
driver = {

    System.setProperty('webdriver.chrome.driver', "./drivers/chromedriver_mac64")

    new ChromeDriver()
}


baseUrl = "http://localhost:3001/"

reportsDir = "build/geb-reports"
