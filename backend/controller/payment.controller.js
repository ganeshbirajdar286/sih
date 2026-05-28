import PaymentModel from "../model/Payment.model.js";
import { client } from "../config/Dodo_Payment.config.js";

export const One_Time_Payment = async (req, res) => {
  try {
    const { product_id, Email, Name, frontend_url } = req.body;

    // 1. Validate inputs
    if (!product_id || !Email || !Name || !frontend_url) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // 2. Create checkout session
    const checkout = await client.checkoutSessions.create({
      customer: { email: Email, name: Name },
      product_cart: [{ product_id, quantity: 1 }],
      billing_currency: "INR",
      return_url: `${frontend_url}/success`,
      cancel_url: `${frontend_url}/cancel`,
    });

    // 3. Validate Dodo response before touching DB
    if (!checkout?.session_id || !checkout?.checkout_url) {
      throw new Error("Invalid response from payment provider");
    }

    // 4. Upsert instead of create (prevents duplicates)
    await PaymentModel.findOneAndUpdate(
      { session_id: checkout.session_id },
      { checkout_url: checkout.checkout_url, product_id, Email, Name },
      { upsert: true, returnDocument: true },
    );

    res.status(200).json({
      success: true,
      checkout_url: checkout.checkout_url,
      session_id: checkout.session_id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const Payment_Success = async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: "Session ID required",
      });
    }

    // FIND PAYMENT
    const payment = await PaymentModel.findOne({
      session_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // PREVENT DUPLICATES
    if (payment.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        payment,
      });
    }

    // VERIFY WITH DODO
    const session = await client.checkoutSessions.retrieve(session_id);

    // VERIFY SUCCESS
    if (session.payment_status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    // UPDATE STATUS
    payment.status = "paid";

    await payment.save();

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const Payment_Cancel = async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const payment = await PaymentModel.findOneAndUpdate(
      { session_id },

      { status: "cancelled" },

      { new: true },
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment cancelled",
      payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
