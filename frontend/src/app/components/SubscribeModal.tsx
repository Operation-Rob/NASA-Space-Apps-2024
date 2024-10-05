import React from "react";
import { useState } from "react";
import { generateMagicString } from "@/utils/pinUtils";

const SubscribeModal = ({ onClose, pins }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    const data = generateMagicString(pins);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, data }),
      });

      if (response.ok) {
        setSubmitSuccess("Successfully subscribed!");
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.message || "Failed to subscribe.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSubmitError("An error occurred while subscribing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Subscribe for Updates</h2>
        <p className="mb-4 text-gray-700">
          Enter your email address to receive updates whenever new data is
          available near your pins.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {submitError && (
            <p className="text-red-500 text-sm mb-4">{submitError}</p>
          )}
          {submitSuccess && (
            <p className="text-green-500 text-sm mb-4">{submitSuccess}</p>
          )}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscribeModal;
