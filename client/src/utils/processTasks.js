/**
 *
 * @param  {...Function} tasks
 */

export default function processTasks(...tasks) {
  let isRunning = false;
  let i = 0;
  const results = [];
  let prom = null;
  return {
    async start() {
      return new Promise(async (resolve, reject) => {
        if (prom) {
          prom.then(resolve, reject);
        }
        if (isRunning) {
          return;
        }
        isRunning = true;
        while (i < tasks.length) {
          try {
            results.push(await tasks[i]());
          } catch (err) {
            reject(err);
            prom = Promise.reject(err);
            return;
          }
          i++;
          if (!isRunning && i < tasks.length - 1) {
            isRunning = false;
            return;
          }
        }
        isRunning = false;
        resolve(results);
        prom = Promise.resolve(results);
      });
    },
    pause() {
      isRunning = false;
    },
  };
}
