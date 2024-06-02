let client = AgoraRTC.createClient({mode : 'rtc', 'codec': "vp8"})

let config = {
    appid: '25256a1b9011466dbf8206c180c014e1',
    token:null,
    uid: null,
    channel: 'livestream',
}
let localTracks = {
    audioTracks: null,
    videoTracks: null,

}
let remoteTracks = {}

document.getElementById('join-btn').addEventListener('click',async () => {
    console.log('User Joined stream')
    await joinStreams()
})

let joinStreams = async () =>{

   // client.on("userr-published", handleuserJoined)

  [config.uid, localTracks.audioTracks, localTracks] = await Promise.all([
      client.join(config.appid, config.channel, config.token || null, config.uid || null),
      AgoraRTC.createMicrophoneAudioTracks(), 
      AgoraRTC.createCameraVideoTracks(),
    ])

let videoPlayer =`<div class="video-containers" id="video-wrapper-${config.uid}"> 
<p class="user-uid">${config.uid}</p>
<div class="video-player player" id="stream-${config.uid}"></div>
</div>`

document.getElementById('user-streams').insertAdjacentHTML('beforeend', videoPlayer)
localTracks.videoTracks.play(`stream-${config.uid}`)
await client.publish([localTracks.audioTracks, localTracks.videoTracks])
}

let handleuserJoined = async (user, mediaType) => {
    console.log('User has joined our stream')
    remoteTracks[user.uid] = user

    await client.subscribe(user, mediaType)
    
    if (mediaType === 'video'){
        let videoPlayer =`<div class="video-containers" id="video-wrapper-${user.uid}"> 
        <p class="user-uid">${user.uid}</p>
        <div class="video-player player" id="stream-${user.uid}"></div>
        </div>`
        document.getElementById('user-streams').insertAdjacentHTML('beforeend', videoPlayer)
        user.videoTracks.play(`stream-${user.uid}`)
    }
  if(mediaType === 'audio'){
    user.audioTracks.play()
  }

}

