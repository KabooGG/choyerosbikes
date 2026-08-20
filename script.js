document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");
    const logo = document.querySelector(".logo");

    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("active");

        if (nav.classList.contains("active")) {
            menuToggle.textContent = "✕";
            menuToggle.setAttribute("aria-label", "Cerrar menú");
        } else {
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-label", "Abrir menú");
        }
    });

    logo.addEventListener("click", (e) => {
        e.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-label", "Abrir menú");
        });
    });

    /* SOMBRA DEL HEADER Y BOTÓN DE VOLVER ARRIBA AL HACER SCROLL */

    const header = document.querySelector("header");
    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            if (header) header.classList.add("scrolled");
        } else {
            if (header) header.classList.remove("scrolled");
        }

        if (window.scrollY > 400) {
            if (backToTop) backToTop.classList.add("visible");
        } else {
            if (backToTop) backToTop.classList.remove("visible");
        }
    });

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* CARRUSEL INFINITO DE MARCAS (animación CSS + arrastre) */

    const brandsWrapper = document.getElementById("brandsWrapper");
    const brandsTrack = document.getElementById("brandsTrack");

    if (brandsWrapper && brandsTrack) {

        const ANIM_DURATION = 65; // segundos, debe coincidir con el CSS (brandsScroll)

        let isDragging = false;
        let dragStartX = 0;
        let dragStartTranslate = 0;
        let dragMoved = 0;
        let currentTranslate = 0;

        function getHalfWidth() {
            return brandsTrack.scrollWidth / 2;
        }

        function getCurrentTranslateFromCSS() {
            const style = window.getComputedStyle(brandsTrack);
            const matrix = style.transform;
            if (!matrix || matrix === "none") return 0;
            const values = matrix.match(/matrix\(([^)]+)\)/);
            if (!values) return 0;
            const parts = values[1].split(",").map(parseFloat);
            return parts[4] || 0;
        }

        function startDrag(x) {
            isDragging = true;
            dragMoved = 0;
            dragStartX = x;
            currentTranslate = getCurrentTranslateFromCSS();
            dragStartTranslate = currentTranslate;
            brandsTrack.style.animation = "none";
            brandsTrack.style.transform = `translateX(${currentTranslate}px)`;
            brandsWrapper.classList.add("dragging");
        }

        function moveDrag(x) {
            if (!isDragging) return;
            const delta = x - dragStartX;
            dragMoved = Math.max(dragMoved, Math.abs(delta));

            const half = getHalfWidth();
            let next = dragStartTranslate + delta;

            while (next > 0) next -= half;
            while (next <= -half) next += half;

            currentTranslate = next;
            brandsTrack.style.transform = `translateX(${next}px)`;
        }

        function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            brandsWrapper.classList.remove("dragging");

            const half = getHalfWidth();
            const progress = Math.min(Math.max(-currentTranslate / half, 0), 0.999);

            brandsTrack.style.transform = "";
            brandsTrack.style.animation = "";
            brandsTrack.style.animationDelay = `-${(progress * ANIM_DURATION).toFixed(3)}s`;
        }

        brandsWrapper.addEventListener("mousedown", (e) => {
            e.preventDefault();
            startDrag(e.pageX);
        });

        window.addEventListener("mousemove", (e) => {
            moveDrag(e.pageX);
        });

        window.addEventListener("mouseup", endDrag);

        brandsWrapper.addEventListener("touchstart", (e) => {
            startDrag(e.touches[0].pageX);
        }, { passive: true });

        brandsWrapper.addEventListener("touchmove", (e) => {
            moveDrag(e.touches[0].pageX);
        }, { passive: true });

        brandsWrapper.addEventListener("touchend", endDrag);

        brandsWrapper.querySelectorAll(".brand-item").forEach(link => {
            link.addEventListener("click", (e) => {
                if (dragMoved > 8) {
                    e.preventDefault();
                }
            });
        });
    }


    /* SCROLL SUAVE */

    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (!target) return;

            const start = window.scrollY;
            const end = target.getBoundingClientRect().top + window.scrollY - 80;
            const distance = end - start;
            const duration = 450;
            let startTime = null;

            function animation(currentTime) {
                if (!startTime) startTime = currentTime;

                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                window.scrollTo(0, start + distance * eased);

                if (progress < 1) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        });
    });


    /* CARRUSEL DE RESEÑAS */

    const reviews = document.querySelectorAll(".review-slider .review");
    const dots = document.querySelectorAll(".review-dots .dot");
    const prevButton = document.querySelector(".review-prev");
    const nextButton = document.querySelector(".review-next");

    let currentReview = 0;
    let reviewTimer;

    function showReview(index) {

        reviews.forEach(review => {
            review.classList.remove("active");
        });

        dots.forEach(dot => {
            dot.classList.remove("active");
        });

        reviews[index].classList.add("active");
        dots[index].classList.add("active");

        currentReview = index;
    }

    function nextReview() {
        let next = currentReview + 1;

        if (next >= reviews.length) {
            next = 0;
        }

        showReview(next);
    }

    function previousReview() {
        let previous = currentReview - 1;

        if (previous < 0) {
            previous = reviews.length - 1;
        }

        showReview(previous);
    }

    function resetTimer() {
        clearInterval(reviewTimer);
        reviewTimer = setInterval(nextReview, 5000);
    }

    if (reviews.length > 0) {

        showReview(0);

        nextButton.addEventListener("click", () => {
            nextReview();
            resetTimer();
        });

        prevButton.addEventListener("click", () => {
            previousReview();
            resetTimer();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                showReview(index);
                resetTimer();
            });
        });

        reviewTimer = setInterval(nextReview, 5000);
    }


    /* MODAL DE DETALLE DE BICICLETA */

    const bikeIcon = `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm14 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 15l3-7h4l-2 4h3l-5 6-1-3H8Zm2-9h5"/>
    </svg>`;

    const bikeData = {
        process: {
            tag: "Montaña",
            name: "Kona Process 153",
            price: "Precio en tienda — pregunta por disponibilidad",
            description: "Full suspensión pensada para trail y enduro. Geometría moderna para dominar terreno técnico con confianza.",
            specs: ["Suspensión: 153mm trasera", "Cuadro: Aluminio", "Uso: Trail / Enduro"]
        },
        rove: {
            tag: "Gravel",
            name: "Kona Rove",
            price: "Precio en tienda — pregunta por disponibilidad",
            description: "Cuadro cromoly versátil, listo para camino, terracería y salidas de bikepacking.",
            specs: ["Cuadro: Cromoly (acero)", "Ruedas: 700c", "Uso: Gravel / Bikepacking"]
        },
        dew: {
            tag: "Urbana",
            name: "Kona Dew",
            price: "Precio en tienda — pregunta por disponibilidad",
            description: "Comodidad y practicidad para moverte todos los días por la ciudad, sin complicaciones.",
            specs: ["Cuadro: Aluminio", "Uso: Urbano / Commuter", "Frenos: Disco"]
        },
        remote: {
            tag: "Eléctrica",
            name: "Kona Remote",
            price: "Precio en tienda — pregunta por disponibilidad",
            description: "Asistencia eléctrica para subir más y disfrutar más tiempo del trail sin cansarte tan rápido.",
            specs: ["Motor: Asistencia eléctrica", "Uso: Montaña eléctrica", "Autonomía: consulta en tienda"]
        }
    };

    const bikeCards = document.querySelectorAll(".kona-card");
    const modal = document.getElementById("bikeModal");
    const modalClose = document.getElementById("modalClose");
    const modalGallery = document.getElementById("modalGallery");
    const modalTag = document.getElementById("modalTag");
    const modalName = document.getElementById("modalName");
    const modalPrice = document.getElementById("modalPrice");
    const modalDescription = document.getElementById("modalDescription");
    const modalSpecs = document.getElementById("modalSpecs");

    function openBikeModal(bikeId) {
        const bike = bikeData[bikeId];
        if (!bike || !modal) return;

        modalGallery.innerHTML = bikeIcon;
        modalTag.textContent = bike.tag;
        modalName.textContent = bike.name;
        modalPrice.textContent = bike.price;
        modalDescription.textContent = bike.description;
        modalSpecs.innerHTML = bike.specs.map(spec => `<li>${spec}</li>`).join("");

        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeBikeModal() {
        modal.classList.remove("open");
        document.body.style.overflow = "";
    }

    bikeCards.forEach(card => {
        card.addEventListener("click", () => {
            openBikeModal(card.getAttribute("data-bike"));
        });

        card.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                openBikeModal(card.getAttribute("data-bike"));
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener("click", closeBikeModal);
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeBikeModal();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeBikeModal();
        });

        const modalCTA = document.getElementById("modalCTA");
        if (modalCTA) {
            modalCTA.addEventListener("click", closeBikeModal);
        }
    }

});