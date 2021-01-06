import React, {useState, useContext} from 'react';
import { useHistory } from "react-router-dom";
import { CredentialsContext } from "../App";

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [, setCredentials] = useContext(CredentialsContext)

    const handleErrors = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    let history = useHistory();

    const register = () => {
        setIsError(false);
        fetch(`http://localhost:4000/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            })
        })
            .then(handleErrors)
            .then(() => {
                setCredentials({
                    username,
                    password,
                });

                history.push("/");
            })
            .catch(() => {
                setIsError(true);
            })
    }
    return (
        <div className="container">
            <div className="row">
                <h1> Регистрация </h1>
            </div>
            <div className="row">
                <form className="col s4 offset-s4">
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                            onChange={(e) => setUsername(e.target.value)}
                            id="login"
                            type="text"
                            placeholder="Логин"
                            className="validate"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            type="password"
                            placeholder="Пароль"
                            className="validate"/>
                        </div>
                    </div>
                </form>
            </div>
            <div className="row">
                <div
                disabled={!username.length || !password.length}
                href="/#"
                className="waves-effect waves-light btn"
                onClick={register}>Заегрестрироваться</div>
            </div>
            <div className="row">
                { isError && <strong style={{color: 'red'}}>  Ошибка регистрации </strong> }
            </div>
        </div>
)
}
