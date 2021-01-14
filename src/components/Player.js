import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import sample from "./video/1280.mp4";
import ReactPlayer from 'react-player';
import Dropzone from "react-dropzone";
// import DragAndDrop from './DragAndDrop';
class Player extends React.Component {

    state = {
        video: "",
        videoPreviewUrl: ""
    }

    onFileChange = (event) => {
        event.preventDefault();
        let reader = new FileReader();
        let file = event.target.files[0];
        console.log(event.target.files[0])
        reader.onloadend = () => {
            this.setState({
                video: file,
                videoPreviewUrl: reader.result
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
                videoPreviewUrl: reader.result
            }, () => console.log(this.state));
        }

        reader.readAsDataURL(file[0])
    }
    render() {
            console.log(this.state)
        return (
            <div className="player-container">
                {/* <input type="file" id="file" onChange={this.onFileChange} /> */}
                {/* <label htmlFor="file">choose a file</label> */}
                <div className="video-player">
                    {/* <video width="750" height="500" controls autoPlay >
                        <source src={this.state.videoPreviewUrl} />
                    </video> */}
                  {
                      this.state.videoPreviewUrl ?   <ReactPlayer
                      url={this.state.videoPreviewUrl}
                      playing = {true}
                      controls = {true}
                      loop = {true}
                      pip = {true}
                      volume = {1}
                  /> : null
                  }
                    {/* <img src ={this.state.videoPreviewUrl}/> */}
                    {/* {this.state.videoPreviewUrl ? (
                        <video
                            id="clip"
                            src={this.state.url}
                            controls
                            autoPlay
                            width="640"
                            height="264"
                        />
                    ) : null} */}
                    {/* or */}
                    <br/>
                    <Dropzone onDrop={this.handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps({ className: "dropzone" })}>
                                <input {...getInputProps()} />
                                <p>Drag'n'drop file, or click to select file</p>
                            </div>
                        )}
                    </Dropzone>
                </div>
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