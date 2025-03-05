// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

import type { Rspack } from '@rsbuild/core'

import { getIp } from '../../utils/getIp.js'

const __filename = fileURLToPath(import.meta.url)
const require = createRequire(__filename)

export function toRsbuildLazyCompilation(
  options: boolean | Omit<Rspack.LazyCompilationOptions, 'backend'> | undefined,
  hostname: string | undefined,
):
  | boolean
  | Rspack.LazyCompilationOptions
{
  if (!options) return false

  const defaultOptions: Rspack.LazyCompilationOptions = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    test: module => {
      const HMRModules = [
        '@rspack/core/hot/dev-server.js',
        'webpack-dev-transport/lib/client/index.js',
      ]

      const isHMRImports = HMRModules.some(m =>
        module?.nameForCondition()?.endsWith(m)
      )

      const isBackground = module?.layer === 'react:background'

      return isBackground && !isHMRImports
    },
    backend: {
      client: require.resolve(
        '../../../hot/lazy-compilation-fetch.js',
      ),
      listen: {
        host: hostname ?? getIp(),
      },
    },
  }

  if (options === true) return defaultOptions

  return {
    ...options,
    ...defaultOptions,
  }
}
