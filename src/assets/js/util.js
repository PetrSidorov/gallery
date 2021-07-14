const uniqueID = () => {
    return '_' + Math.random().toString(36).substr(2, 9)
  }

const createBlobFromResponse = async (url) => {
    const response = await fetch(url)
    const blob = await response.blob()
    const file = new File([blob], url, {
      type: blob.type
    });
    return file
}

export {
  uniqueID,
  createBlobFromResponse
} 