export default {
  name: 'category',
  type: 'document',
  title: 'Part Category',
  fields: [
    { name: 'name', type: 'string', title: 'Category Name', validation: Rule => Rule.required() },
    { name: 'description', type: 'text', title: 'Description' }
  ]
}
