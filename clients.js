const clients = new Map()

function setClient(key, value) {
  clients.set(key, value)
}

function getClient(key) {
  return clients.get(key)
}

function removeClient(key) {
  clients.delete(key)
}

module.exports = {
  clients,
  setClient,
  getClient,
  removeClient
}