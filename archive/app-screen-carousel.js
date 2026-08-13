// Archived infinite mixed-app screenshot carousel.
// Restore with archive/app-screen-carousel.html and app-screen-carousel.css.
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".screens");
    const wrapper = document.querySelector(".screens-wrapper");

    if (!track || !wrapper) return;

    const screenSources = Array.from(
        { length: 7 },
        (_, index) => `../app-screens/${index + 1}.png`
    );
    const pixelsPerSecond = 45;
    const items = [...track.querySelectorAll(".phone-item")].map(element => ({
        element,
        image: element.querySelector(".app-screen"),
        x: 0
    }));

    screenSources.forEach(source => {
        const image = new Image();
        image.src = source;
    });

    function gapWidth() {
        return parseFloat(getComputedStyle(track).getPropertyValue("--screen-gap")) || 0;
    }

    function itemWidth() {
        return items[0]?.element.getBoundingClientRect().width || 350;
    }

    function fileName(source) {
        return source.split("/").pop();
    }

    function randomScreenExcept(...excludedSources) {
        const excludedFiles = new Set(excludedSources.map(fileName));
        const choices = screenSources.filter(source => !excludedFiles.has(fileName(source)));
        return choices[Math.floor(Math.random() * choices.length)];
    }

    function ensureEnoughImages() {
        const step = itemWidth() + gapWidth();
        const required = Math.ceil(wrapper.clientWidth / step) + 2;

        while (items.length < required) {
            const element = items[0].element.cloneNode(true);
            const image = element.querySelector(".app-screen");
            const rightmost = Math.max(...items.map(item => item.x));
            const rightmostItem = items.find(item => item.x === rightmost);
            const x = rightmost + step;
            image.src = randomScreenExcept(rightmostItem.image.src);
            element.style.transform = `translate3d(${x}px, 0, 0)`;
            track.appendChild(element);
            items.push({ element, image, x });
        }
    }

    function sizeTrack() {
        const height = Math.max(...items.map(item => item.element.getBoundingClientRect().height));
        if (height > 0) track.style.height = `${height}px`;
    }

    function placeItems() {
        ensureEnoughImages();
        const step = itemWidth() + gapWidth();

        items.forEach((item, index) => {
            if (index > 0 && fileName(item.image.src) === fileName(items[index - 1].image.src)) {
                item.image.src = randomScreenExcept(items[index - 1].image.src);
            }
            item.x = index * step;
            item.element.style.transform = `translate3d(${item.x}px, 0, 0)`;
        });

        sizeTrack();
    }

    let previousTime;

    function animate(time) {
        if (previousTime === undefined) previousTime = time;
        const elapsed = Math.min(time - previousTime, 64);
        const distance = pixelsPerSecond * elapsed / 1000;
        previousTime = time;

        items.forEach(item => {
            item.x -= distance;
        });

        items.forEach(item => {
            if (item.x + itemWidth() < 0) {
                const rightmost = Math.max(...items.map(other => other.x));
                const rightmostItem = items.find(other => other.x === rightmost);
                item.x = rightmost + itemWidth() + gapWidth();
                item.image.src = randomScreenExcept(rightmostItem.image.src);
            }
            item.element.style.transform = `translate3d(${item.x}px, 0, 0)`;
        });

        requestAnimationFrame(animate);
    }

    const carouselImages = [...track.querySelectorAll("img")];
    Promise.all(carouselImages.map(image => image.decode().catch(() => undefined))).then(() => {
        placeItems();
        requestAnimationFrame(animate);
    });

    window.addEventListener("resize", () => {
        ensureEnoughImages();
        sizeTrack();
    });
});
