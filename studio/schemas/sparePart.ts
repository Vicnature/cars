export default {
  name: 'sparePart',
  type: 'document',
  title: 'Spare Part',
  fields: [
    { name: 'title', type: 'string', title: 'Title', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required() },
    { name: 'brand', type: 'reference', to: [{ type: 'brand' }], title: 'Brand' },
    { name: 'model', type: 'reference', to: [{ type: 'carModel' }], title: 'Car Model' },
    { name: 'category', type: 'reference', to: [{ type: 'category' }], title: 'Category' },
    { name: 'year', type: 'string', title: 'Year Compatibility' },
    { name: 'price', type: 'number', title: 'Price (KES)' },
    { name: 'inStock', type: 'boolean', title: 'In Stock', initialValue: true },
    { name: 'images', type: 'array', title: 'Images', of: [{ type: 'image' }] },
    { name: 'description', type: 'text', title: 'Description' }
  ]
}
