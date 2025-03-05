// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
async function findIp(family: 'v4' | 'v6'): Promise<string> {
  const [
    { default: defaultGateway },
    { default: ipaddr },
    os,
  ] = await Promise.all([
    import('default-gateway'),

    import('ipaddr.js'),
    import('node:os'),
  ])
  const gateway = await (async () => {
    if (family === 'v4') {
      const { gateway } = await defaultGateway.gateway4async()
      return gateway
    } else {
      const { gateway } = await defaultGateway.gateway6async()
      return gateway
    }
  })()
  const gatewayIp = ipaddr.parse(gateway)

  // Look for the matching interface in all local interfaces.
  for (const addresses of Object.values(os.networkInterfaces())) {
    if (!addresses) {
      continue
    }

    for (const { cidr, internal } of addresses) {
      if (!cidr || internal) {
        continue
      }

      const net = ipaddr.parseCIDR(cidr)

      if (
        net[0]
        && net[0].kind() === gatewayIp.kind()
        && gatewayIp.match(net)
      ) {
        return net[0].toString()
      }
    }
  }

  throw new Error(`No valid IP found for the default gateway ${gateway}`)
}

const ip = await findIp('v4')

export function getIp(): string {
  return ip
}
