export default {
  name: "order",
  title: "Orders",
  type: "document",
  fields: [
    { name: "part", type: "reference", to: [{ type: "sparePart" }], validation: Rule => Rule.required() },
    { name: "customerName", type: "string" },
    { name: "contact", type: "string", validation: Rule => Rule.required() },
    { name: "quantity", type: "number", initialValue: 1, validation: Rule => Rule.min(1).max(99) },
    { name: "location", type: "text" },
    { name: "paymentToken", title: "Payment Token", type: "string" }, // NEW
    {
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: { list: ["pending", "approved", "rejected"], layout: "radio" },
      initialValue: "pending"
    },
    {
      name: "status",
      title: "Order Status",
      type: "string",
      options: { list: ["processing", "dispatched", "cancelled"], layout: "radio" },
      initialValue: "processing"
    },
    { name: "createdAt", type: "datetime", initialValue: () => new Date().toISOString(), readOnly: true }
  ]
};
