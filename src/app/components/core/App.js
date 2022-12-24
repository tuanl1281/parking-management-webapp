import React from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppRouter from 'app/routes/AppRouter';
import {
  InfoModal,
  ErrorModal,
  UploadModal,
  ConfirmModal,
  ForwardModal,
} from 'app/components/shared';

import store from 'app/store';

const StyledToastContainer = styled(ToastContainer)`
  > div {
    border-radius: 0.25rem !important;
  }
  * {
    font-family: Barlow !important;
    font-size: 20px;
  }
`;

const App = () => (
  <Provider store={store}>
    <AppRouter />
    <InfoModal />
    <ErrorModal />
    <ConfirmModal />
    <ForwardModal />
    <UploadModal />
    <StyledToastContainer autoClose={3000} position="bottom-center" />
  </Provider>
);

export default App;
