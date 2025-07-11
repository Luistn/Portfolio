document.addEventListener('DOMContentLoaded', () => {
            const projectLinks = document.querySelectorAll('.projeto-link');
            const modal = document.getElementById('modal-projeto');
            const modalTitle = document.getElementById('modal-titulo');
            const modalDescription = document.getElementById('modal-descricao');
            const modalLink = document.getElementById('modal-link');
            const closeModalButton = document.querySelector('.close-button');

            projectLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    modalTitle.innerHTML = link.innerHTML;
                    modalDescription.innerText = link.dataset.descricao;
                    modalLink.href = link.dataset.url;
                    modal.classList.add('ativo');
                });
            });

            const closeModal = () => modal.classList.remove('ativo');
            closeModalButton.addEventListener('click', closeModal);
            modal.addEventListener('click', (event) => {
                if (event.target === modal) closeModal();
            });
        });