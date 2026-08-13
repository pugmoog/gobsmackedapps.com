const apps = [
    {
        id: "6794019754",
        title: "More-House",
        description: "An educational home-buying planning and financial estimate tool.",
        image: "more-house.png",
        page: "./more-house/index.html",
        appStoreLink: "https://apps.apple.com/app/id6794019754",
        fallbackStatus: "COMING SOON"
    },
    {
        id: "6794058831",
        title: "Red-Handed",
        description: "A truth detector app that you can use to play tricks on your kids.",
        image: "red-handed.png",
        appStoreLink: "https://apps.apple.com/app/id6794058831",
        fallbackStatus: "GET"
    },
    {
        id: "6800377075",
        title: "MPRV",
        description: "An app designed to bring people together.",
        image: "mprv.png",
        appStoreLink: "https://apps.apple.com/app/id6800377075",
        fallbackStatus: "COMING SOON"
    },
    {
        id: "6794328086",
        title: "Eye on the Sky",
        description: "An aircraft identification app using publicly available flight data.",
        image: "eye-on-the-sky.png",
        appStoreLink: "https://apps.apple.com/app/id6794328086",
        fallbackStatus: "COMING SOON"
    },
    {
        id: "6798717648",
        title: "Recipe Hog",
        description: "An app to save, organize, and share all your favorite recipes.",
        image: "recipe-hog.png",
        appStoreLink: "https://apps.apple.com/app/id6798717648",
        fallbackStatus: "COMING SOON"
    }
];

const container = document.getElementById("apps-grid");

if (container) {
    container.innerHTML = apps.map(app => {
        const href = app.page || app.appStoreLink;
        const externalAttributes = app.page ? "" : ' target="_blank" rel="noopener noreferrer"';

        return `
            <a class="app-store-item" href="${href}"${externalAttributes} aria-label="Learn more about ${app.title}">
                <img src="${`../app-icons/${app.image}`}" class="app-icon" alt="${app.title} app icon">
                <div class="app-info">
                    <div class="app-name">${app.title}</div>
                    <div class="app-description">${app.description}</div>
                </div>
                <span class="app-card-arrow" aria-hidden="true">→</span>
            </a>
        `;
    }).join("");
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

updateAppDetailStatus();
