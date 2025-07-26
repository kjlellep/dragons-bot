function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomString(prefix = 'id_') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

module.exports = { sleep, randomString };
