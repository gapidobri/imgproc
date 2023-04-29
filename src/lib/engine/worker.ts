type WorkerFn<T> = (data: any) => T;

export function registerWorker<T>(func: WorkerFn<T>) {
  self.onmessage = (e: MessageEvent<T>) => {
    const result = func(e.data);
    self.postMessage(result);
  };
}
