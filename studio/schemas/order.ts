// schemas/order.ts
export default {
  name: "order",
  title: "Orders",
  type: "document",
  fields: [
    {
      name: "part",
      title: "Ordered Part",
      type: "reference",
      to: [{ type: "sparePart" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "customerName",
      title: "Customer Name",
      type: "string",
    },
    {
      name: "contact",
      title: "Phone or Email",
      type: "string",
      validation: (Rule) => Rule.required().error("Contact info is required"),
    },
    {
      name: "quantity",
      title: "Quantity",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.min(1).max(99),
    },
   {
  name: "location",
  title: "Location",
  type: "text",
},

    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    },
  ],
};
