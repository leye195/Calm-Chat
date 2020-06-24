(() => {
  let player,
    volume = document.querySelector(".fas"),
    muted = false;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
      videoId: "G1FWEvmWnEo", // The video id.
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 1, // Autoplay when page loads.
        controls: 0,
        loop: 1,
        fs: 0,
        disablekb: 1,
        cc_load_policty: 0,
        iv_load_policy: 3,
        enablejsapi: 1,
        modestbranding: 1,
        origin: "http://www.localhost:8080",
      },
      events: {
        onReady: function (e) {
          e.target.setVolume(5); // For max value, set value as 100.
        },
      },
    });
  }
  const toggleVolume = () => {
    if (player) {
      if (muted) {
        player.setVolume(15);
        volume.classList.remove("fa-volume-mute");
        volume.classList.add("fa-volume-up");
      } else {
        player.setVolume(0);
        volume.classList.add("fa-volume-mute");
        volume.classList.remove("fa-volume-up");
      }
      muted = !muted;
    }
  };
  const init = () => {
    onYouTubeIframeAPIReady();
    volume.addEventListener("click", toggleVolume);
  };
  init();
})();
