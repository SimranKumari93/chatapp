let client = AgoraRTC.createClient({ mode: 'rtc', codec: "vp8" });

let config = {
    appid: '25256a1b9011466dbf8206c180c014e1',
    token: '007eJxTYPgjptj4XkPps8xC/u6cpR93vzCyuRF4zr/rCqfUjiP89aIKDEamRqZmiYZJlgaGhiZmZilJaRZGBmbJhhYGyQaGJqmG7HNi0hoCGRkm5i5hYIRCEJ+LISezLLW4pCg1MZeBAQC3kyBP',
    uid: null,
    channel: 'livestream',
}

let localTracks = {
    audioTrack: null,
    videoTrack: null,
}

let localTrackState = {
    audioTrackMuted: false,
    videoTrackMuted: false,
}

let remoteTracks = {}

document.getElementById('join-btn').addEventListener('click', async () => {
    console.log('User Joined stream');
    await joinStreams();
    document.getElementById('join-btn').style.display = 'none'

    document.getElementById('footer').style.display = 'flex'

})

document.getElementById('mic-btn').addEventListener('click', async () => {
    if(!localTrackState.audiotrackMuted){
        await localTracks.audioTrack.setMuted(true)
        localTrackState.audiotrackMuted = true
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80, 0.7)'
    }else{
        await localTracks.audioTrack.setMuted(false)
        localTrackState.audiotrackMuted = false
        document.getElementById('mic-btn').style.backgroundColor = '#1f1f1f8e'

    }
})

document.getElementById('camera-btn').addEventListener('click', async () => {
    if(!localTrackState.videoTrackMuted){
        await localTracks.videoTrack.setMuted(true)
        localTrackState.videoTrackMuted = true
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80, 0.7)'

    }else{
        await localTracks.videoTrack.setMuted(false)
        localTrackState.videoTrackMuted = false
        document.getElementById('camera-btn').style.backgroundColor = '#1f1f1f8e'

    }
})

document.getElementById('leave-btn').addEventListener('click', async () => {
    for (let trackName in localTracks) {
        let track = localTracks[trackName];
        if (track) {
            // stops camera and mic
            track.stop();
            // disconnects you from camera and mic 
            track.close();
            localTracks[trackName] = null;
        }
    }
    await client.leave();
    document.getElementById('user-streams').innerHTML = '';
    document.getElementById('footer').style.display = 'none';
    document.getElementById('join-btn').style.display = 'block';

})

let joinStreams = async () => {
    client.on("user-published", handleUserJoined);

    [config.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
        client.join(config.appid, config.channel, config.token || null, config.uid || null),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack(),
    ]);

    let videoPlayer = `<div class="video-container" id="video-wrapper-${config.uid}">
    <p class="user-uid">${config.uid}</p>
    <div class="video-player player" id="stream-${config.uid}"></div>
    </div>`;

    document.getElementById('user-streams').insertAdjacentHTML('beforeend', videoPlayer);
    localTracks.videoTrack.play(`stream-${config.uid}`);
    await client.publish([localTracks.audioTrack, localTracks.videoTrack]);
}

let handleUserLeft = async (user) => {
    delete remoteTracks[user.uid];
    document.getElementById(`video-wrapper-${user.uid}`).remove();
}

let handleUserJoined = async (user, mediaType) => {
    console.log('User has joined our stream');
    remoteTracks[user.uid] = user;

    await client.subscribe(user, mediaType);

let videoPlayer =  document.getElementById(`video-wrapper-${user.uid}`)
    if(videoPlayer != null){
    player.remove() 
    }


    if (mediaType === 'video') {
        let videoPlayer = `<div class="video-container" id="video-wrapper-${user.uid}">
        <p class="user-uid">${user.uid}</p>
        <div class="video-player player" id="stream-${user.uid}"></div>
        </div>`;
        document.getElementById('user-streams').insertAdjacentHTML('beforeend', videoPlayer);
        user.videoTrack.play(`stream-${user.uid}`);
    }
    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
}