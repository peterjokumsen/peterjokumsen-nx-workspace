param location string
param branch string
param staticWebAppName string
param tags object
@secure()
param repositoryToken string
param appInsightsId string
@secure()
param appInsightsInstrumentationKey string
@secure()
param appInsightsConnectionString string

var tagsWithHiddenLinks = union({
  'hidden-link: /app-insights-resource-id': appInsightsId
  'hidden-link: /app-insights-instrumentation-key': appInsightsInstrumentationKey
  'hidden-link: /app-insights-conn-string': appInsightsConnectionString
}, tags)

resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: staticWebAppName
  location: location
  tags: tagsWithHiddenLinks
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: 'https://github.com/peterjokumsen/peterjokumsen-nx-workspace'
    repositoryToken: repositoryToken
    branch: branch
    provider: 'GitHub'
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    buildProperties:{
      skipGithubActionWorkflowGeneration: true
    }
  }
}

resource staticWebAppAppSettings 'Microsoft.Web/staticSites/config@2022-09-01' = {
  name: 'appsettings'
  kind: 'config'
  parent: staticWebApp
  properties: {
    APPINSIGHTS_INSTRUMENTATIONKEY: appInsightsInstrumentationKey
    APPLICATIONINSIGHTS_CONNECTION_STRING: appInsightsConnectionString
  }
}

/* custom domain, to be implemented later
resource rootCustomDomain 'Microsoft.Web/staticSites/customDomains@2022-09-01' = {
  parent: staticWebApp
  name: rootCustomDomainName
  properties: {}
}

resource blogCustomDomain 'Microsoft.Web/staticSites/customDomains@2022-09-01' = {
  parent: staticWebApp
  name: blogCustomDomainName
  properties: {}
}
*/

output id string = staticWebApp.id
output name string = staticWebApp.name
output defaultHostName string = staticWebApp.properties.defaultHostname // eg gentle-bush-0db02ce03.azurestaticapps.net
