import DodoPayments from "dodopayments";

let client = null;

if (process.env.DODO_PAYMENTS_API_KEY) {
  client = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment: "test_mode",
  });
}

export { client };