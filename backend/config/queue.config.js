import {Queue} from "bullmq"

import IORedis from "ioredis";

const connection = new IORedis(
  process.env.REDIS_URL,
  { maxRetriesPerRequest: null },
  {
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: 100,
    },
  }
);

export default connection;

export const EmailQueue= new Queue('Appoinment-Booking-emails',{connection})


