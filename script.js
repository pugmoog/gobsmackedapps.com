const categoryOrder = [
    "Simplify Hard Questions",
    "Make Data Usable",
    "Bring People Together"
];

const categoryDescriptions = {
    "Simplify Hard Questions": "We transform complicated topics into clear, intuitive experiences that anyone can understand. Valuable information shouldn’t require specialized knowledge to be useful.",
    "Make Data Usable": "We turn data from APIs, calculations, and users into clear, actionable information. Data has the greatest value when it is easy to read and understand.",
    "Bring People Together": "We create experiences that encourage conversation, connection, and shared moments—whether they solve a serious problem or simply spark laughter."
};

function localLogoUrl(logo) {
    try {
        const url = new URL(logo, window.location.href);
        if (url.hostname === "gobsmackedapps.com" || url.hostname === "www.gobsmackedapps.com") {
            return `..${url.pathname}`;
        }
    } catch (error) {
        console.warn("Could not resolve app logo URL.", error);
    }
    return logo;
}

function createAppCard(app) {
    const card = document.createElement("a");
    card.className = "app-store-item";
    card.href = app.link;
    card.setAttribute("aria-label", `Learn more about ${app.title}`);

    const icon = document.createElement("img");
    icon.src = localLogoUrl(app.logo);
    icon.className = "app-icon";
    icon.alt = `${app.title} app icon`;

    const info = document.createElement("div");
    info.className = "app-info";

    const name = document.createElement("div");
    name.className = "app-name";
    name.textContent = app.title;

    const description = document.createElement("div");
    description.className = "app-description";
    description.textContent = app.description;

    const arrow = document.createElement("span");
    arrow.className = "app-card-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";

    info.append(name, description);
    card.append(icon, info, arrow);
    return card;
}

function renderAppCatalog(apps) {
    const container = document.getElementById("apps-grid");
    if (!container) return;

    container.replaceChildren();

    categoryOrder.forEach((category, index) => {
        const categoryApps = apps.filter(app => app.category === category);
        if (!categoryApps.length) return;

        const section = document.createElement("section");
        section.className = "app-category";
        section.setAttribute("aria-labelledby", `app-category-${index}`);

        const header = document.createElement("div");
        header.className = "app-category-heading";

        const heading = document.createElement("h3");
        heading.id = `app-category-${index}`;
        heading.className = "app-category-title";
        heading.textContent = category;

        const description = document.createElement("p");
        description.className = "app-category-description";
        description.textContent = categoryDescriptions[category];

        const grid = document.createElement("div");
        grid.className = "apps-grid";
        categoryApps.forEach(app => grid.append(createAppCard(app)));

        header.append(heading, description);
        section.append(header, grid);
        container.append(section);
    });
}

async function loadAppCatalog() {
    const container = document.getElementById("apps-grid");
    if (!container) return;

    try {
        const response = await fetch("../api/about.json", { cache: "no-store" });
        if (!response.ok) throw new Error("App catalog request failed");

        const catalog = await response.json();
        if (!Array.isArray(catalog.apps)) throw new Error("App catalog is missing its apps array");
        renderAppCatalog(catalog.apps);
    } catch (error) {
        console.warn("Could not load the app catalog.", error);
        const message = document.createElement("p");
        message.className = "catalog-error";
        message.textContent = "The app collection could not be loaded. Please refresh the page to try again.";
        container.replaceChildren(message);
    }
}

function appStoreStatus(result) {
    if (!result) return { label: "COMING SOON", available: false };

    const isFree = Number(result.price) === 0 || result.formattedPrice === "Free";
    return {
        label: isFree ? "GET" : (result.formattedPrice || "GET"),
        available: true
    };
}

async function updateAppDetailStatus() {
    const action = document.querySelector("[data-app-detail-id]");
    if (!action) return;

    const id = action.dataset.appDetailId;

    try {
        const response = await fetch(`https://itunes.apple.com/lookup?country=us&id=${id}`, {
            cache: "no-store"
        });

        if (!response.ok) throw new Error("App Store lookup failed");

        const data = await response.json();
        const result = (data.results || []).find(item => String(item.trackId) === id);
        const status = appStoreStatus(result);

        action.textContent = status.label;
        action.classList.toggle("is-available", status.available);
        action.setAttribute("aria-label", status.available ? `Get this app for ${status.label}` : "This app is coming soon");
    } catch (error) {
        console.warn("Could not update App Store availability.", error);
    }
}

loadAppCatalog();
updateAppDetailStatus();
