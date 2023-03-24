console.log("This is the page.js file in action");
console.log("Clicking the button now to scroll...");

const waitForElement = async (selector) => {
  while (document.querySelector(selector) === null) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return document.querySelector(selector);
};

const handleVideo = (videoElement, buttonElement) => {
  console.log("Video element found");

  let currentPercentage = 0; // initialize percentage to 0
  const handleTimeUpdate = () => {
    const time = videoElement.currentTime;
    const duration = videoElement.duration;
    const percentage = (time / duration) * 100;
    console.log(`Time: ${time} s, Duration: ${duration} s, Percentage: ${percentage}%`);

    if (isNaN(duration)) {
      console.log("Duration is NaN, waiting for video to load...");
      setTimeout(() => handleVideo(videoElement, buttonElement), 1000); // try again in 1 second
      // return; // wait for duration to become valid
    }

    if (percentage >= 99.5) {
      console.log("Video ended, clicking right arrow button...");
      buttonElement.click(); // click the right arrow button to scroll to the next video

      waitForElement('video').then((nextVideoElement) => {
        waitForElement('button[data-e2e="arrow-right"]').then((nextButtonElement) => {
          handleVideo(nextVideoElement, nextButtonElement); // recursively handle the next video
        });
      });
    }

    currentPercentage = percentage; // update current percentage
  };

  const handleVideoClick = () => {
    console.log("Video clicked!");
  };

  videoElement.addEventListener('timeupdate', handleTimeUpdate);
  videoElement.addEventListener('click', handleVideoClick);

  const handleScroll = () => {
    if (currentPercentage < 99.5) {
      console.log("Scroll detected, cancelling current handling of video...");
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('click', handleVideoClick);
      window.removeEventListener('scroll', handleScroll);

      waitForElement('video').then((nextVideoElement) => {
        waitForElement('button[data-e2e="arrow-right"]').then((nextButtonElement) => {
          handleVideo(nextVideoElement, nextButtonElement); // recursively handle the new video
        });
      });
    }
  };

  window.addEventListener('scroll', handleScroll);
};

waitForElement('button[data-e2e="arrow-right"]').then((buttonElement) => {
  console.log("Right arrow button found");
  waitForElement('video').then((videoElement) => {
    handleVideo(videoElement, buttonElement); // handle the first video
  });
});
