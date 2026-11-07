/** Shared request, latest-input wins, dismissal invalidates callbacks, failures retry. */
export function createSearch(load, present, failed) {
  let cached, pending, generation = 0;
  function index() {
    if (cached) return Promise.resolve(cached);
    if (!pending) pending = Promise.resolve().then(load).then((items) => {
      if (!Array.isArray(items)) throw new Error('Invalid search index');
      cached = items;
      return items;
    }).finally(() => { pending = undefined; });
    return pending;
  }
  return {
    dismiss() { generation++; present([], ''); },
    async update(query) {
      const token = ++generation;
      query = query.trim().toLowerCase();
      present([], '');
      if (!query) return;
      try {
        const items = await index();
        if (token === generation) present(rank(items, query), query);
      } catch (error) { if (token === generation) failed(error); }
    },
  };
}
export function rank(items, query) {
  return items.map((item) => {
    const title = item.title.toLowerCase();
    const score = title === query ? 100 : title.startsWith(query) ? 80 : title.includes(query) ? 60
      : item.tags.some((t) => t.toLowerCase().includes(query)) ? 40 : item.summary.toLowerCase().includes(query) ? 20 : 0;
    return { item, score };
  }).filter(({ score }) => score).sort((a, b) => b.score - a.score).slice(0, 8).map(({ item }) => item);
}
