@description('Sub domain to use for the DNS zone.  The zone name will be a concatenation of this value and the parent domain.  For example, if the parent domain is peterjokumsen.com and the zone name is "test", the full zone name will be "test.peterjokumsen.com".')
param subDomain string

@description('The name of the parent domain to use for the DNS zone.  The zone name will be a concatenation of this value and the sub domain.  For example, if the sub domain is "test" and the parent domain is peterjokumsen.com, the full zone name will be "test.peterjokumsen.com". Default is "peterjokumsen.com".')
param parentDomain string = 'peterjokumsen.com'

@description('The resource ID of the target resource for the DNS record.  This can be a resource of any type that has a public IP address.')
param targetResourceId string

resource zone 'Microsoft.Network/dnsZones@2023-07-01-preview' existing = {
  name: parentDomain
}

resource record 'Microsoft.Network/dnsZones/A@2018-05-01' = {
  parent: zone
  name: subDomain
  properties: {
    TTL: 3600
    targetResource: {
      id: targetResourceId
    }
  }
}

output recordName string = record.name
output zoneName string = zone.name
