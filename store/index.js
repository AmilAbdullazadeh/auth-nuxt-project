import Vuex from "vuex";
import Cookie from "js-cookie";
import axios from "axios";

const createStore = () => {
  return new Vuex.Store({
    state: {
      authKey: null,
      // expiresIn: null
    },

    mutations: {
      setAuthKey(state, authKey) {
        state.authKey = authKey;
      },
      clearAuthKey(state) {
        Cookie.remove("authKey");
        Cookie.remove("expiresIn");

        if (process.client) {
          localStorage.removeItem("authKey");
          localStorage.removeItem("expiresIn");
        }
        state.authKey = null;
      }
    },

    actions: {
      nuxtServerInit(vuexContext, context) {},
      initAuth(vuexContext, req) {
        let token;
        let expiresIn;

        if (req) {
          // server
          if (!req.headers.cookie) {
            return;
          }

          // token aliriq cookie'den
          token = req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith("authKey="));
          if (token) {
            token = token.split("=")[1];
          }

          expiresIn = req.headers.cookie.split(";").find(exp => exp.trim().startsWith("expiresIn="))
          if(expiresIn) {
            expiresIn = expiresIn.split("=")[1]
          }
        }

        else {
          // client
          token = localStorage.getItem("authKey");
          expiresIn = localStorage.getItem("expiresIn");
          if ( new Date().getTime()  > +expiresIn || !token) {
            vuexContext.commit("clearAuthKey");
          }
        }
        vuexContext.commit("setAuthKey", token);
      },
      authUser(vuexContext, authData) {
        let authLink = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

        if (authData.isUser) {
          authLink = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
        }

        return axios.post(authLink + process.env.fireBaseAPIKey,
            {email: authData.user.email, password: authData.user.password, returnSecureToken: true}
        ).then(res => {
          console.log(res);

          // let expiresIn = new Date().getTime() + 5000 ;
          let expiresIn = new Date().getTime() + +res.data.expiresIn * 1000 ;

          Cookie.set("authKey", res.data.idToken);
          Cookie.set("expiresIn", expiresIn);

          localStorage.setItem("authKey", res.data.idToken);
          localStorage.setItem("expiresIn", expiresIn);

          vuexContext.commit("setAuthKey", res.data.idToken);
        })
      },
      logout(vuexContext) {
        vuexContext.commit("clearAuthKey");
      },

    },

    getters: {
      isAuthenticated(state) {
        return state.authKey != null;
      },
      getAuthKey(state) {
        return state.authKey;
      }
    }
  });
};

export default createStore;
