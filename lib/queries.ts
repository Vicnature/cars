/** @format */

export const sparePartsQuery = (filters = {}) => {
	const { title, category, model, priceMin, priceMax } = filters;
	let query = `*[_type == "sparePart"`;

	if (category) query += ` && category->name == "${category}"`;
	if (model) query += ` && model->name == "${model}"`;
	if (priceMin) query += ` && price >= ${priceMin}`;
	if (priceMax) query += ` && price <= ${priceMax}`;
	if (title) query += ` && title match "*${title}*"`;

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
