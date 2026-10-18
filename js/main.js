document.addEventListener('DOMContentLoaded', () => {

    /* ===== 0. PRELOADER ===== */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => preloader.classList.add('hidden'), 400);
    });
    setTimeout(() => preloader.classList.add('hidden'), 3500);

    /* ===== 1. THREE-DIMENSIONAL BACKGROUND ===== */
    const canvas = document.getElementById('bg');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060a, 0.035);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 9;

    const mouse = { x: 0, y: 0 };

    // Create floating, glowing particles.
    const particlesGeo = new THREE.BufferGeometry();
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const palette = [
        [0.43, 0.91, 1.0],   // Cyan
        [0.65, 0.55, 0.98],  // Violet
        [0.96, 0.45, 0.71],  // Pink
        [1.0, 1.0, 1.0],     // White
    ];

    for (let i = 0; i < count; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
        sizes[i] = Math.random() * 1.6 + 0.3;
        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3]     = c[0];
        colors[i * 3 + 1] = c[1];
        colors[i * 3 + 2] = c[2];
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.09,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particlesGeo, particleMat);
    scene.add(particles);

    // Create torus rings.
    const rings = [];
    const ringConfigs = [
        { color: 0x6ee7ff, radius: 3.4, tube: 0.018, pos: [2.2, 1.1, -4] },
        { color: 0xa78bfa, radius: 2.4, tube: 0.014, pos: [-2.6, -1.3, -5] },
        { color: 0xf472b6, radius: 1.7, tube: 0.01,  pos: [1.4, -2.2, -3] },
    ];

    ringConfigs.forEach((cfg) => {
        const geo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100);
        const mat = new THREE.MeshBasicMaterial({
            color: cfg.color,
            transparent: true,
            opacity: 0.35,
            wireframe: true,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...cfg.pos);
        scene.add(mesh);
        rings.push(mesh);
    });

    // Create the central wireframe icosahedron.
    const icoGeo = new THREE.IcosahedronGeometry(1.15, 1);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0x6ee7ff,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(-3.4, 1.8, -6);
    scene.add(ico);

    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    const clock = new THREE.Clock();

    function animate() {
        const t = clock.getElapsedTime();
        particles.rotation.y = t * 0.03;
        particles.rotation.x = Math.sin(t * 0.05) * 0.08;

        rings.forEach((ring, i) => {
            ring.rotation.x = t * (0.12 + i * 0.04);
            ring.rotation.y = t * (0.16 + i * 0.05);
            ring.position.y += Math.sin(t * 0.6 + i * 2) * 0.002;
        });

        ico.rotation.x = t * 0.2;
        ico.rotation.y = t * 0.3;
        ico.position.y = 1.8 + Math.sin(t * 0.8) * 0.25;

        camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
        camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ===== 2. TYPING TEXT ===== */
    const phrases = [
        'Backend-разработчик',
        'C++ / Python / Golang',
        'Создатель 3D-движка на OpenGL',
        'Студент «Программной инженерии»',
    ];
    const typedEl = document.getElementById('typed');
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
        const current = phrases[phraseIndex];
        if (!deleting) {
            typedEl.textContent = current.slice(0, ++charIndex);
            if (charIndex === current.length) {
                deleting = true;
                setTimeout(typeLoop, 2200);
                return;
            }
            setTimeout(typeLoop, 55 + Math.random() * 50);
        } else {
            typedEl.textContent = current.slice(0, --charIndex);
            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
            setTimeout(typeLoop, 30);
        }
    }
    typeLoop();

    /* ===== 3. REVEAL ANIMATIONS ===== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

    /* ===== 4. SCROLL NAVIGATION AND PROGRESS ===== */
    const nav = document.querySelector('.nav');
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);

        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }, { passive: true });

    /* ===== 4.1 MOBILE MENU ===== */
    const burger = document.getElementById('navBurger');
    const mobileMenu = document.getElementById('mobileMenu');
    let menuOpen = false;

    function toggleMenu(open) {
        menuOpen = open;
        burger.classList.toggle('open', open);
        mobileMenu.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }

    burger.addEventListener('click', () => toggleMenu(!menuOpen));
    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    /* ===== 4.2 COUNTERS ===== */
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.dataset.count;
            const duration = 1400;
            const start = performance.now();
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased);
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            countObserver.unobserve(el);
        });
    }, { threshold: 0.6 });
    document.querySelectorAll('.count').forEach((el) => countObserver.observe(el));

    /* ===== 4.3 MAGNETIC BUTTONS ===== */
    document.querySelectorAll('.btn').forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${relX * 0.18}px, ${relY * 0.22}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    /* ===== 4.4 LIVE TERMINAL ===== */
    const termLines = [
        { prompt: '$', cmd: 'whoami', out: '→ Осман Нури Муспаев · C++ / Backend Developer' },
        { prompt: '$', cmd: 'cat focus.txt', out: '→ backend · алгоритмы · низкоуровневая графика' },
        { prompt: '$', cmd: 'ls ./projects/', out: '→ moodle-like / crypto-ai / minecraft-clone' },
        { prompt: '$', cmd: './dream --plan', out: '→ building my own startup...', blink: true },
    ];

    const terminalBody = document.querySelector('.terminal-body');

    function buildTerminal() {
        terminalBody.innerHTML = '';
        let delay = 400;
        termLines.forEach((line, i) => {
            const p = document.createElement('p');
            const prompt = document.createElement('span');
            prompt.className = 't-prompt';
            prompt.textContent = '$';
            const cmd = document.createElement('span');
            cmd.className = 't-cmd';
            const out = document.createElement('p');
            out.className = 't-out';
            out.style.opacity = '0';
            if (line.blink) out.classList.add('t-blink');
            out.textContent = line.out;
            p.appendChild(prompt);
            p.appendChild(document.createTextNode(' '));
            p.appendChild(cmd);
            terminalBody.appendChild(p);
            terminalBody.appendChild(out);
            typeCommand(cmd, line.cmd, delay, out);
            delay += line.cmd.length * 28 + 500;
        });
    }

    function typeCommand(el, text, delay, out) {
        setTimeout(() => {
            let i = 0;
            function tick() {
                el.textContent = text.slice(0, ++i);
                if (i <= text.length) setTimeout(tick, 40 + Math.random() * 50);
                else out.style.opacity = '1';
            }
            tick();
        }, delay);
    }

    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                buildTerminal();
                terminalObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    if (terminalBody) terminalObserver.observe(terminalBody);

    /* ===== 5. CUSTOM CURSOR ===== */
    const cursor = document.getElementById('cursor');
    const cursorGlow = document.getElementById('cursorGlow');
    const prefersMouse = window.matchMedia('(hover: hover)').matches;

    if (prefersMouse) {
        let pos = { x: 0, y: 0 };
        let glowPos = { x: 0, y: 0 };

        window.addEventListener('mousemove', (e) => {
            pos.x = e.clientX;
            pos.y = e.clientY;
            cursor.style.left = pos.x + 'px';
            cursor.style.top = pos.y + 'px';
        });

        (function glowLoop() {
            glowPos.x += (pos.x - glowPos.x) * 0.12;
            glowPos.y += (pos.y - glowPos.y) * 0.12;
            cursorGlow.style.left = glowPos.x + 'px';
            cursorGlow.style.top = glowPos.y + 'px';
            requestAnimationFrame(glowLoop);
        })();

        document.querySelectorAll('a, .btn, .project, .skill-card, .hobby-card, .fact').forEach((el) => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    /* ===== 6. PHOTO 3D TILT ===== */
    const photoFrame = document.querySelector('.hero-photo-frame');
    if (photoFrame) {
        const MAX = 14;
        photoFrame.addEventListener('mousemove', (e) => {
            const rect = photoFrame.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            photoFrame.style.transform =
                `rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg) scale(1.02)`;
        });
        photoFrame.addEventListener('mouseleave', () => {
            photoFrame.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
        });
    }

    /* ===== 7. PROJECT CARD HOVER GLOW ===== */
    document.querySelectorAll('.project').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
            card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
        });
    });
});
