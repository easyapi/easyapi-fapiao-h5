export function triggerDownload(url) {
  const link = document.createElement('a')
  link.href = url
  link.download = getFileName(url)
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    document.body.removeChild(link)
  }, 100)
}

function getFileName(url) {
  const path = url.split('/').pop()
  return path.includes('?') ? path.split('?')[0] : path
}
