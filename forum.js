function renderForum(container, currentUser = null) {
  const posts = load(STORAGE.forum);
  container.innerHTML = "";

  posts.slice().reverse().forEach(p => {
    const div = document.createElement("div");
    div.className = "post";
    div.style.color = p.color;
    div.innerHTML = `<span class="username">${p.name}</span>: ${p.text}`;
    container.appendChild(div);
  });
}

function postForum(text, user) {
  if (!text.trim()) return;

  const forum = load(STORAGE.forum);

  forum.push({
    name: user?.name || "member_unknown",
    text,
    color: user?.color || "var(--emerald)"
  });

  save(STORAGE.forum, forum);
}
