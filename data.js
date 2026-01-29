const STORAGE = {
  forum: "magitech_forum",
  mail: "magitech_mail",
  logs: "magitech_logs"
};

function load(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
