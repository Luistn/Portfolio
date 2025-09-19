    // project links -> project modal
    // helpers for focusable elements
    function getFocusable(container) {
        return Array.from(container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
    }

    document.querySelectorAll('.projeto-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('modal-titulo').textContent = link.textContent.trim();
            document.getElementById('modal-descricao').textContent = link.getAttribute('data-descricao');
            document.getElementById('modal-linguagem').textContent = 'Linguagem: ' + link.getAttribute('data-linguagem');
            document.getElementById('modal-link').href = link.getAttribute('data-url');
            const modal = document.getElementById('modal-projeto');
            openModal(modal, link);
        });
    });

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