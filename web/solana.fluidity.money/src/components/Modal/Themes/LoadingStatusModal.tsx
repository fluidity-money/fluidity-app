// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import ReactDOM from 'react-dom'
  
const LoadingStatusModal = ({enable}: {enable: boolean}) => {
    return enable ? (
      ReactDOM.createPortal(
        <div className="modal-container unpadded">
            {/* 
                Loading Animation Pure CSS
                Creator: Dmitry Rybalko 
                Link: https://codepen.io/Testosterone/pen/ZEKEWEr
            */}
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        </div>,
        document.querySelector("#modal-generic")!
      )
    ) : (
      <></>
    );
};
  
export default LoadingStatusModal;
  
