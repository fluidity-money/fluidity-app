import {fullpageApi, fullpageOptions} from "@fullpage/react-fullpage"
import {useContext, useEffect, useState} from "react"
import ContactForm from "./ContactForm"
import Header, {FluidityIDOHeader} from "./Header"
import RedeemBox from "./RedeemBox"
import {ScrollContext} from "./scrollContext"
// import {fullpageApi} from '@fullpage/react-fullpage';

// Wrapper component for backers without logos
const GenericBacker = ({name, org}: {name: string, org: string}) => (
  <div className="icon backer-generic flex column">
    <div>{name}</div>
    <div>{org}</div>
  </div>
)

// Manually build the multicoin logo out of their icon svg and text
const MulticoinIcon = () => (
  <span className="flex row" style={{
    height: "80px",
    justifyContent: "center",
  }}>
    <i className="icon multicoin"></i>
    <img
      className="icon"
      style={{
      height: "40px",
      width: "auto",
    }}
      src="/images/Multicoin_Capital_Wordmark_White.png"
    />
  </span>
)

export const LeftPanel = () => {
  return (
      <div className="panel left">
        <div className="section .half">
        <FluidityIDOHeader />
          <div className="text-box" id="left-panel">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis posuere quam. Mauris efficitur volutpat magna, eu elementum augue facilisis a. Nullam venenatis diam dolor. Curabitur sed tellus id est finibus rhoncus. Nam in efficitur tellus. Sed eget luctus tortor, sit amet mollis arcu. Aliquam a sagittis ipsum. Nunc pharetra quam tortor, sodales aliquam nulla dignissim at. Aenean quis velit consequat, dapibus libero vitae, sollicitudin quam. Phasellus sollicitudin dui sit amet nisl congue hendrerit. Nullam non tellus bibendum, dictum ipsum id, placerat urna. Cras mollis interdum mi, a volutpat magna egestas a. Proin sit amet ex eget eros blandit venenatis. Pellentesque convallis eleifend ex eget imperdiet. Mauris eu sapien sit amet tortor bibendum feugiat.<br/><br/>
            Pellentesque facilisis finibus tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nunc odio, porttitor at semper at, volutpat non ligula. Duis vel molestie ipsum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec eu euismod est, nec mattis dolor. Pellentesque sed maximus ex, a pulvinar ligula.

          </div>
          <Header>Backed By</Header>
          <MulticoinIcon/>
          <div className="backer-icon-container">
            <i className="icon solana"/>
            <i className="icon circle"/>
            <img className="icon ngc" src="/images/logo-white.c04176d.png" />
            <img className="icon mycelium" src="/images/mycelium-primary.png" />
            <i className="icon bitscale"/>
            <i className="icon lemniscap"/>
            <GenericBacker name="Ivan" org="Lobster DAO" />
            <GenericBacker name="Igor" org="The Block" />
            <GenericBacker name="Grug" org="Capital"/>
          </div>
        </div>
      <div className="section .half">
        <div className="flex column">
            {/*<Header className="center" id="ido-description">TITLE</Header>*/}
            <div className="text-box" id="ido-description">
              A bit more indepth How this IDO works - The oracle operating and what it means
            </div>
          </div>
        </div>
      <div className="section .full">
        <div className="flex column">
          {/*<Header className="center" id="get-involved">TITLE</Header>*/}
          <div className="text-box" id="get-involved">
            <ul style={{listStyleType: 'none'}}>
              <li>Fluidity is a yield generating protocol for people who won't leave their money idle.<br/>Fluidity rewards people when they actually use their money.</li>
              <li>Fluidity exposes users to defi without requiring them to leave their money idle to generate interest.</li>
              <li>Fluidity takes tokens and wraps them, storing them 1-to-1 in a lending protocol. The interest accruing is the prize pool which can be won by anyone who spends and transfers the token at no fee. </li>
              <li>Fluidity takes no fees. Imagine using your token as you normally would and winning a life-changing amount for your spending habits.</li>
            </ul>
            </div>
          <Header style={{fontSize: "3em", color: "white", fontFamily: 'Manrope, sans-serif', fontWeight: 300}}>Money designed<br /><strong style={{color: "#00DEFF", fontWeight: 'bold'}}>to be moved.</strong></Header>
          <RightPanel/>
          </div>
       </div>
       <ContactForm/>
      </div>
  )
}

  export const RightPanel = ({staticPos = false}: {staticPos?: boolean}) => {
    const {loaded: {index, offset, length}, nowLeaving: {destinationIndex}} = useContext(ScrollContext);
    return staticPos ? (
      <div className="panel right static" style={{
        // transform: offset,
        background: 'none',
        display: index >= length - 1 || destinationIndex === length - 1 ? 'none' : 'flex'
      }}>
        <RedeemBox style={{boxShadow: index === length - 2 && destinationIndex !== length - 3 ? 'none' : '-2px 2px 10px black'}}/>
      </div>
      ) : (
        <div className="panel right" style={{
            transform: offset,
            background: 'none', 
            display: index < length - 2 || destinationIndex === length - 3 ? 'none' : 'flex', 
        }}>
          <RedeemBox/>
        </div>);
 }

export const PanelContainer = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="panel-container">
      {children}
    </div>
  )
}
