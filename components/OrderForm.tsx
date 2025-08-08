/** @format */

"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { writeClient } from "@/lib/sanity.write";
import { sanityClient } from "@/lib/sanity.client";
import { useSession } from "next-auth/react";

interface OrderFormProps {
  partId: string;
  partTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const OrderForm = ({ partId, partTitle, isOpen, onClose }: OrderFormProps) => {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    quantity: 1,
    paymentToken: ""
  });

  const [paymentSteps, setPaymentSteps] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (session?.user) {
      setForm(prev => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || ""
      }));
    }
  }, [session]);

  useEffect(() => {
    sanityClient
      .fetch('*[_type=="paymentInstructions"][0].instructions')
      .then(setPaymentSteps)
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      await writeClient.create({
        _type: "order",
        part: { _type: "reference", _ref: partId },
        customerName: form.name,
        contact: form.email || form.phone,
        email: form.email,
        phone: form.phone,
        quantity: form.quantity,
        location: form.address,
        status: "processing",
        paymentStatus: "pending",
        paymentToken: form.paymentToken,
        createdAt: new Date().toISOString()
      });
      setSuccessMessage("Order submitted! Please await dispatch.");
      setForm({
        name: session?.user?.name || "",
        phone: "",
        email: session?.user?.email || "",
        address: "",
        quantity: 1,
        paymentToken: ""
      });
    } catch {
      setSuccessMessage("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto flex justify-center p-4 text-center">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl text-left max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-xl font-bold text-gray-800">
                  Place Order – <span className="text-primary-blue">{partTitle}</span>
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-800 text-xl"
                >
                  ✕
                </button>
              </div>

              {successMessage ? (
                <div className="text-green-600 font-medium">{successMessage}</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        min={1}
                        required
                        className="mt-1 w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Shipping Location</label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Payment Token</label>
                      <input
                        type="text"
                        name="paymentToken"
                        value={form.paymentToken}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  {paymentSteps?.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded border text-sm text-gray-700 space-y-2">
                      <div className="mb-2 font-semibold text-gray-800">
                        Payment Instructions
                      </div>
                      <ol className="list-decimal list-inside space-y-1">
                        {paymentSteps.map((blk, i) => (
                          <li key={i}>{blk.children?.[0]?.text}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-blue text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Order"}
                    </button>
                  </div>
                </form>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OrderForm;
