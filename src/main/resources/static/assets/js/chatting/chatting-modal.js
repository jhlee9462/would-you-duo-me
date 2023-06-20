import {addModalBtnEvent, addModalCloseEvent} from "../common/modal-handler.js";
import {messageRender} from "./messageRendering.js";
import {connectSocket} from "./main.js";

export function getChattingList(socket) {
    // console.log('chatting-modal.js까지 도달')
    // 추후 session에 회원정보 담기면 경로 수정
    const userId = 'test1';
    fetch(`/api/v1/chat/chattings/${userId}`)
        .then(res => res.json())
        .then(result => renderChattingList(socket, result))
        .then(result => messageRender(result));

}

function makeChatting(chat) {
    const userId = 'test1';
    const userAccount = chat.closest('.duo-profile').id;
    console.log(userAccount);

    chat.onclick = () => {
    console.log('makeChatting 도달');
        const requestInfo = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: userId
        }

        fetch(`/api/v1/chat/chattings/${userAccount}`, requestInfo)
            .then(res => res.json())
            .then(result => {
                //getChattingList
                document.getElementById('chatting-btn').click();
                console.log(result);
                document.getElementById(result).click();
            })
    }
}

export function makeChattingRoom(){
    console.log('makeChattingRoom 도달');
    [...document.querySelectorAll('.chatting-icon')].forEach(
        chat => makeChatting(chat)
    );
}

function renderChattingList(socket, result) {
    // console.log('renderChattingList 도달');
    let chattings = '';
    if (result.length === 0) {
        chattings = document.createElement('li');
        chattings.id = 'empty-chatting-list';
        chattings.innerHTML = '아직 채팅 내역이 없어요.<br>다른 듀오 회원에게 말을 걸어보세요!';

    } else {
        for (let i = 0; i < result.length; i++) {

            const {chattingNo, profileImage, userNickname, messageContent, messageUnreadCount} = result[i];

            chattings += `<li id = "${chattingNo}" class="chatting-card">
                <div class = "chat-card">
                <div class="chatting-card-inner modal-btn">
                    <img src="${profileImage}" alt="프로필 이미지" class="chatting-profile-img">
                    <div class="chatting-info">
                        <div class="chatting-nickname">${userNickname}</div>
                        <div class="chatting-current-message">${messageContent}</div>
                    </div>
                    <div class="chatting-unread">${messageUnreadCount}</div>
                </div>
                <dialog class = "message-dialog">
        <div class=" chatting-message-modal-wrapper">
        <div class="chatting-message-modal-container">
        <div class="chatting-message-head">
        <img class="chatting-arrow-img toBack" src="/assets/img/chattingModal/arrows.png" alt="뒤로가기">
        <div class="chatting-message-nickname">${userNickname}</div>
        </div>
        <div class="chatting-message-option">
        <div class="matching-accept-container">
        <button class="matching-accept-btn">
        <img class="chatting-handshake-img" src="/assets/img/chattingModal/handshake.png" alt="매칭수락이미지">
        매칭 확정</button></div><div class="gameover-container">
        <button class="gameover-btn">
        <img class="chatting-gameover-img" src="/assets/img/chattingModal/checkmark.png" alt="게임완료이미지">
        게임 완료</button></div></div><div class="chatting-message-body">
        </div>
        <form class="chatting-message-input-box chat-form">
        <input class="message-send-box msg" type="text" placeholder="메시지를 입력해주세요" required autofocus>
        <button class="message-send-btn">전송</button>
        </form>
        </div>
        </div></dialog>
        </div>
        </li>`;

        }
        document.querySelector('.chatting-modal-container').innerHTML = chattings;
        addModalBtnEvent();
        addModalCloseEvent();
        toBack();
    }

    const chatForm =  [...document.querySelectorAll('.chat-form')];
    connectSocket(socket, chatForm);
    return [...document.querySelectorAll('.chatting-card')];
}


function closeRecentModal($toBack) {
    $toBack.onclick = e => {
        const $dialog = e.target.closest('dialog');
        $dialog.close();
    }
}

export function toBack() {

    [...document.querySelectorAll('.toBack')].forEach(
        $toBack => closeRecentModal($toBack)
    );
}

// function renderRecentMessage($dialog){
//     const chattingNo = $dialog.closest('.chatting-card').id;
//     let recentMsg = chattingNo.querySelector('.chatting-current-message').textContent;
//
//     fetch(`/api/v1/chat/messages/recent/${chattingNo}`)
//         .then(res => res.json())
//         .then(result => {
//             recentMsg = result;
//         })
// }

export function renderUnreadMessages(chattingNo){
    const $chatting = document.getElementById(chattingNo);
    // console.log($chatting);
    const $target = $chatting.querySelector('.chatting-unread');
    // console.log($target);

    const userId = "test1";
    fetch(`/api/v1/chat/messages/unread/${userId}/${chattingNo}`)
        .then(res => res.json())
        .then(unread => {
            $target.innerText = unread;
        })
}

export function openChattingList(socket){
    const $chatBtn = document.getElementById('chatting-btn');
    $chatBtn.addEventListener('click', getChattingList(socket));
    // console.log('openChattingList까지 도달');
}