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

});