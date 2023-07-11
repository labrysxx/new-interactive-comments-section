
function createReplyBox() {
    removeAnswerFields()
    const replyBtns = document.querySelectorAll('.reply_field');

    for (let replyBtn of replyBtns) {
        replyBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const currentComment = e.target.parentNode;
            const nextBox = currentComment.nextElementSibling;

            // Verificar se a caixa de resposta já existe
            if (nextBox && nextBox.classList.contains('answer_field')) {
                nextBox.remove(); // Remove a caixa de resposta se ela já existir
                return;
            }

            // Cria a caixa de resposta
            const boxTemplate = `
                <form class="answer_field">
                    <img src="https://cdn.pixabay.com/photo/2013/07/12/19/28/grace-hopper-154833_960_720.png" alt="" class="image">
                    <textarea cols="30" rows="10" class="new-answer"></textarea>
                    <input type="submit" class="submit_btn" value="SEND">
                </form>
            `;
            currentComment.insertAdjacentHTML('afterend', boxTemplate);
            processAnswer()
        });
    }
}

function processAnswer() {
    const answerBoxes = document.querySelectorAll('.answer_field');

    for (let currentAnswerBox of answerBoxes) {
        currentAnswerBox.addEventListener('submit', (e) => {
            e.preventDefault();
            const answerContent = e.target.children[1].value;
            let previousClosestComment = e.target.previousElementSibling;

            // procurar pelo elemento anterior mais próximo com a classe "comment"
            while (previousClosestComment) {
                if (previousClosestComment.classList.contains('comment')) {
                    break;
                }
                previousClosestComment = previousClosestComment.previousElementSibling;
            }

            const answerToAnswerId = e.target.previousElementSibling.dataset.answerId
            const closestIdComment = previousClosestComment.dataset.id;

            const newAnswerTemplate = {
                "author": {
                    "name": "Grace",
                    "image": "https://cdn.pixabay.com/photo/2013/07/12/19/28/grace-hopper-154833_960_720.png"
                },
                "body": `${answerContent}`,
                "date": new Date(),
                "meta": {
                    "votes": 0
                }
            }

            if(answerToAnswerId) {
                postAnswerToAnswer(closestIdComment, answerToAnswerId, newAnswerTemplate)
            } else {
                postAnswerToComment(closestIdComment, newAnswerTemplate)
            }
        });
    }
}

function removeAnswerFields() {
    const answerBoxes = document.querySelectorAll('.answer_field');

    for(let answerBox of answerBoxes) {
        answerBox.remove()
    }
}


