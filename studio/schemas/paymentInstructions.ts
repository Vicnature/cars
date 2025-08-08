export default {
  name: "paymentInstructions",
  title: "Payment Instructions",
  type: "document",
  fields: [
    {
      name: "instructions",
      title: "Steps to Complete Payment",
      type: "array",
      of: [{ type: "block" }]
    }
  ]
};
