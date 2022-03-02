
import styled from "styled-components";

import { RowOnDesktop, RowCentered } from "../components/Row";
import { Title, Subtitle } from "../components/Titles";
import { Input } from "../components/Input";
import { SubmitButton } from "../components/Buttons";
import {useContext, useState} from "react";
import {submitQuestionRequest} from "../util";
import {notificationContext} from "../components/Notifications/notificationContext";


const LetsTalk = () => {

  const submitQuestion = (
    name: string,
    email: string,
    message: string,
    addNotification: (notification: string) => void,
  ) => {
    submitQuestionRequest(name, email, message)
      .then(() => {
        addNotification("Question submitted sucessfully!");
        // clear form
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch(e => console.error("Failed to submit question!",e));
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const {addNotification} = useContext(notificationContext);

  return <Container>
    <form>
      <LetsTalkTitle>Let's Talk</LetsTalkTitle>

      <LetsTalkSmallContainer>
        <LetsTalkSmall>
          Please reach out if you have any questions and comments
        </LetsTalkSmall>
      </LetsTalkSmallContainer>

      <InputsContainer>
        <InputContainer>
          <RowOnDesktop>
            <LetsTalkInput
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
            />
            <LetsTalkInput
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </RowOnDesktop>
          <MessageContainer>
            <LetsTalkText
              value={message}
              placeholder="Write your message..."
              onChange={e => setMessage(e.target.value)}
            />
          </MessageContainer>
        </InputContainer>

        <RowCentered>
          <SubmitContainer>
            <SubmitButton
              type="button"
              disabled={!name || !email || !message}
              onClick={() => submitQuestion(name, email, message, addNotification)}
            >
              Submit
            </SubmitButton>
          </SubmitContainer>
        </RowCentered>
      </InputsContainer>
    </form>
  </Container>;
}

const Container = styled.div`
  @media not screen and (max-width: 768px) {
    padding-top: 120px;
    padding-bottom: 100px;
  }
`;

const InputsContainer = styled.div`
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const InputContainer = styled.div`
  padding-top: 20px;
`;

const MessageContainer = styled.div`
  padding-top: 40px;
`;

const LetsTalkTitle = styled(Title)`
  text-align: center;
`;

const LetsTalkSmall = styled(Subtitle)`
  text-align: center;
`;

const LetsTalkSmallContainer = styled.div`
  padding-top: 20px;
`;

const LetsTalkInputContainer = styled.div`
  background-color: #333333;
  color: white;
`;

const LetsTalkInput = styled(Input)`
  font-size: 16px;
  padding-left: 10px;

  @media (max-width: 768px) {
    padding-left: 0;
  }

  @media not screen and (max-width: 768px) {
    :nth-child(1) {
      margin-right: 20px;
    }

    :nth-child(2) {
      margin-left: 20px;
    }
  }
`;

const LetsTalkText = styled.textarea`
  width: 100%;
  height: 200px;
  color: #666666;
  background: #333333;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
  border-style: solid;
  border-color: transparent;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  font-size: 16px;
`;

const SubmitContainer = styled.div`
  padding: 30px;
`;

export default LetsTalk;
