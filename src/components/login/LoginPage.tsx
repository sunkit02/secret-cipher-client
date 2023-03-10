import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {login} from "../../services/auth-service";
import {JwtTokens, UsernameAndPassword} from "../../models/models";
import {PopUpMessage, PopUpMsgType} from "../../models/popup-models";
import {MessageReceived, MessageSent} from "../../models/message-models";
import {parseErrorMessage} from "../../utils/error-utils";
import PopUpMessageBox from "../popups/PopUpMessage";

interface LoginPageProps {
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    setMessagesSent: React.Dispatch<React.SetStateAction<MessageSent[]>>;
    setMessagesReceived: React.Dispatch<React.SetStateAction<MessageReceived[]>>;
    setJwtTokens: React.Dispatch<React.SetStateAction<JwtTokens | null>>;
}

// todo: implement feature to redirect user back to page requiring login after successful login if was redirected when accessing another page

const LoginPage: React.FC<LoginPageProps> = ({
                                                 setUsername,
                                                 loggedIn,
                                                 setLoggedIn,
                                                 setMessagesSent,
                                                 setMessagesReceived,
                                                 setJwtTokens,
                                             }) => {

    const navigate = useNavigate();

    const [usernameInput, setUsernameInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");

    const [popUpMessage, setPopUpMessage] = useState<PopUpMessage>({type: PopUpMsgType.NONE});

    const formRef = useRef<HTMLFormElement>(null);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        let user: UsernameAndPassword = {
            username: usernameInput.trim(),
            password: passwordInput.trim()
        };
        await login(user)
            .then(loginResponse => {
                console.log(loginResponse.user.username + " logged in successfully!");
                setUsername(usernameInput);
                setLoggedIn(true);
                setMessagesSent(loginResponse.user.messagesSent);
                setMessagesReceived(loginResponse.user.messagesReceived);
                setJwtTokens(loginResponse.tokens);

                // show login success popup message
                setPopUpMessage({
                    type: PopUpMsgType.SUCCESS,
                    message: "Login success!"
                });

                // slow down execution so user can see popup message
                setTimeout(
                    () => {
                        navigate("/message",
                            {
                                replace: true,
                            });
                    }, 300);
            })
            .catch(errorMessage => {
                console.log(errorMessage);

                errorMessage = parseErrorMessage(errorMessage)

                // show error as popup message
                setPopUpMessage({
                    type: PopUpMsgType.ERROR,
                    message: errorMessage,
                });
                // @ts-ignore
                formRef.current.reset();

                // hide popup message
                setTimeout(() => {
                        setPopUpMessage({
                            type: PopUpMsgType.NONE
                        })
                    }
                    , 1500)
            });

    };

    const handleSignUp = () => {
        navigate("/signup")
    }

    return (
        <article className="login">
            <div className="login__form-container gen-container">
                <h2 className="login__form-title"
                >Please Enter</h2>
                <PopUpMessageBox popUpMessage={popUpMessage}/>
                <form
                    className="login__form"
                    ref={formRef}
                    onSubmit={handleLogin}
                >
                    <input
                        className="login__input gen-text-input"
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsernameInput(e.target.value)}/>
                    <input
                        className="login__input gen-text-input"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPasswordInput(e.target.value)}
                    />
                    <button
                        id="login__login-btn"
                        className="login__login-btn gen-btn rounded-btn"
                    >Login
                    </button>
                </form>
                <hr
                    className="login__strike-through"
                    data-content="OR"
                />
                <button
                    id="login__sign-up-btn"
                    className="gen-btn rounded-btn"
                    onClick={handleSignUp}
                >
                    Sign Up
                </button>
            </div>
        </article>
    );
}
// todo: implement more input validation before sending request to server
export default LoginPage;