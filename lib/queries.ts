export const sparePartsQuery = (filters = {}) => {
  const { category, model, minPrice, maxPrice } = filters;
  let query = `*[_type == "sparePart"`;

  if (category) query += ` && category->name == "${category}"`;
  if (model) query += ` && model->name == "${model}"`;
  if (minPrice) query += ` && price >= ${minPrice}`;
  if (maxPrice) query += ` && price <= ${maxPrice}`;

  query += `] | order(_createdAt desc){
    _id,
    title,
    description,
    price,
    inStock,
    "brand": brand->name,
    "model": model->name,
    "category": category->name,
    "images": images[].asset->url
  }`;

  return query;
};
