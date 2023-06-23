export async function renderReviewRate($wrapper, userAccount, pageNo) {

    const res = await fetch(`/api/v1/matchings/reviews/${userAccount}/${pageNo}`);

    if (res.status === 200) {

        const reviewList = await res.json();

        reviewList.list.forEach(({profileImage,
        userNickname,
        matchingReviewContent,
        matchingReviewRate}) => {

            const $review = document.createElement('div');
            $review.classList.add('each-review-wrapper');
            $review.innerHTML = `
                            <div class="review-profile-img"
                                 style="background-image: url('${profileImage}')"></div>
                            <div class="review-user-nickname-comment-wrapper">
                                <div class="review-user-nickname">${userNickname}</div>
                                <div class="review-comment">${matchingReviewContent}</div>
                            </div>
                            <div class="review-rate-wrapper">
                                ${renderStars(matchingReviewRate)}
                            </div>`;

            $wrapper.appendChild($review);

        });

    } else {

        alert(res.text());

    }

}

function renderStars(matchingReviewRate) {

    let star = '';

    for (let i = 0; i < matchingReviewRate; i++) {
        star += ' <img src="/assets/img/main/star.png" alt="별점">';
    }

    return star;
}