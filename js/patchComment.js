function patchComment() {
    const editBtns = document.querySelectorAll('.edit-btn');

    editBtns.forEach((editBtn) => {
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const commentSection = e.target.parentNode.parentNode;
            const paragraph = commentSection.querySelector('.text');
            paragraph.contentEditable = true;

            // check if the "Save" button already exists
            const saveBtn = commentSection.querySelector('.save-btn');

            if (!saveBtn) {
                const newSaveBtn = document.createElement('input');
                newSaveBtn.type = 'submit';
                newSaveBtn.value = 'SAVE';
                newSaveBtn.classList.add('save-btn');

                newSaveBtn.addEventListener('click', () => {
                    paragraph.contentEditable = false;
                    newSaveBtn.style.display = 'none';
                    // add save logic here
                });

                commentSection.appendChild(newSaveBtn);
            }
        });
    });
}

