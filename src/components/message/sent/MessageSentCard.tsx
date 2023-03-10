import React, {useState} from "react";
import {MessageSent} from "../../../models/message-models";
import {getDateString} from "../../../utils/date-utils";
import {IoIosArrowDown} from "react-icons/io";

interface MessageSentCardProps {
    messageSent: MessageSent;
}

const MessageSentCard: React.FC<MessageSentCardProps> = ({messageSent}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [mouseOver, setMouseOver] = useState<boolean>(false);
    const [displayKey, setDisplayKey] = useState<boolean>(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    }

    const toggleKeyDisplayed = () => {
        setDisplayKey(!displayKey);
    }

    if (!isExpanded) {
        // render unexpanded card
        return (
            <div
                className="message__tab__message-card"
                onClick={toggleExpanded}
                onMouseOver={_ => setMouseOver(true)}
                onMouseLeave={_ => setMouseOver(false)}
            >
                <span
                    className="message__tab__message-card__recipient text--nowrap">{messageSent.recipientUsername}</span>
                <span className="message__tab__message-card__subject-message text--nowrap">
                <b>{messageSent.subject}</b>{": " + messageSent.message}
            </span>
                <span
                    className="message__tab__message-card__sent-time text--nowrap">{getDateString(new Date(messageSent.timeSent))}</span>
                {
                    mouseOver ? (<span className="message__tab__message-card__expand-arrow">
                                <IoIosArrowDown
                                    style={{
                                        transition: "0.2s",
                                        transform: "rotate(90deg)"
                                    }}
                                />
                                </span>)
                        : <></>
                }
            </div>
        );
    } else {
        // render expanded card
        return (
            <div className="message__tab__message-card-expanded">
                <div
                    className="message__tab__message-card"
                    onClick={toggleExpanded}
                    onMouseOver={_ => setMouseOver(true)}
                    onMouseLeave={_ => setMouseOver(false)}
                >
                    <span
                        className="message__tab__message-card__recipient text--nowrap"
                    >
                        {"To: " + messageSent.recipientUsername}
                    </span>
                    <span
                        className="message__tab__message-card__subject-message text--nowrap"
                        style={{textAlign: "center"}}
                    >
                        <b>{messageSent.subject}</b>
                    </span>
                    <span
                        className="message__tab__message-card__sent-time text--nowrap">{getDateString(new Date(messageSent.timeSent))}</span>
                    {
                        mouseOver ? (<span className="message__tab__message-card__expand-arrow">
                                        <IoIosArrowDown/>
                                    </span>)
                            : <></>
                    }

                </div>
                <div
                    className="message__tab__message-card-expanded__container"
                >
                    <pre className="message__sent__message-card-expanded__message">{messageSent.message}</pre>
                    <hr
                        className="message__tab__message-card-expanded__strikethrough"
                        data-content="OR"
                    />
                    <div className="message__sent__message-card-expanded__key-container">
                    <span
                        className="message__sent__message-card-expanded__key"
                        onMouseEnter={toggleKeyDisplayed}
                        onMouseLeave={toggleKeyDisplayed}
                    >Encoding Key: {displayKey ? messageSent.key : "(Hover for key)"}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default MessageSentCard;