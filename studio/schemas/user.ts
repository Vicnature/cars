export default {
  name: "user",
  title: "User",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Full Name",
      type: "string",
      validation: Rule => Rule.required(),
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: Rule => Rule.required().email(),
    },
    {
      name: "password",
      title: "Password (hashed)",
      type: "string",
      hidden: true, // hide from Studio UI
    },
    {
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: ["admin", "customer"],
        layout: "dropdown"
      },
      initialValue: "customer",
      validation: Rule => Rule.required()
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true
    }
  ]
};
