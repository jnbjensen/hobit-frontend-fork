/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { API_URL } from 'utils/utils';
import user from 'reducers/user';
import { Styled } from './StartPage.styled';

const StartPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((store) => store.user.accessToken);
  useEffect(() => {
    if (accessToken) {
      navigate('/programs');
    }
  }, [accessToken, navigate])

  const onFormSubmit = (event) => {
    event.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    }
    fetch(API_URL(mode), options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          batch(() => {
            dispatch(user.actions.setUsername(data.response.username));
            dispatch(user.actions.setUserId(data.response.id))
            dispatch(user.actions.setAccessToken(data.response.accessToken));
            dispatch(user.actions.setError(null));
          });
        } else {
          batch(() => {
            dispatch(user.actions.setUsername(null));
            dispatch(user.actions.setUserId(null))
            dispatch(user.actions.setAccessToken(null));
            dispatch(user.actions.setError(data.response));
          });
        }
      })
  }

  return (
    <Styled.Wrapper>
      <Styled.ImageContainer>
        <Styled.StartPageImage src="assets/startpageimg.png" alt="Hiker enjoying the view" />
      </Styled.ImageContainer>
      <Styled.IntroAndLoginContainer>
        <Styled.IntroContainer>
          <Styled.WelcomeHeading>
            Welcome!
          </Styled.WelcomeHeading>
          <Styled.WelcomeText>
            Here is our Intro text!
          </Styled.WelcomeText>
        </Styled.IntroContainer>
        <Styled.LoginContainer>
          <label htmlFor="register">Register</label>
          <input type="radio" id="register" checked={mode === 'register'} onChange={() => setMode('register')} />
          <label htmlFor="login">Login</label>
          <input type="radio" id="login" checked={mode === 'login'} onChange={() => setMode('login')} />
          <form onSubmit={onFormSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Submit</button>
          </form>
        </Styled.LoginContainer>
      </Styled.IntroAndLoginContainer>
    </Styled.Wrapper>
  )
}

export default StartPage;