import { useState } from "preact/hooks";

export interface MessageEventHandler {
  (event: MessageEvent): void;
}

export function useWorker(messageEventHandler: MessageEventHandler): Worker {
  // Create new worker once and never again
  const [worker] = useState(() => createWorker(messageEventHandler));
  return worker;
}

function createWorker(messageEventHandler: MessageEventHandler): Worker {
  const host = window.location.host;
  const worker = new Worker(
    new URL(`https://${host}/worker.js`, import.meta.url),
    {
      type: "module",
    },
  );
  worker.addEventListener("message", messageEventHandler);
  return worker;
}
