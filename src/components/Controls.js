import React from "react";
import Icon from "./Icon";

const Controls = ({
  onPlayPauseClick,
  playing,
  onReselectFile,
  addMore,
  processing,
  onEncode,
  showEncodeBtn,
  canDownload,
  onDownload
}) => {
  return (
    <div className="rvt-controls-cont">
      <a
        className="rvt-controller-item"
        title="Pause"
        onClick={onPlayPauseClick}
      >
        <Icon name={playing ? "pause" : "play"} />
      </a>

      <a
        className="rvt-controller-item"
        title="Select File"
        onClick={onReselectFile}
      >
        <Icon name="music" />
      </a>
      <a className="rvt-controller-item" 
        title="add more"
        onClick={addMore}>
          Add More
      </a>
    </div>
  );
};

export default Controls;
