const { Worker } = require("bullmq");
const m2dprocess_jobs = require("./jobs/m2d/process");
const cadaprocess_jobs = require("./jobs/cada/process");
const m2dresultService = require("./services/m2d/result");

const redisConfiguration = {
    connection: {
        host: "127.0.0.1",
        port: "6379",
    },
};

const cadaworker = new Worker("myqueue", cadaprocess_jobs, redisConfiguration);
cadaworker.on("completed", (job) => {
  console.info(`${job.id} has completed!`);
});
cadaworker.on("failed", (job, err) => {
  console.error(`${job.id} has failed with ${err.message}`);
});

const m2dworker = new Worker("mlqueue", m2dprocess_jobs, redisConfiguration);
m2dworker.on("completed", (job) => {
    console.info(`${job.id} has completed!`);
});
m2dworker.on("failed", async (job, err) => {
    await m2dresultService.updateValues(job.id, err.message);
    console.error(`${job.id} has failed with ${err.message}`);
});

