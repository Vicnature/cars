export default {
  name: 'carModel',
  type: 'document',
  title: 'Car Model',
  fields: [
    { name: 'name', type: 'string', title: 'Model Name', validation: Rule => Rule.required() },
    { name: 'brand', type: 'reference', to: [{ type: 'brand' }], title: 'Brand', validation: Rule => Rule.required() },
    { name: 'year', type: 'number', title: 'Year' }
  ]
}
