export default {
  name: 'brand',
  type: 'document',
  title: 'Car Brand',
  fields: [
    { name: 'name', type: 'string', title: 'Brand Name', validation: Rule => Rule.required().min(2) },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'name', maxLength: 96 }, validation: Rule => Rule.required() }
  ]
}
