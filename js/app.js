// get element
const screen_01 = document.getElementById('s1');
const screen_02 = document.getElementById('s2');
const camera_toggle = document.getElementById('camera_toggle');
const mic_toggle = document.getElementById('mic_toggle');
const create_offer = document.getElementById('create_offer');
const offer_sdp = document.getElementById('offer_sdp');
const create_answer = document.getElementById('create_answer');
const answer_sdp = document.getElementById('answer_sdp');
const add_answer = document.getElementById('add_answer');
const add_answer_sdp = document.getElementById('add_answer_sdp');


// variable initialize
let peerConnection, localStream, remoteStream;
let cameraStatus = true;
let micStatus = false;

// create a servers
let servers = {
    iceServers : [
        {
            urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        } 
    ]
};

// vidio and audio stremming init
const localStreamInit = async () => {

    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    screen_02.srcObject = localStream;
    localStream.getAudioTracks()[0].enabled = false;

}

localStreamInit();


// create offer
const createOffer = async () => {

    peerConnection = new RTCPeerConnection(servers);

    // get remote stream
    remoteStream = new MediaStream();
    screen_01.srcObject = remoteStream;

    localStream.getTracks().forEach( track => {
        peerConnection.addTrack(track, localStream);
    } )

    peerConnection.ontrack = async ( event ) => {
        event.streams[0].getTracks().forEach( track => {
            remoteStream.addTrack(track);
        } )
    }

    // Check ice candidate
    peerConnection.onicecandidate = async ( event ) => {
        if( event.candidate ) {
            offer_sdp.value = JSON.stringify( peerConnection.localDescription );
        }
    }

    // create a offer
    let offer = await peerConnection.createOffer();
    offer_sdp.value = JSON.stringify(offer);
    await peerConnection.setLocalDescription(offer); 

}

create_offer.onclick = () => {  
    createOffer();
}

// create answer
const createAnswer = async () => {

    peerConnection = new RTCPeerConnection(servers);

    // get remote stream
    remoteStream = new MediaStream();
    screen_01.srcObject = remoteStream;

    localStream.getTracks().forEach( track => {
        peerConnection.addTrack(track, localStream);
    } )

    peerConnection.ontrack = async ( event ) => {
        event.streams[0].getTracks().forEach( track => {
            remoteStream.addTrack(track);
        } )
    }

    // Check ice candidate
    peerConnection.onicecandidate = async ( event ) => {
        if( event.candidate ) {
            offer_sdp.value = JSON.stringify( peerConnection.localDescription );
        }
    }

    // reveice offer
    let offer = offer_sdp.value;
    offer = JSON.parse(offer);
    await peerConnection.setRemoteDescription(offer);

    // create a answer
    let answer = await peerConnection.createAnswer();
    answer_sdp.value = JSON.stringify(answer);
    await peerConnection.setLocalDescription(answer); 

}

create_answer.onclick = () => {  
    createAnswer();
}

// add answer
const addAnswer = async () => {

    let answer = add_answer_sdp.value;
    answer = JSON.parse(answer);
    await peerConnection.setRemoteDescription(answer);

}

add_answer.onclick = () => {
    addAnswer();
}

// control camera
camera_toggle.onclick = () => {

    cameraStatus = !cameraStatus;
    localStream.getVideoTracks()[0].enabled = cameraStatus;
    camera_toggle.classList.toggle('active');
    
}

// control audio
mic_toggle.onclick = () => {

    micStatus = !micStatus;
    localStream.getAudioTracks()[0].enabled = micStatus;
    mic_toggle.classList.toggle('active');

}

