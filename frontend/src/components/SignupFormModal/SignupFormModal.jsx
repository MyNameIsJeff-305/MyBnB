import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormPage() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const { closeModal } = useModal();

    useEffect(() => {
        const isFormValid = () => {
            return email && username.length >= 4 && firstName && lastName && password.length >= 6 && confirmPassword;
        };
        setIsSubmitDisabled(!isFormValid());
    }, [email, username, firstName, lastName, password, confirmPassword]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setValidationErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data?.errors) {
                        setValidationErrors(data.errors);
                    }
                });
        }
        return setValidationErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };

    return (
        <div className='main-container'>
            <form onSubmit={handleSubmit} className='signup-form'>
                <h1>Sign Up</h1>
                <div className='signup-items'>
                    <label id='labels'>
                        Email
                        <input
                            className='input'
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    {validationErrors.email && <p>{validationErrors.email}</p>}
                    <label id='labels'>
                        Username
                        <input
                            className='input'
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                    {validationErrors.username && <p>{validationErrors.username}</p>}
                    <label id='labels'>
                        First Name
                        <input
                            className='input'
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </label>
                    {validationErrors.firstName && <p>{validationErrors.firstName}</p>}
                    <label id='labels'>
                        Last Name
                        <input
                            className='input'
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </label>
                    {validationErrors.lastName && <p>{validationErrors.lastName}</p>}
                    <label id='labels'>
                        Password
                        <input
                            className='input'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    {validationErrors.password && <p>{validationErrors.password}</p>}
                    <label id='labels'>
                        Confirm Password
                        <input
                            className='input'
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                {validationErrors.confirmPassword && <p>{validationErrors.confirmPassword}</p>}
                <button id='signup-btn' className="sign-up-btn" type="submit" disabled={isSubmitDisabled}>Sign Up</button>
            </form>
        </div>
    );
}

export default SignupFormPage;
