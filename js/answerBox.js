function createReplyBox() {
    removeAnswerFields();

    const replyBtns = document.querySelectorAll('.reply_field');
    for (let replyBtn of replyBtns) {
        replyBtn.addEventListener('click', handleReplyButtonClick);
    }
}

function removeAnswerFields() {
    const answerBoxes = document.querySelectorAll('.answer_field');

    for(let answerBox of answerBoxes) {
        answerBox.remove()
    }
}

function handleReplyButtonClick(e) {
    e.preventDefault();

    const currentComment = e.target.parentNode;
    const nextBox = currentComment.nextElementSibling;

    if (nextBox && nextBox.classList.contains('answer_field')) {
        removeElement(nextBox);
        return;
    }

    const boxTemplate = createAnswerBoxTemplate();
    currentComment.insertAdjacentHTML('afterend', boxTemplate);
    processAnswer();
}

function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

function createAnswerBoxTemplate() {
    return `
    <form class="answer_field">
      <img src="https://cdn.pixabay.com/photo/2013/07/12/19/28/grace-hopper-154833_960_720.png" alt="" class="image">
      <textarea cols="30" rows="10" class="new-answer"></textarea>
      <input type="submit" class="submit_btn" value="SEND">
    </form>
  `;
}

function processAnswer() {
    const answerBoxes = document.querySelectorAll('.answer_field');

    for (let currentAnswerBox of answerBoxes) {
        currentAnswerBox.addEventListener('submit', handleAnswerSubmit);
    }
}

function handleAnswerSubmit(e) {
    e.preventDefault();

    const { answerId: answerToAnswerId } = e.target.previousElementSibling.dataset;
    const { id: closestIdComment } = findPreviousClosestComment(e.target).dataset;

    const newAnswerTemplate = {
        author: {
            name: 'Grace',
            image: 'https://cdn.pixabay.com/photo/2013/07/12/19/28/grace-hopper-154833_960_720.png'
        },
        body: e.target.children[1].value,
        date: new Date(),
        meta: {
            votes: 0
        }
    };

    const commentAnswerRequest = {
        commentId: closestIdComment,
        answerContent: newAnswerTemplate
    };

    if (answerToAnswerId) {
        postAnswerToAnswer(commentAnswerRequest, answerToAnswerId);
    } else {
        postAnswerToComment(commentAnswerRequest);
    }
}

function findPreviousClosestComment(element) {
    let previousElement = element.previousElementSibling;

    while (previousElement) {
        if (previousElement.classList.contains('comment')) {
            return previousElement;
        }
        previousElement = previousElement.previousElementSibling;
    }

    return null;
}


