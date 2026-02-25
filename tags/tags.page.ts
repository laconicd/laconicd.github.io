export default function* ({ search }: Lume.Data) {
  const tags = search.values("tags") as string[];

  for (const tag of tags) {
    yield {
      url: `/tags/${tag}/`,
      title: `Tag: ${tag}`,
      tag: tag,
    };
  }
}
