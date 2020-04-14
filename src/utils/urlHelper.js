export const createAvatarUrl = userId => {
  let constructedUrl = `${window.location.origin}/api/users/${userId}/avatar`
  return constructedUrl
}

export default createAvatarUrl