document.addEventListener('DOMContentLoaded', function() {
  const screensEl = document.querySelector('.screens');
  let scrollPos = 0;
  const speed = 1; // pixels per frame

  function scroll() {
    scrollPos += speed;
    
    const maxScroll = screensEl.scrollWidth / 2;
    if (scrollPos >= maxScroll) {
      scrollPos = 0;
    }
    
    screensEl.style.transform = `translateX(-${scrollPos}px)`;
    requestAnimationFrame(scroll);
  }

  scroll();
});

const apps = [
    {
        title: "Lorem Ipsum",
        description: "Lorem ipsum dolor sit amet",
        image: "placeholder-icon.png",
        link: "https://apple.com",
        price: "GET",
        platforms: ["iphone", "ipad", "mac"]
    },
    {
        title: "Lorem Ipsum",
        description: "Lorem ipsum dolor sit amet",
        image: "placeholder-icon.png",
        link: "https://apple.com",
        price: "$0.99",
        platforms: ["iphone", "watch"]
    },
    {
        title: "Lorem Ipsum",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "placeholder-icon.png",
        link: "https://apple.com",
        price: "$2.99",
        platforms: ["mac"]
    },
];

const platformIcons = {
    iphone: "platform-icons/iphone.png",
    ipad: "platform-icons/ipad.png",
    mac: "platform-icons/macbook.png",
    watch: "platform-icons/applewatch.png"
};

const container = document.getElementById("apps-grid");

container.innerHTML = apps.map(app => `
    <a href="${app.link}" class="app-store-item">
        <img src="${"app-icons/"+app.image}" class="app-icon" alt="${app.title}">
        
        <div class="app-info">
            <div class="app-name">${app.title}<span class="platforms">
                        ${(app.platforms || [])
                                                .map(p => `<img class="platform-icon" src="${platformIcons[p]}"></img>`)
                                                .join("")}</span></div>
            <div class="app-description">${app.description ?? ""}</div>
        </div>

        <div class="app-get">${app.price ?? "GET"}</div>
    </a>
`).join("");
