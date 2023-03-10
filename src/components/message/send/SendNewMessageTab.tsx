import React, {useEffect, useRef, useState} from "react";
import {MessageSent} from "../../../models/message-models";
import {sendNewMessage} from "../../../services/message-service";
import {PopUpMessage, PopUpMsgType} from "../../../models/popup-models";
import {SendNewMessageRequest} from "../../../models/payload-models";
import {parseErrorMessage} from "../../../utils/error-utils";
import {JwtTokens} from "../../../models/models";
import PopUpMessageBox from "../../popups/PopUpMessage";

interface SendNewMessageTabProps {
    username: string;
    messagesSent: MessageSent[];
    setMessagesSent: React.Dispatch<React.SetStateAction<MessageSent[]>>;
    jwtTokens: JwtTokens | null;
}

const SendNewMessageTab: React.FC<SendNewMessageTabProps> = ({
                                                                 username,
                                                                 messagesSent,
                                                                 setMessagesSent,
                                                                 jwtTokens,
                                                             }) => {
    const [popUpMessage, setPopUpMessage] = useState<PopUpMessage>({type: PopUpMsgType.NONE});

    const [recipient, setRecipient] = useState<string>("");
    const [encodingKey, setEncodingKey] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

    const formRef = useRef<HTMLFormElement>(null);
    const recipientInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        recipientInputRef.current?.focus();
    }, [])

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let newMessage: SendNewMessageRequest = {
            senderUsername: username.trim(),
            recipientUsername: recipient.trim(),
            key: encodingKey.trim(),
            subject: subject.trim(),
            message: message.trim()
        };

        setIsSendingMessage(true);
        setTimeout(() => {
            sendNewMessage(newMessage, jwtTokens?.accessToken)
                .then(message => {
                    console.log("Message sent successfully!")
                    console.log(message)
                    setMessagesSent([...messagesSent, message]);
                    // @ts-ignore
                    formRef.current.reset();
                    setRecipient("");
                    setEncodingKey("");
                    setSubject("");
                    setMessage("");
                    setPopUpMessage({
                        type: PopUpMsgType.SUCCESS,
                        message: "Message sent successfully!"
                    });

                    setIsSendingMessage(false);
                    recipientInputRef.current?.focus();

                    setTimeout(() => {
                        setPopUpMessage({type: PopUpMsgType.NONE})
                    }, 3000)

                })
                .catch(errorMessage => {
                    console.log(errorMessage)

                    errorMessage = parseErrorMessage(errorMessage);

                    setPopUpMessage({
                        type: PopUpMsgType.ERROR,
                        message: errorMessage
                    });

                    setIsSendingMessage(false);
                    recipientInputRef.current?.focus();

                    setTimeout(() => {
                        setPopUpMessage({type: PopUpMsgType.NONE})
                    }, 3000);
                });
        }, 500)
    }


    return (
        <section className="message__send-new__container">
            <h3 className="message__send-new__title">
                New Message</h3>
            <PopUpMessageBox popUpMessage={popUpMessage}/>
            <form
                ref={formRef}
                className="message__send-new__message-form"
                onSubmit={handleSendMessage}
            >

                <input
                    ref={recipientInputRef}
                    type="text"
                    name="recipient-username"
                    placeholder="Recipient"
                    className="message__send-new__input gen-text-input"
                    onChange={e => setRecipient(e.target.value)}
                />
                <input
                    type="text"
                    name="key"
                    placeholder="Encoding key"
                    className="message__send-new__input gen-text-input"
                    onChange={e => setEncodingKey(e.target.value)}
                />
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    className="message__send-new__input gen-text-input"
                    onChange={e => setSubject(e.target.value)}
                />
                <textarea
                    name="message"
                    placeholder="Message content ..."
                    className="message__send-new__input-textarea gen-text-input"
                    onChange={e => setMessage(e.target.value)}
                />
                <button
                    className="message__send-new__send-btn
                                gen-btn rounded-btn"
                    disabled={isSendingMessage}
                >{
                    isSendingMessage
                        ? "Sending Message..."
                        : "Send Message"
                }
                </button>
            </form>
        </section>
    );
}

export default SendNewMessageTab;