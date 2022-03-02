import Header from "./Header"
import Footer from "./Footer";

const ContactForm = () =>
  <div id="contact-form" className="container full white flex relative section">
    <div className="contact-form">
      <Header className="center bold" id="end-form">Let's Talk</Header>
      <div>Please reach out for any questions and comments.</div>
        <div className="flex" style={{width: '100%', gap: "1em"}}>
          <input className="contact" placeholder="Name"></input>
          <input className="contact" placeholder="fluid@fluiders.com"></input>
        </div>
        <textarea className="contact large" placeholder="Write your message..."></textarea>
        <button className="contact">Submit</button>
        <Footer/>
    </div>
  </div>

export default ContactForm;
