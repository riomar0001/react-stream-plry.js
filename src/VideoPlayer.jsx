import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Hls from 'hls.js';

const VideoPlayer = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const source =
      'https://fgh5.biananset.net/_v7/fbb29d5d0bc81d66138fa9d978a30bf7a36af8b507380add5975366485836f3876935c90f0f4206f469a29b540cd4fb7a8f1b47400bb8d9aa83e825e0ff1ced5cbffd59429ac0d8a9c80370126b4b5e959c76b89561ec76019fa3c04c31127b9b9fbed6bb60702c2d9edeac99cc21cc146ffb6eb5ad0095c1004471cc65e2325/master.m3u8';
    const videoElement = videoRef.current;

    const defaultOptions = {};

    if (!Hls.isSupported()) {
      videoElement.src = source;
      const player = new Plyr(videoElement, defaultOptions);
    } else {
      const hls = new Hls();
      hls.loadSource(source);

      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        const availableQualities = hls.levels.map((l) => l.height);
        availableQualities.unshift(0);

        defaultOptions.quality = {
          default: 0,
          options: availableQualities,
          forced: true,
          onChange: (e) => updateQuality(e),
        };

        defaultOptions.i18n = {
          qualityLabel: {
            0: 'Auto',
          },
        };

        hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
          var span = document.querySelector(
            ".plyr__menu__container [data-plyr='quality'][value='0'] span"
          );
          if (hls.autoLevelEnabled) {
            span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`;
          } else {
            span.innerHTML = `AUTO`;
          }
        });

        const player = new Plyr(videoElement, defaultOptions);
      });

      hls.attachMedia(videoElement);
      window.hls = hls;
    }

    function updateQuality(newQuality) {
      if (newQuality === 0) {
        window.hls.currentLevel = -1;
      } else {
        window.hls.levels.forEach((level, levelIndex) => {
          if (level.height === newQuality) {
            console.log('Found quality match with ' + newQuality);
            window.hls.currentLevel = levelIndex;
          }
        });
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <div className="container">
      <video
        controls
        ref={videoRef}
        crossorigin
        playsInline
        poster="https://bitdash-a.akamaihd.net/content/sintel/poster.png"
      ></video>
    </div>
  );
};

export default VideoPlayer;
