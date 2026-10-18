const scrollProgress = document.getElementById('scrollProgress');
const navigation = document.querySelector('.nav');
const menuButton = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

const updateScrollState = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

    if (scrollProgress) scrollProgress.style.width = `${progress * 100}%`;
    if (navigation) navigation.classList.toggle('scrolled', window.scrollY > 24);
};

updateScrollState();
window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', updateScrollState, { passive: true });

const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('revealed'));
}

const closeMenu = () => {
    menuButton?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
    menuButton?.setAttribute('aria-expanded', 'false');
};

menuButton?.addEventListener('click', () => {
    const isOpen = !mobileMenu?.classList.contains('open');
    menuButton.classList.toggle('open', isOpen);
    mobileMenu?.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    menuButton.setAttribute('aria-expanded', String(isOpen));
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
});

document.querySelectorAll('.project').forEach((project) => {
    project.addEventListener('pointermove', (event) => {
        const bounds = project.getBoundingClientRect();
        project.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
        project.style.setProperty('--my', `${event.clientY - bounds.top}px`);
    });
});
