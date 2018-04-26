const promiseRetry = require("promise-retry");
const timeout = 1000;
const iv = 100;

module.exports = (page, maxTimeout = 120000) =>
  promiseRetry(
    async (retry, number) => {
      try {
        await page.evaluate(iv => {
          return new Promise((resolve, reject) => {
            checkReadyState();

            function checkReadyState() {
              if (document.readyState === "complete") {
                resolve();
              } else {
                setTimeout(checkReadyState, iv);
              }
            }
          });
        }, iv);
      } catch (err) {
        if (
          err.message.indexOf(
            "Cannot find context with specified id undefined"
          ) !== -1
        ) {
          retry();
        } else {
          throw err;
        }
      }
    },
    {
      retries: Math.ceil(maxTimeout / timeout),
      minTimeout: timeout,
      maxTimeout: timeout
    }
  );