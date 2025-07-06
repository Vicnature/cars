"use client";

import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { writeClient } from "@/lib/sanity.write";

interface OrderFormProps {
  partId: string;
  partTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const OrderForm = ({ partId, partTitle, isOpen, onClose }: OrderFormProps) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    quantity: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
  contact: form.phone || form.email,
  location: form.address,
  quantity: form.quantity,
});


      setSuccessMessage(
        "Thank you! Your order has been submitted. A Carhub representative will contact you to arrange delivery."
      );
      setForm({ name: "", email: "", phone: "", address: "", quantity: 1 });
    } catch (err) {
      console.error("Order submission failed:", err);
      setSuccessMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all space-y-6">
                <div className="flex justify-between items-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold text-gray-800"
                  >
                    Order: {partTitle}
                  </Dialog.Title>
                  <button onClick={onClose}>
                    <Image
                      src="/close.svg"
                      alt="Close"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>

                {successMessage ? (
                  <div className="text-green-600 text-sm font-medium leading-relaxed">
                    {successMessage}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-blue focus:border-primary-blue p-2"
                        value={form.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-blue focus:border-primary-blue p-2"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-blue focus:border-primary-blue p-2"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        name="address"
                        type="text"
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-blue focus:border-primary-blue p-2"
                        value={form.address}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        min={1}
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-blue focus:border-primary-blue p-2"
                        value={form.quantity}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-primary-blue text-white font-semibold py-3 rounded-md transition ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                        }`}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Order"}
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OrderForm;
