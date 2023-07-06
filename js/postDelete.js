const form = document.getElementById('comment_field')
const postDelete = document.querySelector('.container')
const textarea = document.getElementById('new-comment')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    let commentMessage = e.target.children[1].value

    if(commentMessage.length === 0) {
        alert('Type your comment!')
        return
    }

    const commentData = {
        "author": {
            "name": "Grace",
            "image": "https://cdn.pixabay.com/photo/2013/07/12/19/28/grace-hopper-154833_960_720.png"
        },
        "body": `${commentMessage}`,
        "date": new Date(),
        "answers": [],
        "meta": {
            "votes": 0
        }
    };

    postComment(commentData);
})

function carregaCommentAndAnswer() {
    window.addEventListener('DOMContentLoaded', (e) => {
        e.preventDefault()
        textarea.value = ''
        fetch('https://comments-l19n.onrender.com/comments')
            .then(response => response.json())
            .then(data => {
                data.forEach((mainComment) => {
                    const commentDate = new Date(mainComment.date);
                    const timeAgo = calculateTimeAgo(commentDate);
                    const commentTemplate = `
                        <section class="comment comment-answer" data-id="${mainComment._id}">
                            <img src="${mainComment.author.image}" class="image" alt="">
                            <span class="author_name">${mainComment.author.name}</span>
                            <span class="date">${timeAgo}</span>
                            ${isGraceComment(mainComment.author.name) ? `
                                <div class="edit-delete-btns">
                                    <span class="edit-btn">Edit</span>
                                    <span class="delete-btn">Delete</span>
                                </div>
                            ` : `
                                <span class="reply_field">Reply</span>
                            `}
                            <p class="text" data-current-id="${mainComment._id}">${mainComment.body}</p>
                        </section>
                    `
                    postDelete.insertAdjacentHTML('beforeend', commentTemplate)

                    if(mainComment.answers.length !== 0) {
                        const commentSection = document.querySelector(`.comment[data-id="${mainComment._id}"]`)
                        mainComment.answers.forEach((answer) => {
                            const answerDate = new Date(answer.date);
                            const answerTimeAgo = calculateTimeAgo(answerDate);
                            const answerTemplate = `
                                <section class="answer comment-answer" data-id="${mainComment._id}" data-answer-id="${answer._id}">
                                  <img src="${answer.author.image}" class="image" alt="">
                                  <span class="author_name">${answer.author.name}</span>
                                  <span class="date">${answerTimeAgo}</span>
                                  ${isGraceComment(answer.author.name) ? `
                                    <div class="edit-delete-btns">
                                      <span class="edit-btn">Edit</span>
                                      <span class="delete-btn">Delete</span>
                                    </div>
                                  ` : `
                                    <span class="reply_field">Reply</span>
                                  `}
                                  <p class="text" data-current-id="${answer._id}"><span class="first-word">@${mainComment.author.name.toLowerCase()}</span>, ${answer.body}</p>
                                </section>
                            `;
                            commentSection.insertAdjacentHTML('afterend', answerTemplate);

                            if (answer.answers.length !== 0) {
                                answer.answers.forEach((answerToAnswer) => {
                                    const answerToAnswerDate = new Date(answerToAnswer.date);
                                    const answerToAnswerTimeAgo = calculateTimeAgo(answerToAnswerDate);
                                    const answerToAnswerTemplate = `
                                        <section class="answer comment-answer" data-id="${mainComment._id}" data-answer-id="${answer._id}" data-reply-id="${answerToAnswer._id}">
                                            <img src="${answerToAnswer.author.image}" class="image" alt="">
                                            <span class="author_name">${answerToAnswer.author.name}</span>
                                            <span class="date">${answerToAnswerTimeAgo}</span>
                                            ${isGraceComment(answerToAnswer.author.name) ? `
                                                <div class="edit-delete-btns">
                                                    <span class="edit-btn">Edit</span>
                                                    <span class="delete-btn">Delete</span>
                                                </div>
                                            ` : `
                                                <span class="reply_field">Reply</span>
                                            `}
                                            <p class="text" data-current-id="${answerToAnswer._id}"><span class="first-word">@${answer.author.name.toLowerCase()}</span>, ${answerToAnswer.body}</p>
                                        </section>
                                    `;
                                    const answerSection = document.querySelector(`.answer[data-answer-id="${answer._id}"]`);
                                    answerSection.insertAdjacentHTML('afterend', answerToAnswerTemplate);
                                });
                            }
                        })

                    }
                })
                deleteSections()
                patch()
                replyBox()

                const firstWords = document.querySelectorAll('.text .first-word');
                firstWords.forEach(word => {
                    word.style.color = 'var(--moderate-blue)';
                    word.style.fontWeight = 'bold'
                });
            })
    })
}

carregaCommentAndAnswer()

function isGraceComment(authorName) {
    return authorName === 'Grace' || authorName === 'grace';
}

function postComment(comment) {
    fetch('https://comments-l19n.onrender.com/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
    })
        .then(response => response.json())
        .then(data => {
            location.reload()
            console.log('Comentário enviado com sucesso!', data);
        })
        .catch(error => {
            console.error('Erro ao enviar o comentário:', error);
        });
}

function postNewAnswer(id, answer) {
    fetch(`https://comments-l19n.onrender.com/comments/${id}/answers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(answer)
    })
        .then(response => response.json())
        .then(data => {
            location.reload()
            console.log('Resposta enviada com sucesso!', data);
        })
        .catch(error => {
            console.error('Erro ao enviar a resposta:', error);
        });
}

function postAnswerToAnswer(commentId, answerId, answerContent) {
    fetch(`https://comments-l19n.onrender.com/comments/${commentId}/answers/${answerId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(answerContent)
    })
        .then(response => response.json())
        .then(data => {
            location.reload()
        })
        .catch(error => {
            console.error('Erro ao enviar a resposta:', error);
        });
}

function deleteSections() {
    const deleteBtns = document.querySelectorAll('.delete-btn')
    const modal = document.getElementById('delete-modal');
    const confirmBtn = document.getElementById('confirm-delete');
    const cancelBtn = document.getElementById('cancel-delete');
    let commentSectionToDelete;

    deleteBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            commentSectionToDelete = ''
            commentSectionToDelete = btn.closest('.comment-answer');
            modal.style.display = 'block';
        })
    })

    confirmBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        let commentId = commentSectionToDelete.getAttribute('data-id');
        let answerId = commentSectionToDelete.getAttribute('data-answer-id')
        let answerAnswerId = commentSectionToDelete.getAttribute('data-reply-id')

        if (commentId && !answerId && !answerAnswerId) {
            deleteComment(commentSectionToDelete, commentId);
        } else if (commentId && answerId && !answerAnswerId) {
            deleteAnswer(commentSectionToDelete, commentId, answerId);
        } else if (commentId && answerId && answerAnswerId) {
            deleteAnswerOfAnswer(commentSectionToDelete, commentId, answerId, answerAnswerId);
        }

    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

function deleteComment(commentSectionToDelete, commentId) {
    fetch(`https://comments-l19n.onrender.com/comments/${commentId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                commentSectionToDelete.remove();

                // remove as respostas associadas ao comentário
                const answerSections = document.querySelectorAll(`.answer[data-id="${commentId}"]`);
                answerSections.forEach(answerSection => answerSection.remove());

                console.log('Comentário excluído com sucesso!');
            } else {
                console.error('Erro ao excluir o comentário:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Erro ao excluir o comentário:', error);
        });
}

function deleteAnswer(commentSectionToDelete, commentId, answerId) {
    fetch(`https://comments-l19n.onrender.com/comments/${commentId}/answers/${answerId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                commentSectionToDelete.remove();

                // remove as respostas associadas ao comentário
                const answerSections = document.querySelectorAll(`.answer[data-answer-id="${answerId}"]`);
                answerSections.forEach(answerSection => answerSection.remove());

                console.log('Resposta excluída com sucesso!');
            } else {
                console.error('Erro ao excluir resposta:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Erro ao excluir resposta:', error);
        });
}

function deleteAnswerOfAnswer(commentSectionToDelete, commentId, answerId, answerAnswerId) {
    fetch(`https://comments-l19n.onrender.com/comments/${commentId}/answers/${answerId}/replies/${answerAnswerId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                commentSectionToDelete.remove();

                // remove as respostas associadas a resposta
                const answerSections = document.querySelectorAll(`.answer[data-reply-id="${answerAnswerId}"]`);
                answerSections.forEach(answerSection => answerSection.remove());

                console.log('Resposta excluída com sucesso!');
            } else {
                console.error('Erro ao excluir resposta:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Erro ao excluir resposta:', error);
        });
}