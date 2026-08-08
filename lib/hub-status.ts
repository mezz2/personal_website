export function blogStatusLabel(postCount: number): string {
  if (postCount <= 0) return "Nothing published yet";
  return postCount === 1 ? "1 post" : `${postCount} posts`;
}

export function booksStatusLabel(count: number): string {
  return `${count} on the shelf`;
}

export function projectsCapacityLabel(liveCount: number): string {
  const labs = liveCount === 1 ? "lab" : "labs";
  return `${liveCount} ${labs} live · more in the works`;
}
