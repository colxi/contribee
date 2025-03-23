export const formatElapsedTime = (ms: number) => {
  if (ms < 1000) return `${ms} ms` // Less than 1 second
  if (ms < 60 * 1000) return `${(ms / 1000).toFixed(1)} sec` // Less than 1 min
  if (ms < 60 * 60 * 1000) return `${(ms / (60 * 1000)).toFixed(1)} min` // Less than 1 hr
  return `${(ms / (60 * 60 * 1000)).toFixed(1)} hr` // 1 hour or more
}
