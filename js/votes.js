let userLiked = false;
let userDisliked = false;

function setLikeCounter() {
    const counters = document.querySelectorAll('.contador');

    for (let counter of counters) {
        counter.addEventListener('click', handleVote)
    }
}

function handleVote(event) {
    event.preventDefault();

    if (event.target.classList.contains('upvote')) {
        upVote(event);
    }

    if (event.target.classList.contains('downvote')) {
        downVote(event);
    }
}

function upVote(event) {
    if (event.target.classList.contains('upvote')) {
        if (!userLiked) {
            let scoreElement = event.target.nextElementSibling;
            if (scoreElement) {
                let score = parseInt(scoreElement.innerText);
                score += 1;
                scoreElement.innerHTML = score;
                userLiked = true;
                userDisliked = false;
            }
        }
    }
}

function downVote(event) {
    if (event.target.classList.contains('downvote')) {
        if (!userDisliked) {
            let scoreElement = event.target.previousElementSibling;
            if (scoreElement) {
                let score = parseInt(scoreElement.innerText);
                if (score > 0) {
                    score -= 1;
                    scoreElement.innerHTML = score;
                }
                userDisliked = true;
                userLiked = false;
            }
        }
    }
}