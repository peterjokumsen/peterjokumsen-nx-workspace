param location string
param branch string
param appName string
param tags object
param customDomain string = 'peterjokumsen.com'
param subDomain string
@secure()
param repositoryToken string

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
    domain: customDomain
    subDomain: subDomain
    repositoryToken: repositoryToken
    appInsightsId: appInsights.outputs.id
    appInsightsConnectionString: appInsights.outputs.connectionString
    appInsightsInstrumentationKey: appInsights.outputs.instrumentationKey
  }
}

output appInsightsConnectionString string = appInsights.outputs.connectionString

output staticWebAppDefaultHostName string = staticWebApp.outputs.defaultHostName // eg gentle-bush-0db02ce03.azurestaticapps.net
output staticWebAppId string = staticWebApp.outputs.id
output staticWebAppName string = staticWebApp.outputs.name
