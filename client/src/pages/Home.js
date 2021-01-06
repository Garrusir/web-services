import React, {useContext} from 'react';
import {Link} from 'react-router-dom';

import { CredentialsContext } from '../App';
import Todos from '../components/Todos';

export default function Home(){
    const [credentials, setCredentials] = useContext(CredentialsContext);


    return (
        <div>
            <h1>Привет  {credentials && credentials.username}!</h1>
            <div className="row">
            {!credentials && <Link to="/register"  style={{'marginRight': 18}}className="waves-effect waves-light btn">Регистрация</Link>}
            {!credentials && <Link to="/login" className="waves-effect waves-light btn">Вход</Link>}
            </div>
            {credentials && <Todos />}
        </div>
        )
}
