function replyBox() {
    const replyBtns = document.querySelectorAll('.reply_field');

    for (let replyBtn of replyBtns) {
        replyBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const currentComment = e.target.parentNode;
            const replyBox = currentComment.nextElementSibling;

            // Verificar se a caixa de resposta já existe
            if (replyBox && replyBox.classList.contains('answer_field')) {
                replyBox.remove(); // Remove a caixa de resposta se ela já existir
                return;
            }

            // Cria a caixa de resposta
            const boxTemplate = `
                <form action="" class="answer_field">
                    <img src="https://cdn.pixabay.com/photo/2013/07/12/19/28/grace-hopper-154833_960_720.png" alt="" class="image">
                    <textarea cols="30" rows="10" class="new-answer"></textarea>
                    <input type="submit" class="submit_btn" value="SEND">
                </form>
            `;
            currentComment.insertAdjacentHTML('afterend', boxTemplate);
            catchAnswer()
        });
    }
}

function catchAnswer() {
    const answer_fields = document.querySelectorAll('.answer_field');
    for (let answer_field of answer_fields) {
        answer_field.addEventListener('submit', (e) => {
            e.preventDefault();
            const answer_content = e.target.children[1].value;
            let commentElement = e.target.previousElementSibling;

            // procurar pelo elemento com a classe "comment"
            while (commentElement) {
                if (commentElement.classList.contains('comment')) {
                    break;
                }
                commentElement = commentElement.previousElementSibling;
            }

            const closestIdComment = commentElement.dataset.id;
        });
    }
}


