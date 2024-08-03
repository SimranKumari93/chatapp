let client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

let config = {
    appid: '25256a1b9011466dbf8206c180c014e1',
    token: '007eJxTYPgjptj4XkPps8xC/u6cpR93vzCyuRF4zr/rCqfUjiP89aIKDEamRqZmiYZJlgaGhiZmZilJaRZGBmbJhhYGyQaGJqmG7HNi0hoCGRkm5i5hYIRCEJ+LISezLLW4pCg1MZeBAQC3kyBP',
    uid: null,
    channel: 'livestream',
};

let localTracks = {
    audioTrack: null,
    videoTrack: null,
};

let localTrackState = {
    audioTrackMuted: false,
    videoTrackMuted: false,
};

let remoteTracks = {};

document.getElementById('join-btn').addEventListener('click', async () => {
    try {
        console.log('User Joined stream');
        await joinStreams();
        document.getElementById('join-btn').style.display = 'none';
        document.getElementById('footer').style.display = 'flex';
    } catch (error) {
        console.error('Error joining stream:', error);
    }
});

document.getElementById('mic-btn').addEventListener('click', async () => {
    try {
        if (localTracks.audioTrack) {
            if (!localTrackState.audioTrackMuted) {
                await localTracks.audioTrack.setMuted(true);
                localTrackState.audioTrackMuted = true;
                document.getElementById('mic-btn').style.backgroundColor = 'rgba(255, 80, 80, 0.7)';
            } else {
                await localTracks.audioTrack.setMuted(false);
                localTrackState.audioTrackMuted = false;
                document.getElementById('mic-btn').style.backgroundColor = '#1f1f1f8e';
            }
        }
    } catch (error) {
        console.error('Error toggling mic:', error);
    }
});

document.getElementById('camera-btn').addEventListener('click', async () => {
    try {
        if (localTracks.videoTrack) {
            if (!localTrackState.videoTrackMuted) {
                await localTracks.videoTrack.setMuted(true);
                localTrackState.videoTrackMuted = true;
                document.getElementById('camera-btn').style.backgroundColor = 'rgba(255, 80, 80, 0.7)';
            } else {
                await localTracks.videoTrack.setMuted(false);
                localTrackState.videoTrackMuted = false;
                document.getElementById('camera-btn').style.backgroundColor = '#1f1f1f8e';
            }
        }
    } catch (error) {
        console.error('Error toggling camera:', error);
    }
});

document.getElementById('leave-btn').addEventListener('click', async () => {
    try {
        for (let trackName in localTracks) {
            let track = localTracks[trackName];
            if (track) {
                track.stop();
                track.close();
                localTracks[trackName] = null;
            }
        }
        await client.leave();
        document.getElementById('user-streams').innerHTML = '';
        document.getElementById('footer').style.display = 'none';
        document.getElementById('join-btn').style.display = 'block';
    } catch (error) {
        console.error('Error leaving stream:', error);
    }
});

let joinStreams = async () => {
    try {
        client.on('user-published', handleUserJoined);
        client.on('user-left', handleUserLeft);
        client.on('user-unpublished', handleUserLeft);

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
    } catch (error) {
        console.error('Error joining streams:', error);
    }
};

let handleUserLeft = async (user) => {
    delete remoteTracks[user.uid];
    document.getElementById(`video-wrapper-${user.uid}`)?.remove();
};

let handleUserJoined = async (user, mediaType) => {
    try {
        console.log('User has joined our stream');
        remoteTracks[user.uid] = user;

        await client.subscribe(user, mediaType);

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
    } catch (error) {
        console.error('Error handling user join:', error);
    }
};
