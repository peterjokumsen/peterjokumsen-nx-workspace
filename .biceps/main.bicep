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
    tags: tags
    workspaceName: 'peterjokumsen-app-insights-workspace'
    appInsightsName: 'peterjokumsen-app-insights'
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
  params: {
    subDomain: subDomainToUse
    parentDomain: customDomain
    targetResourceId: staticWebApp.outputs.id
    tags: tags
  }
}

output appInsightsConnectionString string = appInsights.outputs.connectionString

output staticWebAppDefaultHostName string = staticWebApp.outputs.defaultHostName // eg gentle-bush-0db02ce03.azurestaticapps.net
output staticWebAppId string = staticWebApp.outputs.id
output staticWebAppName string = staticWebApp.outputs.name
