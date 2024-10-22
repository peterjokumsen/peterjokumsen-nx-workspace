@description('Location of the resources')
param location string
@description('Branch deployed from')
param branch string
@description('Name of the app')
param appName string
@description('Custom domain to use, defaults to "peterjokumsen.com"')
param customDomain string = 'peterjokumsen.com'
@description('Subdomain to use, defaults to "{appName}"')
param subDomain string = ''

var subDomainToUse = subDomain == '' ? appName : subDomain
var tags = {
  app: appName
  domain: '${subDomainToUse}.${customDomain}'
}

module appInsights './_app-insights.bicep' = {
  name: '${deployment().name}-appInsights'
  params: {
    location: location
    tags: { app: 'insights' }
    workspaceName: '${appName}-insights-workspace'
    appInsightsName: '${appName}-insights'
  }
}

module staticWebApp './_static-web-app.bicep' = {
  name: '${deployment().name}-staticWebApp'
  params: {
    location: location
    branch: branch
    staticWebAppName: '${appName}-static-web-app'
    tags: tags
    appInsightsId: appInsights.outputs.id
    appInsightsConnectionString: appInsights.outputs.connectionString
    appInsightsInstrumentationKey: appInsights.outputs.instrumentationKey
  }
}

module dnsZone './_dns-zone.bicep' = {
  name: '${deployment().name}-dnsZone'
  scope: resourceGroup('peterjokumsen-dns-rg')
  params: {
    subDomain: subDomainToUse
    parentDomain: customDomain
    targetHostName: staticWebApp.outputs.defaultHostName
  }
}

resource customDomain 'Microsoft.Web/staticSites/customDomains@2022-09-01' = {
  name: '${staticWebApp.outputs.name}/${subDomainToUse}.${customDomain}'
  parent: staticWebApp
}

output appInsightsConnectionString string = appInsights.outputs.connectionString

output staticWebAppDefaultHostName string = staticWebApp.outputs.defaultHostName // eg gentle-bush-0db02ce03.azurestaticapps.net
output staticWebAppId string = staticWebApp.outputs.id
output staticWebAppName string = staticWebApp.outputs.name
