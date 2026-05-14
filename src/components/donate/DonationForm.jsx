"use client";

import { Loader } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const DonationForm = ({ content }) => {
  const [donationAmount, setDonationAmount] = useState(0);
  const [currency, setCurrency] = useState("usd");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    const amountNum = parseFloat(donationAmount);

    if (!amountNum || amountNum <= 0) {
      setError(`Donation amount must be above 0 ${currency}`);
      return;
    }
    const formattedAmount = amountNum.toFixed(2);

    setError("");
    setLoading(true);
    try {
      const orderRes = await axios.post("/api/create-order", {
        amount: formattedAmount,
        currency,
      });
      const approvalUrl = orderRes.data.links.find(
        (link) => link.rel === "approve",
      ).href;
      window.location.href = approvalUrl;
    } catch (err) {
      setError("Something went wrong");
      console.error("Error initializing payment: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-[#F1EFEC]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-10 shadow-lg">
          <h2 className="font-heading text-2xl text-center">{content.title}</h2>

          <div className="flex justify-center items-center py-6">
            <select
              onChange={(e) => setCurrency(e.target.value)}
              className="focus:outline-none focus:ring-0"
            >
              <option value="usd">USD ($)</option>
              <option value="eur">Euro (€)</option>
            </select>
          </div>
          {/* Preset amounts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[10, 25, 50, 100].map((amount) => (
              <button
                onClick={() => setDonationAmount(Number(amount))}
                key={amount}
                className={`${donationAmount === amount ? "bg-yellow-100 border-yellow-400" : ""} rounded-xl border border-black/10 py-4 font-heading text-lg bg-[#FFFEFC] hover:bg-yellow-100 hover:border-yellow-400 transition`}
              >
                {currency === "eur" ? "€" : "$"}
                {amount}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="relative mb-8">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              {currency === "eur" ? "€" : "$"}
            </span>

            <input
              type="number"
              onChange={(e) => setDonationAmount(Number(e.target.value))}
              value={donationAmount <= 0 ? "" : donationAmount}
              placeholder={content.customPlaceholder}
              className="w-full rounded-xl border border-black/10 pl-8 pr-4 py-4 font-body focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {error && (
            <p className="text-red-600 text-center text-md py-4">{error}</p>
          )}
          {/* PayPal button position */}
          <button
            onClick={handlePayment}
            disabled={donationAmount <= 0 || loading}
            className={`${donationAmount <= 0 || loading ? "opacity-70 cursor-not-allowed" : ""} flex justify-center items-center w-full rounded-xl bg-yellow-500 py-4 font-heading text-black text-lg hover:bg-yellow-400 transition`}
          >
            {loading ? (
              <Loader size={32} className="animate-spin" />
            ) : (
              content.paypalButton
            )}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500 font-body">
            {content.secureNote}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DonationForm;
