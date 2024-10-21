targetScope 'subscription'

@description('Location of the resources')
param location string
@description('Name of the app')
param appName string
@description('Custom domain to use, defaults to "peterjokumsen.com"')
param customDomain string = 'peterjokumsen.com'
@description('Subdomain to use, defaults to "{appName}"')
param subDomain string = ''

var resourceGroupName = '${appName}-swa-rg'

resource newRg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
  tags: {
    app: appName
    domain: '${subDomainToUse}.${customDomain}'
  }
}

module allSwaResources './_swa-rg.bicep' = {
  name: '${deployment().name}-swaResources'
  scope: newRg
  params: {
    location: location
    branch: 'main'
    appName: appName
    customDomain: customDomain
    subDomain: subDomain
  }
}
