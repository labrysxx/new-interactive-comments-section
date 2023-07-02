function patchComment() {
    const editBtns = document.querySelectorAll('.edit-btn');

    editBtns.forEach((editBtn) => {
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const commentSection = e.target.parentNode.parentNode;
            const paragraph = commentSection.querySelector('.text');
            paragraph.contentEditable = true;

            // Check if the "Save" button already exists
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

                    const commentId = paragraph.dataset.currentId;
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

                    console.log(JSON.stringify(updatedComment))

                    // send the updated comment data to the server
                    fetch(`https://comments-l19n.onrender.com/comments/${commentId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedComment), // convert the data to JSON string
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Comment updated successfully!', data);
                        })
                        .catch(error => {
                            console.error('Error updating the comment:', error);
                        });
                });

                commentSection.appendChild(newSaveBtn);
            }
        });
    });
}


