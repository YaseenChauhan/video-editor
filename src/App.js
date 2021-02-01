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
import axios from 'axios';

class ReactVideoTrimmer extends React.PureComponent {
  /**
   * @type {WebVideo}
   */
  webVideo = webVideoLoader({});

  static propTypes = {
    timeLimit: PropTypes.number,
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
    timeRange: { start: 1, end: 5000 },
    encodedVideo: null,
    playedSeconds: 0,
    showFile: false,
    sessionId: "",
    videos: [],
    selectedFile: "",
    selectedVideo: ""
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
        const timeRangeStart = this.state.timeRange.start;
        const duration = this.webVideo.videoData.duration;
        const timeLimit = timeRangeStart + (this.props.timeLimit || 5000);
        const timeRangeEnd = duration > timeLimit ? timeLimit : duration;
        this.setState({
          timeRange: { start: timeRangeStart, end: timeRangeEnd },
          playedSeconds: (timeRangeEnd - timeRangeStart) / 2 + timeRangeStart
        });
        this.setState({ selectedVideo: this.webVideo.videoData });
        let video = this.state.videos.find(video => video.name === this.state.selectedFile.name)
        if (!video) {
          video = {};
          video['name'] = this.state.selectedFile.name;
          video['start'] = this.state.timeRange.start;
          video['length'] = this.state.timeRange.end - this.state.timeRange.start;
          this.setState({
            videos: [...this.state.videos, video] 
          }, () => console.log('state', this.state.videos))
        } else {

        }
        doneCB(file);
      })
      .catch(e => console.log(e));
  };

  handleFileSelected = file => {
    this.setState({
      selectedFile: file
    })
    this.uploadVideo(file);
  };

  uploadVideo = (file) => {
    console.log('upload video', file);
      // let formData = new FormData(); 
      //   formData.append(
      //     "videofile", file 
      // ); 
      // formData.append("id", this.state.sessionId);
      // console.log('formData', formData); 
      // const temp = {
      //    "Content-type": "multipart/form-data"
      // }  
      // let uploadUrl = "http://localhost:4000/editor/videothumbnail";
      // axios.post(uploadUrl, formData, {headers: temp})
      // .then(res => {
      //   console.log('reposne', res)
      //   this.decodeVideoFile(file);
      //   // this.setState({
      //   //   showFile: true,
      //   //   sessionId: res.data.data
      //   // })
      // })
      // .catch(err => console.log('error while uploading video', err));

      let options = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST'
      };

      let requestUrl = "http://localhost:4000/editor/videothumbnail";
    
      options.body = new FormData();
      options.body.append("videofile", file);
      options.body.append("id", this.state.sessionId);

    
      return fetch(requestUrl, options)
          .then(response => {
            console.log('resposne', response)
            return response.json()
              .then(responseJson => {
                //You put some checks here
                return responseJson;
              });
          });
  }

  handleVideoTrim = time => {
    console.log('selected', this.state.selectedFile);
    console.log('time', time);
    console.log('videos', this.state.videos);
    this.setState({ timeRange: time });
    let video = this.state.videos.find(video => video.name === this.state.selectedFile.name)
    video['start'] = time.start;
    video['length'] = time.end - time.start;
    console.log('video', video);

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
      showFile: true
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
            onAddQueue={this.addToQueue}
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
            addMore={this.addToQueue}
          />
        )}
      </>
    );
  };

  createStreamId = () => {
    let createUrl = "http://localhost:4000/editor/getvideoid";
    axios.get(createUrl)
    .then(res => {
      console.log('reposne', res)
      this.setState({
        showFile: true,
        sessionId: res.data.data
      })
    })
    .catch(err => console.log('error while creating id', err));
  }

  handleSubmit = () => {

    console.log('videos', this.state.videos)

    // let createUrl = "https://jsonplaceholder.typicode.com/todos/1";

    // axios.post(createUrl, this.state.videos)
    // .then(res => {
    //   alert("successfully submitted")
    // })
    // .catch(err => alert('error while creating id', err));
  }

  addToQueue = () => {
    this.setState({
      showFile: true,
      videoDataURL: "",
      timeRange: { start: 1, end: 5000 }
    })
  }

  render() {
    const {
      videoDataURL, showFile
    } = this.state;
    console.log('time', this.state.timeRange)
    const videoDiv = (
     <>
      <button className="start-button" onClick={this.handleSubmit}>submit</button>
      {/* <button className="start-button" onClick={this.addToQueue}>add to queue</button> */}
      <this.VideoPlayerWithTrimmer showTrimmer={true} />
     </>
    )
    return (
      <div className="rvt-main-container">
        {!showFile && <button className="start-button" onClick={this.createStreamId}>start editing</button>}
        { (
          <>
            {!videoDataURL && showFile && (
              <FilePicker
                onFileSelected={this.handleFileSelected}
                minSize={this.props.minSize}
                maxSize={this.props.maxSize}
              />
            )}
            {
              videoDataURL &&  videoDiv
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
