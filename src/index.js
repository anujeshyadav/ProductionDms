import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Auth0Provider } from "./authServices/auth0/auth0Service";
import config from "./authServices/auth0/auth0Config.json";
import { IntlProviderWrapper } from "./utility/context/Internationalization";
import { Layout } from "./utility/context/Layout";
import * as serviceWorker from "./serviceWorker";
import { store } from "./redux/storeConfig/store";
// import stores from "./Reduxs/Store/Store";
import Spinner from "./components/@vuexy/spinner/Fallback-spinner";
import "./index.scss";
import "./@fake-db";
import App from "./App";
import State from "./context/State";

//const LazyApp = lazy(() => import("./App"));
 
// Active for guwahati

// configureDatabase()
ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin + process.env.REACT_APP_PUBLIC_PATH}
  >
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <State>
          <Layout>
            <IntlProviderWrapper>
              <App />
            </IntlProviderWrapper>
          </Layout>
        </State>
      </Suspense>
    </Provider>
    ,
  </Auth0Provider>,
  document.getElementById("root")
);
serviceWorker.unregister();
