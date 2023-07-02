const form = document.getElementById('comment_field')
const postDeleteComment = document.querySelector('.container')
const textarea = document.querySelector('textarea')

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
    upCommentMade(commentData)

    // limpa textarea ao enviar o formulário
    textarea.value = ''
})

window.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    fetch('https://comments-l19n.onrender.com/comments')
        .then(response => response.json())
        .then(data => {
            data.forEach((mainComment) => {
                const commentDate = new Date(mainComment.date);
                const timeAgo = calculateTimeAgo(commentDate);
                const commentTemplate = `
                        <section id="comment" data-id="${mainComment._id}">
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
                postDeleteComment.insertAdjacentHTML('afterbegin', commentTemplate)

                if(mainComment.answers.length !== 0) {
                    const commentSection = document.getElementById('comment')
                    mainComment.answers.forEach((answer) => {
                        const answerTemplate = `
                            <section id="answer" data-id="${answer._id}">
                                <img src="${answer.author.image}" class="image" alt="">
                                <span class="author_name">${answer.author.name}</span>
                                <span class="date">${timeAgo}</span>
                                ${isGraceComment(answer.author.name) ? `
                                    <div class="edit-delete-btns">
                                        <span class="edit-btn">Edit</span>
                                        <span class="delete-btn">Delete</span>
                                    </div>
                                ` : `
                                    <span class="reply_field">Reply</span>
                                `}
                                <p class="text" data-current-id="${answer._id}">${answer.body}</p>
                            </section>
                        `
                        commentSection.insertAdjacentHTML('afterend', answerTemplate)
                    })

                }
            })
            deleteComment()
            patchComment()
        })
})

function isGraceComment(authorName) {
    return authorName === 'Grace';
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
            console.log('Comentário enviado com sucesso!', data);
        })
        .catch(error => {
            console.error('Erro ao enviar o comentário:', error);
        });
}

function upCommentMade(comment) {
    const commentDate = new Date(comment.date);
    const timeAgo = calculateTimeAgo(commentDate);
    const commentTemplate = `
        <section id="comment" data-id="${comment._id}">
            <img src="${comment.author.image}" class="image" alt="">
            <span class="author_name">${comment.author.name}</span>
            <span class="date">${timeAgo}</span>
            <div class="edit-delete-btns">
                <span class="edit-btn">Edit</span>
                <span class="delete-btn">Delete</span>
            </div>
            <p class="text" data-current-id="${comment._id}">${comment.body}</p>
      
        </section>
    `
    postDeleteComment.insertAdjacentHTML('afterbegin', commentTemplate)
    deleteComment()
    patchComment()
}

function deleteComment() {
    const deleteBtns = document.querySelectorAll('.delete-btn')
    const modal = document.getElementById('delete-modal');
    const confirmBtn = document.getElementById('confirm-delete');
    const cancelBtn = document.getElementById('cancel-delete');
    let commentSectionToDelete;

    deleteBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            commentSectionToDelete = btn.closest('#comment');
            modal.style.display = 'block';
        })
    })

    confirmBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        const commentId = commentSectionToDelete.getAttribute('data-id');

        fetch(`https://comments-l19n.onrender.com/comments/${commentId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    commentSectionToDelete.remove();
                    console.log('Comentário excluído com sucesso!');
                } else {
                    console.error('Erro ao excluir o comentário:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Erro ao excluir o comentário:', error);
            });
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}