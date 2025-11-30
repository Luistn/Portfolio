    // project links -> project modal
    // helpers for focusable elements
    function getFocusable(container) {
        return Array.from(container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
    }

    // manter modal sem linguagem
    document.querySelectorAll('.projeto-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const nomeEl = link.querySelector('.projeto-nome');
            document.getElementById('modal-titulo').textContent = (nomeEl ? nomeEl.textContent : link.textContent).trim();
            document.getElementById('modal-descricao').textContent = link.getAttribute('data-descricao') || '';
            const ml = document.getElementById('modal-linguagem');
            if (ml) { ml.textContent = ''; ml.style.display = 'none'; }
            document.getElementById('modal-link').href = link.getAttribute('data-url');
            const modal = document.getElementById('modal-projeto');
            openModal(modal, link);
        });
    });

    // efeito tilt sutil nos cards (desktop)
    (function(){
        const cards = Array.from(document.querySelectorAll('.card'));
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch) return; // evita tilt em touch
        cards.forEach(card => {
            card.style.transformStyle = 'preserve-3d';
            card.addEventListener('mousemove', (e)=>{
                const r = card.getBoundingClientRect();
                const cx = e.clientX - r.left;
                const cy = e.clientY - r.top;
                const rx = ((cy / r.height) - 0.5) * -6; // graus
                const ry = ((cx / r.width) - 0.5) * 6;
                card.style.transform = `translateY(-3px) scale(1.02) rotateX(${rx}deg) rotateY(${ry}deg)`;
            });
            card.addEventListener('mouseleave', ()=>{
                card.style.transform = '';
            });
        });
    })();

    document.querySelectorAll('#modal-projeto .close-button').forEach(btn => btn.addEventListener('click', ()=>{ closeModal(document.getElementById('modal-projeto')); }));
    document.getElementById('modal-projeto').addEventListener('click', function(e) { if(e.target === this) { closeModal(this); } });

    // CV modal handlers
    const btnOpenCV = document.getElementById('open-cv');
    const modalCV = document.getElementById('modal-cv');
    if (btnOpenCV && modalCV) {
        btnOpenCV.addEventListener('click', function(e){ e.preventDefault(); openModal(modalCV, btnOpenCV); });
        modalCV.querySelectorAll('.close-button').forEach(b => b.addEventListener('click', ()=>{ closeModal(modalCV); }));
        modalCV.addEventListener('click', function(e){ if (e.target === this) { closeModal(this); } });
    }

    // generic open/close with focus management
    let lastFocused = null;

    function openModal(modal, opener) {
        lastFocused = opener || document.activeElement;
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        const focusable = getFocusable(modal);
        if (focusable.length) focusable[0].focus();

        // keyboard handlers
        modal._keyHandler = function(e) {
            if (e.key === 'Escape') { closeModal(modal); }
            if (e.key === 'Tab') {
                const focusable = getFocusable(modal);
                if (focusable.length === 0) { e.preventDefault(); return; }
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            }
        };
        document.addEventListener('keydown', modal._keyHandler);
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        if (modal._keyHandler) document.removeEventListener('keydown', modal._keyHandler);
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    // Pause resume animations on touch/hover for better mobile interaction
    ;(function(){
        const icons = document.querySelector('.icones-sociais');
        if (!icons) return;
        function pause(){ icons.style.animationPlayState = 'paused'; }
        function resume(){ icons.style.animationPlayState = 'running'; }
        icons.addEventListener('touchstart', pause, {passive:true});
        icons.addEventListener('touchend', resume, {passive:true});
        icons.addEventListener('mouseenter', pause);
        icons.addEventListener('mouseleave', resume);
    })();

    // Typewriter effect on name
    (function(){
        const el = document.querySelector('.nome');
        if (!el) return;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const finalText = '< Luis Torres />';
        if (prefersReduced) { el.textContent = finalText; return; }
        const chars = finalText.split('');
        el.textContent = '';
        el.classList.add('typewriter');
        let i = 0; const delay = 60;
        const tick = () => {
            if (i < chars.length) { el.textContent += chars[i++]; setTimeout(tick, delay); }
            else { /* keep cursor blinking via CSS */ }
        };
        setTimeout(tick, 250);
    })();

    // Minimal code rain background (performance-aware)
    (function(){
        const canvas = document.getElementById('code-rain');
        if (!canvas) return;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.innerWidth <= 600;
        if (prefersReduced) { canvas.style.display = 'none'; return; }
        const ctx = canvas.getContext('2d');
        function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        resize(); window.addEventListener('resize', resize);
        const symbols = '01{}[]()<>=+-*/$#@^&';
        const font = '12px Fira Mono, monospace';
        const columnWidth = 14;
        const columns = Math.floor(canvas.width / columnWidth);
        const drops = Array.from({length: columns}, (_, i) => Math.random() * canvas.height);
        const speed = isMobile ? 18 : 24;
        const density = isMobile ? 0.8 : 1.0; // fewer symbols on mobile
        function draw(){
            ctx.fillStyle = 'rgba(0,0,0,0.18)';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = 'rgba(57,255,234,0.75)';
            ctx.font = font;
            for (let i = 0; i < drops.length * density; i++){
                const x = (i * columnWidth) % canvas.width;
                const y = drops[i] || 0;
                const char = symbols[Math.floor(Math.random()*symbols.length)];
                ctx.fillText(char, x, y);
                drops[i] = y + speed;
                if (drops[i] > canvas.height) drops[i] = Math.random() * canvas.height * 0.2;
            }
            requestAnimationFrame(draw);
        }
        draw();
    })();