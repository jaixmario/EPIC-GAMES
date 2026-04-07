async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

function formatUpdatedAt(value) {
  if (!value) return "Unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function createGameCard(game, options = {}) {
  const card = document.createElement("article");
  card.className = "game-card";
  card.style.animationDelay = `${options.delay || 0}ms`;

  const image = game.image
    ? `<img src="${game.image}" alt="${game.title}">`
    : "";

  const tag = game.type || options.tag || "Offer";
  const details = [];

  if (game.start) details.push(`<p class="game-detail"><strong>Starts:</strong> ${game.start}</p>`);
  if (game.end) details.push(`<p class="game-detail"><strong>Ends:</strong> ${game.end}</p>`);
  if (game.time) details.push(`<p class="game-detail"><strong>Note:</strong> ${game.time}</p>`);

  card.innerHTML = `
    ${image}
    <div class="game-card-body">
      <div class="game-meta">
        <span>${tag}</span>
      </div>
      <h4>${game.title || "Unknown title"}</h4>
      ${details.join("")}
      <div class="game-actions">
        ${game.link ? `<a class="text-link" href="${game.link}" target="_blank" rel="noreferrer">Open Offer</a>` : ""}
      </div>
    </div>
  `;

  return card;
}

function renderList(containerId, games, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  if (!games || games.length === 0) {
    container.innerHTML = `<p class="empty-state">${options.emptyText || "No offers found."}</p>`;
    return;
  }

  games.forEach((game, index) => {
    container.appendChild(createGameCard(game, { ...options, delay: index * 70 }));
  });
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

async function boot() {
  try {
    const [epic, steam] = await Promise.all([
      loadJson("free.json"),
      loadJson("free-steam.json"),
    ]);

    const epicCurrent = epic.current_games || [];
    const epicUpcoming = epic.upcoming_games || [];
    const steamGames = steam.games || [];

    setText("epic-current-count", String(epicCurrent.length));
    setText("epic-upcoming-count", String(epicUpcoming.length));
    setText("steam-count", String(steamGames.length));
    setText("epic-updated-at", formatUpdatedAt(epic.updated_at));
    setText("steam-updated-at", formatUpdatedAt(steam.updated_at));

    renderList("epic-current-list", epicCurrent, {
      tag: "Free Now",
      emptyText: "No Epic current offers available.",
    });
    renderList("epic-upcoming-list", epicUpcoming, {
      tag: "Upcoming",
      emptyText: "No Epic upcoming offers available.",
    });
    renderList("steam-list", steamGames, {
      emptyText: "No Steam offers available.",
    });
  } catch (error) {
    console.error(error);
    renderList("epic-current-list", [], { emptyText: "Could not load Epic current offers." });
    renderList("epic-upcoming-list", [], { emptyText: "Could not load Epic upcoming offers." });
    renderList("steam-list", [], { emptyText: "Could not load Steam offers." });
    setText("epic-updated-at", "Load failed");
    setText("steam-updated-at", "Load failed");
  }
}

boot();
