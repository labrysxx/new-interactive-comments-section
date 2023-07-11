function patch() {
    const editBtns = document.querySelectorAll('.edit-btn');

    editBtns.forEach((editBtn) => {
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const commentSection = e.target.parentNode.parentNode;
            const paragraph = commentSection.querySelector('.text');
            paragraph.contentEditable = true;
            let answerId = paragraph.parentNode.dataset.answerId
            let commentId = paragraph.parentNode.dataset.id
            let answerAnswerId = paragraph.parentNode.dataset.replyId

            const saveBtn = commentSection.querySelector('.save-btn');

            if (!saveBtn) {
                const newSaveBtn = document.createElement('input');
                newSaveBtn.type = 'submit';
                newSaveBtn.value = 'SAVE';
                newSaveBtn.classList.add('save-btn');

                newSaveBtn.addEventListener('click', () => {
                    paragraph.contentEditable = false;
                    newSaveBtn.style.display = 'none';
                    newSaveBtn.remove();

                    if (commentId && !answerId && !answerAnswerId) {
                        patchComment(paragraph)
                    } else if (commentId && answerId && !answerAnswerId) {
                        patchAnswer(paragraph, commentId, answerId)
                    } else if (commentId && answerId && answerAnswerId) {
                        patchAnswerToAnswer(paragraph, commentId, answerId,answerAnswerId)
                    }

                });

                commentSection.appendChild(newSaveBtn);
            }
        });
    });
}

function patchComment(paragraph) {
    const currentId = paragraph.dataset.currentId;
    const updatedComment = {
        "author": {
            "name": "Grace",
            "image": "https://cdn.pixabay.com/photo/2013/07/12/19/28/grace-hopper-154833_960_720.png"
        },
        "meta": {
            "votes": 0
        },
        "body": `${paragraph.textContent}`
    };

    fetch(`https://comments-l19n.onrender.com/comments/${currentId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedComment)
    })
        .then(response => response.json())
        .catch(error => {
            console.error('erro ao atualizar comentário:', error);
        });
}

function patchAnswer(paragraph, commentId, answerId) {
    const updatedAnswer = {
        "author": {
            "name": "Grace",
            "image": "https://cdn.pixabay.com/photo/2013/07/12/19/28/grace-hopper-154833_960_720.png"
        },
        "meta": {
            "votes": 0
        },
        "body": `${paragraph.textContent.split(' ').slice(1).join(' ')}`
    };

    fetch(`https://comments-l19n.onrender.com/comments/${commentId}/answers/${answerId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAnswer)
    })
        .then(response => response.json())
        .catch(error => {
            console.error('erro ao atualizar comentário:', error);
        });
}

function patchAnswerToAnswer(paragraph, commentId, answerId, answerAnswerId) {
    const updatedAnswer = {
        "author": {
            "name": "Grace",
            "image": "https://cdn.pixabay.com/photo/2013/07/12/19/28/grace-hopper-154833_960_720.png"
        },
        "meta": {
            "votes": 0
        },
        "body": `${paragraph.textContent.split(' ').slice(1).join(' ')}`
    };

    fetch(`https://comments-l19n.onrender.com/comments/${commentId}/answers/${answerId}/replies/${answerAnswerId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAnswer)
    })
        .then(response => response.json())
        .catch(error => {
            console.error('erro ao atualizar resposta:', error);
        });
}
