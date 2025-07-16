    document.querySelectorAll('.projeto-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('modal-titulo').textContent = link.textContent.trim();
            document.getElementById('modal-descricao').textContent = link.getAttribute('data-descricao');
            document.getElementById('modal-linguagem').textContent = 'Linguagem: ' + link.getAttribute('data-linguagem');
            document.getElementById('modal-link').href = link.getAttribute('data-url');
            document.getElementById('modal-projeto').classList.add('ativo');
        });
    });
    document.querySelector('.close-button').onclick = function() {
        document.getElementById('modal-projeto').classList.remove('ativo');
    };
    document.getElementById('modal-projeto').onclick = function(e) {
        if(e.target === this) document.getElementById('modal-projeto').classList.remove('ativo');
    };