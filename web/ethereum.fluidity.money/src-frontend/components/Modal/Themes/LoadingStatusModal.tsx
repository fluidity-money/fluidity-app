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
  
