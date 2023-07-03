function replyBox() {
    const replyBtns = document.querySelectorAll('.reply_field');

    for (let replyBtn of replyBtns) {
        replyBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const currentComment = e.target.parentNode;
            const replyBox = currentComment.nextElementSibling;

            // Verificar se a caixa de resposta já existe
            if (replyBox && replyBox.id === 'answer_field') {
                replyBox.remove(); // Remove a caixa de resposta se ela já existir
                return;
            }

            // Cria a caixa de resposta
            const boxTemplate = `
                <form action="" id="answer_field">
                    <img src="https://cdn.pixabay.com/photo/2013/07/12/19/28/grace-hopper-154833_960_720.png" alt="" class="image">
                    <textarea cols="30" rows="10" id="new-answer"></textarea>
                    <input type="submit" id="submit_btn" value="SEND">
                </form>
            `;
            currentComment.insertAdjacentHTML('afterend', boxTemplate);

            // Adiciona um evento de clique para remover a caixa de resposta ao ser clicada novamente
            const newReplyBtn = currentComment.nextElementSibling.querySelector('#submit_btn');
            newReplyBtn.addEventListener('click', () => {
                replyBox.remove(); // Remove a caixa de resposta ao clicar no botão "SEND"
            });
        });
    }
}
