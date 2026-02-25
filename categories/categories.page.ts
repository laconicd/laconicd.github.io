export default function* ({ search }: Lume.Data) {
  const categories = search.values("category") as string[];

  for (const category of categories) {
    yield {
      url: `/categories/${category.toLowerCase()}/`,
      title: `Category: ${category}`,
      category: category,
    };
  }
}
