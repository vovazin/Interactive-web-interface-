document.addEventListener("DOMContentLoaded", () => {

    const mq = window.matchMedia("(max-width: 1024px)");
    let active = false;
    let whiteAnim = null;
    let imgAnim = null;
    let raf = null;

    const blocks = () => document.querySelectorAll(".block");
    const white = () => document.querySelector(".white");
    const blue = () => document.querySelector(".blue");
    const black = () => document.querySelector(".black");
    const brown = () => document.querySelector(".brown");

    function neighbors(el) {
        return [el.previousElementSibling, el.nextElementSibling]
            .filter(b => b && b.classList.contains("block"));
    }

    function wrapWhite() {
        let inner = white().querySelector(".white-inner");
        if (inner) return inner;

        white().style.overflow = "hidden";
        inner = document.createElement("div");
        inner.className = "white-inner";
        Object.assign(inner.style, {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        });

        while (white().firstChild) inner.appendChild(white().firstChild);
        white().appendChild(inner);
        return inner;
    }

    function ensureImage() {
        let img = blue().querySelector("img");
        if (!img) {
            img = document.createElement("img");
            img.src = "img.png";
            Object.assign(img.style, {
                width: "60px",
                position: "absolute",
                bottom: "10px",
                right: "10px"
            });
            blue().appendChild(img);
        }
        return img;
    }

    function init() {
        if (active) return;
        active = true;

        blocks().forEach(b => {
            b.addEventListener("mouseenter", () => {
                white().textContent = b.className;
            });
        });

        white().addEventListener("mouseenter", () => {
            const inner = wrapWhite();
            whiteAnim = inner.animate(
                [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
                { duration: 3000, iterations: Infinity }
            );
        });

        white().addEventListener("mouseleave", () => {
            if (whiteAnim) whiteAnim.cancel();
            whiteAnim = null;
        });

        let colored = [];

        blue().addEventListener("mouseenter", () => {
            colored = neighbors(blue());
            colored.forEach((b, i) => {
                b.dataset.bg = getComputedStyle(b).backgroundColor;
                b.style.backgroundColor = i === 0 ? "tomato" : "violet";
            });
        });

        blue().addEventListener("mouseleave", () => {
            colored.forEach(b => b.style.backgroundColor = b.dataset.bg);
            colored = [];
        });

        black().addEventListener("mouseenter", () => {
            const img = ensureImage();
            imgAnim = img.animate(
                [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
                { duration: 3000, iterations: Infinity }
            );
        });

        black().addEventListener("mouseleave", () => {
            if (imgAnim) imgAnim.cancel();
            imgAnim = null;
        });

        blocks().forEach(b => {
            b.addEventListener("click", e => {
                e.stopPropagation();
                if (b.classList.contains("brown")) return;

                const copy = document.createElement("div");
                copy.textContent = b.textContent;
                Object.assign(copy.style, {
                    fontSize: "14px",
                    borderBottom: "1px dashed black"
                });
                b.prepend(copy);
            });
        });

        blocks().forEach(b => {
            b.addEventListener("dblclick", e => {
                e.stopPropagation();

                b.style.transition = "opacity 0.2s ease, transform 0.2s ease";
                b.style.opacity = "0";
                b.style.transform = "scale(0.9)";

                setTimeout(() => {
                    b.remove();

                    const rest = document.querySelectorAll(".green, .blue, .black");
                    const w = 100 / rest.length;
                    let l = 0;

                    rest.forEach(el => {
                        el.style.transition = "all 0.25s ease";
                        el.style.width = w + "%";
                        el.style.left = l + "%";
                        l += w;
                    });
                }, 400);
            });
        });

        const canvas = document.createElement("canvas");
        const btn = document.createElement("button");
        btn.textContent = "Start animation";

        canvas.style.display = "none";
        canvas.style.border = "2px solid #582D09";

        brown().appendChild(canvas);
        brown().appendChild(btn);

        const ctx = canvas.getContext("2d");

        function resize() {
            canvas.width = brown().clientWidth - 20;
            canvas.height = brown().clientHeight - 20;
        }

        resize();

        function drawVOVA() {
            let x = 10;

            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + 10, 30);
            ctx.lineTo(x + 20, 0);
            ctx.stroke();
            x += 30;

            ctx.strokeStyle = "green";
            ctx.beginPath();
            ctx.arc(x + 15, 15, 15, 0, Math.PI * 2);
            ctx.stroke();
            x += 40;

            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + 10, 30);
            ctx.lineTo(x + 20, 0);
            ctx.stroke();
            x += 30;

            ctx.strokeStyle = "orange";
            ctx.beginPath();
            ctx.moveTo(x, 30);
            ctx.lineTo(x + 10, 0);
            ctx.lineTo(x + 20, 30);
            ctx.moveTo(x + 5, 18);
            ctx.lineTo(x + 15, 18);
            ctx.stroke();
        }

        let x = 10, y = 0, vy = -12;

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(x, y);
            drawVOVA();
            ctx.restore();

            y += vy;
            vy += 0.8;
            x += 0.6;

            if (y > canvas.height - 40) {
                y = canvas.height - 40;
                vy = -12;
            }

            raf = requestAnimationFrame(animate);
        }
const originalBrownHeight = brown().style.height || "5%";
let brownExpanded = false;

btn.addEventListener("click", () => {

    if (!brownExpanded) {
        brown().style.transition = "height 0.25s ease";
        brown().style.height = "20%";   
        brownExpanded = true;

        setTimeout(() => {
            resize();
            canvas.style.display = "block";
            y = canvas.height;
            vy = -12;
            animate();
        }, 260);

    } else {
        if (raf) cancelAnimationFrame(raf);
        raf = null;

        canvas.style.display = "none";
        brown().style.transition = "height 0.25s ease";
        brown().style.height = originalBrownHeight;
        brownExpanded = false;
    }
});


        window.addEventListener("resize", resize);
    }

    function destroy() {
        active = false;
        if (whiteAnim) whiteAnim.cancel();
        if (imgAnim) imgAnim.cancel();
        if (raf) cancelAnimationFrame(raf);
    }

    function check() {
        mq.matches ? init() : destroy();
    }

    mq.addEventListener("change", check);
    check();
});
