import Header from "components/Header";
import {useEffect} from "react";

// licensed under creative commons cc0 1.0
// available at https://upload.wikimedia.org/wikipedia/commons/8/83/Error_%2889609%29_-_The_Noun_Project.svg
const exclamationSvg = <svg
   style={{
      fill: "url(#linearColorsRed)",
      paddingRight: "1rem",
      maxHeight: "2rem",
      minWidth: "2rem",
   }}
   xmlns="http://www.w3.org/2000/svg"
   xmlnsXlink="http://www.w3.org/1999/xlink"
   version="1.1"
   x="0px"
   y="0px"
   viewBox="0 0 100 100"
   enable-background="new 0 0 100 100"
   xmlSpace="preserve">
     <linearGradient id="linearColorsRed" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0%" stopColor="#91312C"></stop>
         <stop offset="100%" stopColor="#991d00"></stop>
     </linearGradient>
   <path d="M50,5C25.1,5,5,25.1,5,50c0,24.9,20.1,45,45,45c24.9,0,45-20.1,45-45C95,25.1,74.9,5,50,5L50,5z M55.6,77  c0,3.2-2.5,5.6-5.6,5.6c-3.1,0-5.5-2.5-5.5-5.6v-1.1c0-3.1,2.5-5.6,5.5-5.6c3.1,0,5.6,2.5,5.6,5.6V77z M58.3,26.3l-2.8,34.2  c-0.3,3.2-3,5.4-6.1,5.2c-2.8-0.2-4.9-2.5-5.1-5.2l-2.8-34.2c-0.5-4.5,3.7-8.9,8.2-8.9C54.7,17.4,58.7,21.8,58.3,26.3z" />
</svg>

const checkSvg = <svg
   style={{
      fill: "url(#linearColors)",
      paddingRight: "1rem",
      maxHeight: "2rem",
      minWidth: "2rem",
   }}
   xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
  {/* Circle gradient colour toggle*/}
  <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#16899B"></stop>
      <stop offset="100%" stopColor="#02F5A3"></stop>
  </linearGradient>
  <circle className="checkmark-notification-circle" cx="26" cy="26" r="25" strokeWidth="0px">
  </circle>
  <path className="checkmark" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
</svg>

// https://icons8.com/icons/set/info
const loadingSvg = <svg style={{
     paddingRight: "1rem",
     height: "auto",
     width: "auto",
     maxHeight: "2rem",
     minWidth: "2rem",
  }}
  fill= "url(#linearColorsLoading)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="52px" height="52px" >
  <linearGradient id="linearColorsLoading" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#5259ff"></stop>
      <stop offset="100%" stopColor="#02e6f5"></stop>
  </linearGradient>
  <path d="M13,17h-2v-6h2V17z M13,9h-2V7h2V9z" />
  <path fill="none" stroke="url(#linearColorsLoading)" stroke-miterlimit="10" stroke-width="2" d="M12 3A9 9 0 1 0 12 21A9 9 0 1 0 12 3Z" />
  <style type="text/css" id="igtranslator-color" />
</svg>;

const PopupNotification = ({isEnabled, remove, message, type}: {isEnabled: boolean, remove: (event?: unknown) => void, message: string, type: 'Error' | 'Check' | 'Static'}) => {
    useEffect(() => {
        // After 6 seconds, auto-dismiss
        if (isEnabled && type !== 'Static') {
            // sendNotification("Fluidity", message)
            setTimeout(() => {
                remove();
            }, 6000);
        }
    }, [isEnabled]);

    return (
      <div 
        className={`notification-body ${isEnabled ? 'slideIn' : 'slideOut'}`}
        onClick={() => type === 'Static' ? 0 : remove()}
      >
        {type === 'Error' ? exclamationSvg : type === 'Static' ? loadingSvg : checkSvg}
        <div>
          {type === 'Error' && 
            <Header type="left error" size="small">Error!</Header>
          }
          <div>{message}</div>
        </div>
      </div>
   )
}

export default PopupNotification
