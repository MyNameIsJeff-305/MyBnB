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
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const { closeModal } = useModal();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let errors = {};
        if (!validateEmail(email)) {
            errors.email = "Please enter a valid email address.";
        }
        if (username.length < 4) {
            errors.username = "Username must be at least 4 characters long.";
        }
        if (!validatePassword(password)) {
            errors.password = "Password must be at least 6 characters long.";
        }
        if (password !== confirmPassword) {
            errors.confirmPassword = "Confirm Password field must be the same as the Password field";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

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
    };

    useEffect(() => {
        if (
            !email || !username || !firstName || !lastName || !password || !confirmPassword ||
            username.length < 4 || password.length < 6
        ) {
            setIsButtonDisabled(true);
        } else {
            setIsButtonDisabled(false);
        }
    }, [email, username, firstName, lastName, password, confirmPassword]);

    useEffect(() => {
        setEmail("");
        setUsername("");
        setFirstName("");
        setLastName("");
        setPassword("");
        setConfirmPassword("");
        setValidationErrors({});
        setIsButtonDisabled(true);
    }, [closeModal]);

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
                    {validationErrors.email && <p className='error'>{validationErrors.email}</p>}
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
                    {validationErrors.username && <p className='error'>{validationErrors.username}</p>}
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
                    {validationErrors.firstName && <p className='error'>{validationErrors.firstName}</p>}
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
                    {validationErrors.lastName && <p className='error'>{validationErrors.lastName}</p>}
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
                    {validationErrors.password && <p className='error'>{validationErrors.password}</p>}
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
                {validationErrors.confirmPassword && <p className='error'>{validationErrors.confirmPassword}</p>}
                <button id='signup-btn' className="sign-up-btn" type="submit" disabled={isButtonDisabled}>Sign Up</button>
            </form>
        </div>
    );
}

export default SignupFormPage;