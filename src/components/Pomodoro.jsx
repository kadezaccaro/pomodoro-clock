import React from "react";
let isTimerRunning = false;

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      time: 1500,
      intervalId: "",
      timerLabel: "Focus",
    };
    this.setBreakDuration = this.setBreakDuration.bind(this);
    this.setSessionDuration = this.setSessionDuration.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.startStopTimer = this.startStopTimer.bind(this);
    this.resetClock = this.resetClock.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
    this.skipPhase = this.skipPhase.bind(this);
    this.toggleIcon = this.toggleIcon.bind(this);
    this.resetIcon = this.resetIcon.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.playSound = this.playSound.bind(this);
    this.switchTimer = this.switchTimer.bind(this);
  }

  // FCC tests require the use of an HTML5 <audio> tag
  // breakAudio = new Audio("sounds/rest-sound.mp3");
  sessionAudio = new Audio("sounds/focus-sound.mp3");

  playSound() {
    const { timerLabel } = this.state;

    this.sessionAudio.currentTime = 0;
    this.breakAudio.currentTime = 0;
    this.sessionAudio.volume = 0.5;
    this.breakAudio.volume = 0.5;
    if (timerLabel === "Focus") {
      this.breakAudio.play();
      this.sessionAudio.pause();
    } else {
      this.sessionAudio.play();
      this.breakAudio.pause();
    }
  }

  setBreakDuration(e) {
    const { breakLength, timerLabel } = this.state;
    const { innerText } = e.target;

    if (!isTimerRunning) {
      if (innerText === "+" && breakLength < 60) {
        this.setState({
          breakLength: breakLength + 1,
        });
      } else if (innerText === "-" && breakLength > 1) {
        this.setState({
          breakLength: breakLength - 1,
        });
      }
      if (timerLabel === "Rest")
        // setState callback prevents lagging one state behind
        this.setState((state) => {
          return { time: state.breakLength * 60 };
        });
    }
  }

  setSessionDuration(e) {
    const { sessionLength, timerLabel } = this.state;
    const { innerText } = e.target;

    if (!isTimerRunning) {
      if (innerText === "+" && sessionLength < 60) {
        this.setState({
          sessionLength: sessionLength + 1,
        });
      } else if (innerText === "-" && sessionLength > 1) {
        this.setState({
          sessionLength: sessionLength - 1,
        });
      }
      if (timerLabel === "Focus") {
        // setState callback prevents lagging one state behind
        this.setState((state) => {
          return { time: state.sessionLength * 60 };
        });
      }
    }
  }

  formatTime() {
    const { time } = this.state;
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  }

  decrementTimer() {
    const { time } = this.state;

    this.setState({ time: time - 1 });
  }

  startStopTimer() {
    const { intervalId } = this.state;

    this.toggleIcon();
    if (!intervalId) {
      const intervalId = setInterval(() => {
        this.decrementTimer();
        this.phaseControl();
      }, 1000);
      this.setState({ intervalId });
      isTimerRunning = true;
    } else {
      clearInterval(intervalId);
      this.setState({ intervalId: "" });
      isTimerRunning = false;
    }
  }

  phaseControl() {
    const { time } = this.state;

    if (time < 0) {
      this.playSound();
      this.changeColor();
      // FCC tests require the timer to continuously run instead of pausing
      // this.resetIcon();
      // clearInterval(intervalId);
      // this.setState({
      //   intervalId: "",
      // });
      this.switchTimer();
    }
  }

  switchTimer() {
    const { timerLabel } = this.state;

    if (timerLabel === "Focus") {
      this.setState((state) => {
        return { time: state.breakLength * 60, timerLabel: "Rest" };
      });
    } else {
      this.setState((state) => {
        return { time: state.sessionLength * 60, timerLabel: "Focus" };
      });
    }
  }

  skipPhase() {
    const { intervalId } = this.state;

    this.playSound();
    this.changeColor();
    this.resetIcon();
    this.switchTimer();
    clearInterval(intervalId);
    this.setState({
      intervalId: "",
    });
    isTimerRunning = false;
  }

  toggleIcon() {
    let playIcon = document.getElementById("play-icon");
    let pauseIcon = document.getElementById("pause-icon");

    if (playIcon.style.display === "block") {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    } else {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
  }

  resetIcon() {
    let playIcon = document.getElementById("play-icon");
    let pauseIcon = document.getElementById("pause-icon");

    if (pauseIcon.style.display === "block") {
      pauseIcon.style.display = "none";
      playIcon.style.display = "block";
    }
  }

  changeColor() {
    const { timerLabel } = this.state;

    if (timerLabel === "Focus") {
      document.body.style.background = "#0fbcf9";
      document.getElementById("timer").style.background = "#0fbcf9";
    } else {
      document.body.style.background = "#05c46b";
      document.getElementById("timer").style.background = "#05c46b";
    }
  }

  resetClock() {
    const { intervalId } = this.state;

    this.resetIcon();
    clearInterval(intervalId);
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      time: 1500,
      timerLabel: "Focus",
      intervalId: "",
    });
    isTimerRunning = false;
    // Default color back to green on reset
    document.body.style.background = "#05c46b";
    document.getElementById("timer").style.background = "#05c46b";
    // FCC tests require audio to be paused and rewound on reset
    this.sessionAudio.pause();
    this.breakAudio.pause();
    this.sessionAudio.currentTime = 0;
    this.breakAudio.currentTime = 0;
  }

  render() {
    return (
      <div>
        <main>
          <div id="pomodoro-timer">
            <section id="timer">
              <p id="timer-label">{this.state.timerLabel}</p>
              <div id="time-left">{this.formatTime()}</div>
            </section>

            <section id="settings">
              <div className="break-settings">
                <p id="break-label">Break</p>
                <div className="dec-inc-container">
                  <button id="break-decrement" onClick={this.setBreakDuration}>
                    -
                  </button>
                  <p id="break-length">{this.state.breakLength}</p>
                  <button id="break-increment" onClick={this.setBreakDuration}>
                    +
                  </button>
                </div>
              </div>

              <div className="session-settings">
                <p id="session-label">Session</p>

                <div className="dec-inc-container">
                  <button
                    id="session-decrement"
                    onClick={this.setSessionDuration}
                  >
                    -
                  </button>
                  <p id="session-length">{this.state.sessionLength}</p>
                  <button
                    id="session-increment"
                    onClick={this.setSessionDuration}
                  >
                    +
                  </button>
                </div>
              </div>
            </section>

            <section id="controls">
              <button id="reset" onClick={this.resetClock}>
                <img
                  id="reset-icon"
                  src="icons/reset-white.svg"
                  alt="reset icon"
                />
              </button>

              <button id="start_stop" onClick={this.startStopTimer}>
                <img
                  style={{ display: "block" }}
                  id="play-icon"
                  src="icons/play-white.svg"
                  alt="play icon"
                />
                <img
                  style={{ display: "none" }}
                  id="pause-icon"
                  src="icons/pause-white.svg"
                  alt="pause icon"
                />
              </button>

              <button id="skip" onClick={this.skipPhase}>
                <img id="skip-icon" src="icons/skip-next.svg" alt="skip icon" />
              </button>
            </section>

            {/* HTML5 <audio> tag is necessary for FCC tests to pass */}
            <audio
              id="beep"
              ref={(audio) => {
                this.breakAudio = audio;
              }}
              src="sounds/rest-sound.mp3"
              type="audio/mpeg"
            />
          </div>
        </main>
      </div>
    );
  }
}

export default Pomodoro;
