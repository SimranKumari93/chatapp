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

let remoteTracks = {}

document.getElementById('join-btn').addEventListener('click', async () => {
    console.log('User Joined stream');
    await joinStreams();
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

// let client = AgoraRTC.createClient({mode: 'rtc', codec: "vp8"})

// let config = {
//     appid: '25256a1b9011466dbf8206c180c014e1',
//     token: '007eJxTYPgjptj4XkPps8xC/u6cpR93vzCyuRF4zr/rCqfUjiP89aIKDEamRqZmiYZJlgaGhiZmZilJaRZGBmbJhhYGyQaGJqmG7HNi0hoCGRkm5i5hYIRCEJ+LISezLLW4pCg1MZeBAQC3kyBP',
//     uid: null,
//     channel: 'livestream',
// }
// let localTracks = {
//     audioTrack: null,
//     videoTrack: null,
// }

// let remoteTracks = {}

// document.getElementById('join-btn').addEventListener('click', async () => {
//     console.log('User Joined stream')
//     await joinStreams()
// })

// document.getElementById('leave-btn').addEventListener('click', async () => {
//     for (let trackName in localTracks) {
//         let track = localTracks[trackName]
//         if (track) {
//             // stops camera and mic
//             track.stop()
//             // disconnects you from camera and mic 
//             track.close()
//             localTracks[trackName] = null
//         }
//     }
//     await client.leave()
//     document.getElementById('user-streams').innerHTML = ''
// })

// let joinStreams = async () => {
//     client.on("user-published", handleUserJoined)

//     [config.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
//         client.join(config.appid, config.channel, config.token || null, config.uid || null),
//         AgoraRTC.createMicrophoneAudioTrack(),
//         AgoraRTC.createCameraVideoTrack(),
//     ])

//     let videoPlayer = `<div class="video-container" id="video-wrapper-${config.uid}">
//     <p class="user-uid">${config.uid}</p>
//     <div class="video-player player" id="stream-${config.uid}"></div>
//     </div>`

//     document.getElementById('user-streams').insertAdjacentHTML('beforeend', videoPlayer)
//     localTracks.videoTrack.play(`stream-${config.uid}`)
//     await client.publish(Object.values(localTracks))
// }

// let handleUserLeft = async (user) => {
//     delete remoteTracks[user.uid]
//     document.getElementById(`video-wrapper-${user.uid}`).remove()
// }

// let handleUserJoined = async (user, mediaType) => {
//     console.log('User has joined our stream')
//     remoteTracks[user.uid] = user

//     await client.subscribe(user, mediaType)

//     if (mediaType === 'video') {
//         let videoPlayer = `<div class="video-container" id="video-wrapper-${user.uid}">
//         <p class="user-uid">${user.uid}</p>
//         <div class="video-player player" id="stream-${user.uid}"></div>
//         </div>`
//         document.getElementById('user-streams').insertAdjacentHTML('beforeend', videoPlayer)
//         user.videoTrack.play(`stream-${user.uid}`)
//     }
//     if (mediaType === 'audio') {
//         user.audioTrack.play()
//     }
// }



// // let client = AgoraRTC.createClient({mode : 'rtc', 'codec': "vp8"})

// // let config = {
// //     appid: '25256a1b9011466dbf8206c180c014e1',
// //     token:'007eJxTYPgjptj4XkPps8xC/u6cpR93vzCyuRF4zr/rCqfUjiP89aIKDEamRqZmiYZJlgaGhiZmZilJaRZGBmbJhhYGyQaGJqmG7HNi0hoCGRkm5i5hYIRCEJ+LISezLLW4pCg1MZeBAQC3kyBP',
// //     uid: null,
// //     channel: 'livestream',
// // }
// // let localTracks = {
// //     audioTracks: null,
// //     videoTracks: null,
// // }

// // let remoteTracks = {}

// // document.getElementById('join-btn').addEventListener('click',async () => {
// //     console.log('User Joined stream')
// //     await joinStreams()
// // })

// // document.getElementById('leave-btn').addEventListener('click', async ()=> {
// //     for(trackName in localTracks){
// //         let track = localTracks[trackName]
// //         if(track){
// //         // stops camera and mic
// //             track.stop()
// //         // disconnects you from camera and mic 
// //             track.close()
// //             localTracks[trackName] = null
// //         }
// //     }
// //     await client.leave()
// //     document.getElementById('user-streams').innerHTML = ''
// // })

// // let joinStreams = async () =>{

// //    // client.on("user-published", handleuserJoined)

// //   [config.uid, localTracks.audioTracks, localTracks] = await Promise.all([
// //       client.join(config.appid, config.channel, config.token || null, config.uid || null),
// //      // AgoraRTC.createMicrophoneAudioTracks(), 
// //       AgoraRTC.createCameraVideoTracks(),
// //     ])

// // let videoPlayer =`<div class="video-container" id="video-wrapper-${config.uid}"> 
// // <p class="user-uid">${config.uid}</p>
// // <div class="video-player player" id="stream-${config.uid}"></div>
// // </div>`

// // document.getElementById('user-streams').insertAdjacentHTML('beforeend', videoPlayer)
// // localTracks.videoTracks[0].play(`stream-${config.uid}`)
// // await client.publish([localTracks.audioTracks, localTracks.videoTracks])
// // }

// // let handleUserLeft = async = (user) => {
// //     delete remoteTracks[user.uid] 
// //     document.getElementById(`video-wrapper-$(user.uid)`)
// // }
// // let handleuserJoined = async (user, mediaType) => {
// //     console.log('User has joined our stream')
// //     remoteTracks[user.uid] = user

// //     await client.subscribe(user, mediaType)
    
// //     if (mediaType === 'video'){
// //         let videoPlayer =`<div class="video-container" id="video-wrapper-${user.uid}"> 
// //         <p class="user-uid">${user.uid}</p>
// //         <div class="video-player player" id="stream-${user.uid}"></div>
// //         </div>`
// //         document.getElementById('user-streams').insertAdjacentHTML('beforeend', videoPlayer)
// //         user.videoTracks.play(`stream-${user.uid}`)
// //     }
// //   if(mediaType === 'audio'){
// //     user.audioTracks.play()
// //   }

// // }

