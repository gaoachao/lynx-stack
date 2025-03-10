// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { log } from './log.js';
import { LynxTransportClient } from './transport.js';
import type { Client, ClientClass } from './transport.js';

declare const __webpack_dev_server_client__:
  | { default: ClientClass }
  | ClientClass
  | undefined;

// this LynxTransportClient is here as a default fallback, in case the client is not injected
const C: ClientClass = typeof __webpack_dev_server_client__ === 'undefined'
  ? LynxTransportClient
  : ('default' in __webpack_dev_server_client__
    ? __webpack_dev_server_client__.default
    : __webpack_dev_server_client__);

let retries = 0;
let maxRetries = 10;

// Initialized client is exported so external consumers can utilize the same instance
// It is mutable to enforce singleton
export let client: Client | null = null;

const socket = function initSocket(
  url: string,
  handlers: Record<string, (...args: unknown[]) => void>,
  reconnect?: number,
): void {
  client = new C(url);

  client.onOpen(() => {
    retries = 0;

    if (reconnect !== undefined) {
      maxRetries = reconnect;
    }
  });

  client.onClose(() => {
    if (retries === 0) {
      handlers['close']?.(void 0, void 0);
    }

    // Try to reconnect.
    client = null;

    // After 10 retries stop trying, to prevent log spam.
    if (retries < maxRetries) {
      // Exponentially increase timeout to reconnect.
      // Respectfully copied from the package `got`.
      const retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;

      retries += 1;

      log.info('Trying to reconnect...');

      setTimeout(() => {
        socket(url, handlers, reconnect);
      }, retryInMs);
    } else {
      log.error(
        'Unable to establish a connection after exceeding the maximum retry attempts.',
      );
    }
  });

  client.onMessage(
    (data: string) => {
      const message = JSON.parse(data) as {
        type: string;
        data: unknown;
        params: unknown;
      };
      handlers[message.type]?.(message.data, message.params);
    },
  );
};

export default socket;
