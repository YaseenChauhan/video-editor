import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import ReactPlayer from 'react-player';
import Dropzone from "react-dropzone";
// import DragAndDrop from './DragAndDrop';
import ReactVideoTrimmer from "react-video-trimmer";
import "react-video-trimmer/dist/style.css";
import Slider from "./Slider";
class Player extends React.Component {

    state = {
        video: "",
        videoPreviewUrl: "",
        videoLoaded : false,
        value: { min: 2, max: 10 }
    }
    pl = React.createRef();
    images = [];
    onFileChange = (event) => {
        event.preventDefault();
        let reader = new FileReader();
        let file = event.target.files[0];
        // console.log(event.target.files[0])
        reader.onloadend = () => {
            this.setState({
                video: file,
                videoPreviewUrl: reader.result,
                videoLoaded: true
            }, () => console.log(this.state));
        }

        reader.readAsDataURL(file)
    }

    handleDrop = (file) => {
        console.log(file);
        console.log(typeof file[0])
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({
                video: file[0],
                videoPreviewUrl: reader.result,
                videoLoaded: true,
                percentagePlayed : 0
            }, () => console.log(this.state));
        }

        reader.readAsDataURL(file[0])
    }

    onSeek = (data) => {
        console.log('on dseek', data)
    }

    onProgress = (data) => {
        // console.log('progress', data);
        // console.log('rfe', this.pl.current.getDuration())
        let percentage = ( data / this.pl.current.getDuration() ) * 100;
        this.setState({
            percentagePlayed: data.played * 100
        }, () => console.log(this.state))
        // $("#custom-seekbar span").css("width", percentage+"%");
    }

    onDuration = (data) => {
        console.log('onDuration', data);
    }

    onBuffer = (data) => {
        console.log('onBuffer', data);
    }

    onBufferEnd = (data) => {
        console.log('onBufferEnd', data);
    }
    count = 0;

    handleTimeUpdate = (event) => {
        // console.log('data', event.target)
        let totalDuration = this.pl.current.duration;
        // let noOfFrame = totalDuration / 10;
        // if (this.count <= noOfFrame) {
        //     this.capture();
        //     this.count++;
        // }
        this.capture();
    }

    capture = () => {
        var canvas = document.getElementById('canvas');
        var video = document.getElementById('video');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        console.log('duration', video.duration);

        canvas.toBlob(this.saveFrame, 'image/jpeg');
       
    }

        saveFrame = (blob) => {
        this.images.push(blob);
      }

      revokeURL = (e) =>  {
        URL.revokeObjectURL(this.pl.current.src);
      }

      onend = (e) => {
        console.log('images', this.images);
        var img;
        // do whatever with the frames
        for (var i = 0; i < this.images.length; i++) {
          img = new Image();
          img.onload = this.revokeURL;
          img.src = URL.createObjectURL(this.images[i]);
          document.body.appendChild(img);
        }
        // we don't need the video's objectURL anymore
        URL.revokeObjectURL(this.src);
      }

      async extractFramesFromVideo(videoUrl, fps=25) {
          console.log('called')
        return new Promise(async (resolve) => {
      
          // fully download it first (no buffering):
          let videoBlob = await fetch(videoUrl).then(r => r.blob());
          let videoObjectUrl = URL.createObjectURL(videoBlob);
          let video = document.createElement("video");
      
          let seekResolve;
          video.addEventListener('seeked', async function() {
            if(seekResolve) seekResolve();
          });
      
          video.src = videoObjectUrl;
      
          // workaround chromium metadata bug (https://stackoverflow.com/q/38062864/993683)
          while((video.duration === Infinity || isNaN(video.duration)) && video.readyState < 2) {
            await new Promise(r => setTimeout(r, 1000));
            video.currentTime = 10000000*Math.random();
          }
          let duration = video.duration;
      
          let canvas = document.createElement('canvas');
          let context = canvas.getContext('2d');
          let [w, h] = [video.videoWidth, video.videoHeight]
          canvas.width =  w;
          canvas.height = h;
      
          let frames = [];
          let interval = 1 / fps;
          let currentTime = 0;
      
          while(currentTime < duration) {
            video.currentTime = currentTime;
            await new Promise(r => seekResolve=r);
      
            context.drawImage(video, 0, 0, w, h);
            let base64ImageData = canvas.toDataURL();
            frames.push(base64ImageData);
      
            currentTime += interval;
          }
          console.log('frames', frames);
          resolve(frames);
        });
    };

    extractFrames = (url) => {
        this.extractFramesFromVideo(url)
        .then(data => console.log('data', data))
    }

    seekto = (e) => {
        this.pl.current.seekTo(20, "seconds");
    }


    render() {
            console.log(this.state)
            const loaded = this.state.videoLoaded;
        return (
            <div className="player-container">
                {/* <div className={`drop-container ${loaded && "left-align"}`}>
                    <Dropzone onDrop={this.handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps({ className: "dropzone" })}>
                                <input {...getInputProps()} />
                                <p>Drag'n'drop file, or click to select file</p>
                            </div>
                        )}
                    </Dropzone>
                </div> */}
                <div className="video-player">
                  {/* {
                      this.state.videoPreviewUrl ?   <ReactPlayer
                      ref = {this.pl}
                      url={this.state.videoPreviewUrl}
                      playing = {true}
                      controls = {true}
                      loop = {true}
                      pip = {true}
                      volume = {1}
                      onSeek = {this.onSeek}
                      onProgress = {this.onProgress}
                      onDuration = {this.onDuration}
                      onBuffer = {this.onBuffer}
                      onBufferEnd = {this.onBufferEnd}
                  /> : null
                  } */}

      {/* <Slider /> */}
      {/* <button onClick={this.seekto}> seeekto</button> */}
                

                    {/* {
                        this.state.videoPreviewUrl ?
                            <video id="video" width="400" controls ref={this.pl} onTimeUpdate={this.handleTimeUpdate}
                                onEnded={this.onend} onLoadedMetadata={ () => this.extractFrames(this.state.videoPreviewUrl)}>
                                <source src={this.state.videoPreviewUrl} type="video/mp4" />
                            </video> : null
                    } */}

                    {/* {
                        this.state.videoPreviewUrl ?
                            <div id="custom-seekbar" className="custom-seekbar" style={{width: this.state.percentagePlayed + "%"}}>
                            </div> : null
                    } */}

                    {/* {
                        this.state.videoPreviewUrl ?
                            <div id="custom-seekbar" className="custom-seekbar">
                            </div>
                        : null
                    } */}
                    {/* <InputRange
                        maxValue={20}
                        minValue={0}
                        value={this.state.value}
                        onChange={value => this.setState({ value })} /> */}

                    {/* <button onClick={this.capture}>Capture</button> */}
                    {/* <canvas id="canvas" style={{ overFlow: "auto" }}></canvas> */}
                </div>
                <ReactVideoTrimmer
                    loadingFFMPEGText="Loading required libs..."
                    timeLimit={300}
                    timeRange={2}
                    // showEncodeBtn
                />
                
            </div>
        )
    }
}

export default Player;





// const Player = (props) => {

//     const handleTimeUpdate = () => {
//         console.log("handleTimeUpdate");
//     }

//     const skipSong = () => {
//         console.log("skipSong");
//     }

//     const VIDEOS = {
//         deer: 'https://s3.amazonaws.com/codecademy-content/courses/React/react_video-fast.mp4',
//         snail: 'https://s3.amazonaws.com/codecademy-content/courses/React/react_video-slow.mp4',
//         cat: 'https://s3.amazonaws.com/codecademy-content/courses/React/react_video-cute.mp4',
//         spider: 'https://s3.amazonaws.com/codecademy-content/courses/React/react_video-eek.mp4'
//       };

//     return (
//         // <div className="player-container">
//         //     <div className="video-control">
//         //         <p>initial</p>
//         //         <div className="track">
//         //         <input type="range" id="volume" name="volume"
//         //  min="0" max="11" />
                    
//         //             <div className="animate-track" style={{ transform: `translateX(${5}%)` }}></div>
//         //         </div>
//         //         <p>end</p>
//         //     </div>
//         //     <div className="player-control">
//         //         <FontAwesomeIcon icon={faAngleLeft} size="2x"/>
//         //         <FontAwesomeIcon icon={ 5 > 3 ? faPause : faPlay } size="2x" />
//         //         <FontAwesomeIcon icon={ faAngleRight } size="2x" />
//         //     </div>
//         // </div>
//         <div>
//             <video width="750" height="500" controls autoPlay loop >
//       <source src={sample} type="video/mp4"/>
//      </video>
//         </div>
//     )
// }