// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

/**
 * {@inheritdoc Config.server}
 * @public
 */
export interface Server {
  /**
   * Adds headers to all responses.
   *
   * @example
   *
   * ```js
   * import { defineConfig } from '@lynx-js/rspeedy'
   * export default defineConfig({
   *   server: {
   *     headers: {
   *       'Access-Control-Allow-Origin': '**',
   *     },
   *   },
   * })
   * ```
   */
  headers?: Record<string, string | string[]> | undefined

  /**
   * Specify the host that the Rspeedy Server listens to.
   */
  host?: string | undefined

  /**
   * Specify the port that the Rspeedy Server listens to.
   *
   * @remarks
   * By default, the server listens on port `3000` and automatically increments the port number when the port is occupied.
   *
   * @example
   *
   * Set the port to a custom value:
   *
   * ```js
   * import { defineConfig } from '@lynx-js/rspeedy'
   * export default defineConfig({
   *   server: {
   *     port: 3470,
   *   },
   * })
   * ```
   */
  port?: number | undefined
}
