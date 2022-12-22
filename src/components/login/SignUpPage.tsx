import React, {useState} from "react";
import {signUp} from "../../api/auth-service";
import {User} from "../../api/models";
import {MsgType, PopUpMessage} from "../../models/models";
import {useNavigate} from "react-router-dom";

const SignUpPage: React.FC = () => {
    let navigate = useNavigate();


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [popUpMessage, setPopUpMessage] = useState<PopUpMessage>({type: MsgType.NONE});
    const [disableSignUpBtn, setDisableSignUpBtn] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPopUpMessage({
               type: MsgType.ERROR,
               message: "Passwords don't match!"
            });
            return;
        }

        let newUser: User = {
            username,
            password
        }

        // todo: disable sign up button
        setDisableSignUpBtn(true);

        await signUp(newUser)
            .then(r => {
                console.log(`Successfully registered user ${r.user.username}`);
                setPopUpMessage({
                    type: MsgType.SUCCESS,
                    message: "Registration successful!"
                });

                setTimeout(() => {
                    navigate("/login");
                }, 500)
            })
            .catch(err => {
                setPopUpMessage({
                    type: MsgType.ERROR,
                    message: err,
                });

                // todo: enable sign up button
                setDisableSignUpBtn(false);

                setTimeout(() => {
                    setPopUpMessage({type: MsgType.NONE})
                }, 1500);
            });
    }

    return (
        <article className="sign-up">
            <div className="sign-up__form-container gen-container">
                <h2 className="sign-up__form-title"
                >Please Fill In</h2>
                {
                    popUpMessage.type === MsgType.NONE
                        ? (<div></div>)
                        : popUpMessage.type === MsgType.ERROR ? (
                            <div className="login__pop-up-message error-message">{popUpMessage.message}</div>
                        ) : (
                            <div className="login__pop-up-message success-message">{popUpMessage.message}</div>
                        )
                }
                <form
                    className="sign-up__form"
                    onSubmit={handleSignUp}
                >
                    <label className="sign-up__label">
                        Username
                        <input
                            className="sign-up__input gen-input"
                            type="text"
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>

                    <label className="sign-up__label">
                        Password
                        <input
                            className="sign-up__input gen-input"
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <label className="sign-up__label">
                        Confirm-password
                        <input
                            className="sign-up__input gen-input"
                            type="password"
                            placeholder="Confirm password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </label>

                    <div className="sign-up__sign-up-btn-container">
                        <button
                            id="sign-up__sign-up-btn"
                            className="sign-up__sign-up-btn gen-btn rounded-btn"
                            disabled={disableSignUpBtn}
                        >
                            <span className="text--nowrap">Sign Up</span>
                        </button>
                    </div>
                </form>
            </div>
        </article>
    );
}

export default SignUpPage;