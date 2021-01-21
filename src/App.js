import './App.css';
import './styles/app.scss'
// import NavBar from './components/Navbar';
// import Player from './components/Player1';
import { useState } from 'react';


import React from "react";
import FilePicker from "./components/FilePicker";
import Status from "./components/Status";
import Player from "./components/Player1";
import Controls from "./components/Controls";
import Trimmer from "./components/Trimmer";
import WebVideo from "./libs/WebVideo";
import webVideoLoader from "./libs/preloadWebVideo";
import Icon from "./components/Icon";
import { noop, arrayBufferToBlob, readBlobURL, download } from "./libs/utils";
import PropTypes from "prop-types";

class ReactVideoTrimmer extends React.PureComponent {
  /**
   * @type {WebVideo}
   */
  webVideo = webVideoLoader({});

  static propTypes = {
    onVideoEncode: PropTypes.func,
    showEncodeBtn: PropTypes.bool,
    timeLimit: PropTypes.number,
    loadingFFMPEGText: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  defaultState = {
    decoding: false,
    encoding: false,
    encoded: false,
    playVideo: false,
    videoDataURL: "",
    videoFrames: [],
    isDecoding: false,
    timeRange: { start: 1, end: this.props.timeLimit || 5000 },
    encodedVideo: null,
    playedSeconds: 0
  };

  state = this.defaultState;

  updateVideoDataURL = dataURL => this.setState({ videoDataURL: dataURL });

  updateVideoFrames = frames => this.setState({ videoFrames: frames });

  updateIsDecoding = state => this.setState({ updateIsDecoding: state });


  decodeVideoFile = (file, doneCB = noop) => {
    // console.log('decoding', file)
    this.setState({ decoding: true });
    const webVideo = this.webVideo;
    webVideo.videoFile = file;
    webVideo
      .decode(file)
      .then(({ blob, arrayBuffer, dataURL }) => {
        this.updateVideoDataURL(dataURL);
        // console.log("data", this.webVideo.videoData)
        const timeRangeStart = this.state.timeRange.start;
        const duration = this.webVideo.videoData.duration;
        const timeLimit = timeRangeStart + (this.props.timeLimit || 5000);
        const timeRangeEnd = duration > timeLimit ? timeLimit : duration;
        // console.log('timeRangeStart', timeRangeStart)
        // console.log('duration', duration)
        // console.log('timeLimit', timeLimit)
        // console.log('timeRangeEnd', timeRangeEnd)
        this.setState({
          timeRange: { start: timeRangeStart, end: timeRangeEnd },
          playedSeconds: (timeRangeEnd - timeRangeStart) / 2 + timeRangeStart
        });
        this.setState({ decoding: false });
        doneCB();
      })
      .catch(e => console.log(e));
  };
  handleFileSelected = file => {
    this.decodeVideoFile(file);
  };

  handleVideoTrim = time => {
    // console.log('handlevideotrim', time);
    this.setState({ timeRange: time });
  };
  
  handleEncodeVideo = timeRange => {
    // console.log('handleEncodeVideo', timeRange);
    this.setState({ encoding: true, videoDataURL: "", playVideo: false });
    const timeDifference = timeRange.end - timeRange.start;
    // console.log(timeRange);
    this.webVideo.trimVideo(timeRange.start, timeDifference);
  };
  handlePlayPauseVideo = () => {
    const { playVideo } = this.state;
    this.setState({ playVideo: !playVideo });
  };
  handlePlayerPause = () => {
    // console.log("pause video");
    this.setState({ playVideo: false });
  };
  handlePlayerPlay = () => {
    this.setState({ playVideo: true });
  };
  handlePlayerProgress = seconds => {
    if (this.state.playVideo) {
      this.setState({ playedSeconds: seconds });
    }
  };
  handleReselectFile = () => {
    this.setState({
      ...this.defaultState,
    });
  };
  VideoPlayerWithTrimmer = ({ showTrimmer }) => {
    const { encoding, videoDataURL } = this.state;
    return (
      <>
        {(
          <Player
            src={this.state.videoDataURL}
            timeRange={this.state.timeRange}
            timeLimit={this.props.timeLimit}
            playVideo={this.state.playVideo}
            onPlayerPlay={this.handlePlayerPlay}
            onPlayerPause={this.handlePlayerPause}
            onPlayerProgress={this.handlePlayerProgress}
          />
        )}
        {showTrimmer && (
          <Trimmer
            onPausePlayer={this.handlePlayerPause}
            showTrimmer={this.state.videoDataURL}
            duration={this.webVideo.videoData.duration}
            onTrim={this.handleVideoTrim}
            timeLimit={this.props.timeLimit}
            timeRangeLimit={this.props.timeRange}
            timeRange={this.state.timeRange}
            currentTime={this.state.playedSeconds}
          />
        )}

        {videoDataURL && (
          <Controls
            onDownload={() => this.handleDownloadVideo(this.state.encodedVideo)}
            showEncodeBtn={this.props.showEncodeBtn}
            onReselectFile={this.handleReselectFile}
            onEncode={() => this.handleEncodeVideo(this.state.timeRange)}
            onPlayPauseClick={this.handlePlayPauseVideo}
            processing={encoding}
            playing={this.state.playVideo}
          />
        )}
      </>
    );
  };

  render() {
    const {
      videoDataURL
    } = this.state;
    return (
      <div className="rvt-main-container">
        { (
          <>
            {!videoDataURL && (
              <FilePicker
                onFileSelected={this.handleFileSelected}
                minSize={this.props.minSize}
                maxSize={this.props.maxSize}
              />
            )}
            {
              videoDataURL && <this.VideoPlayerWithTrimmer showTrimmer={true} />
            }
          </>
        )}
      </div>
    );
  }
}

export const preloadWebVideo = webVideoLoader;

export default ReactVideoTrimmer;





// function App() {
//   const [isVisible, setVisible] = useState(false);
//   return (
//     <div className={`App ${isVisible && `app-push`}`}>
//       <header className="App-header">
//        {/* <NavBar /> */}
//        Video Editor
//       </header>
//       <Player />
//     </div>
//   );
// }

// export default App;
