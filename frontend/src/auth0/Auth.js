import auth0 from 'auth0-js';
import jwtDecode from 'jwt-decode';

const LOGIN_SUCCESS_PAGE = "/";
const LOGIN_FAILURE_PAGE = "/validate";

// const URL = "http://localhost:3000"
// const URL = "https://production-riesgocognitivo.azurewebsites.net"
const CALLBACK_URL = process.env.REACT_APP_CALLBACK_URL
const AUTH0_URL = process.env.REACT_APP_AUTH0_URL
const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID

export default class Auth{
    auth0 = new auth0.WebAuth({
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID,
        redirectUri: CALLBACK_URL,
        audience: AUTH0_URL + "/userinfo",
        roleUrl: AUTH0_URL + "/roles",
        responseType: "token id_token",
        scope: "openid profile"
    });

    constructor(){
        this.login = this.login.bind(this);
    }

    login(){
        // eslint-disable-next-line no-restricted-globals
        this.auth0.authorize()
    }

    logout(){
        // eslint-disable-next-line no-restricted-globals
        location.pathname = "/";
        localStorage.removeItem("acces_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("role");
    }

    handleAuthentication(){
        
        this.auth0.parseHash((err, authResults) =>{
            if (authResults && authResults.accessToken && authResults.idToken){
                let expiresAt = JSON.stringify(authResults.expiresIn) * 1000 + new Date().getTime();
                localStorage.setItem("access_token", authResults.accessToken);
                localStorage.setItem("id_token", authResults.idToken);
                localStorage.setItem("expires_at", expiresAt);
                // eslint-disable-next-line no-restricted-globals
                location.hash = "";
                // eslint-disable-next-line no-restricted-globals
                location.pathname = LOGIN_SUCCESS_PAGE;
            } else if (err){
                // eslint-disable-next-line no-restricted-globals
                location.pathname = LOGIN_FAILURE_PAGE;
                alert(err.errorDescription);
                console.log(err);
            }
        })
    }

    isAuthenticated(){
        let expiresAt = JSON.parse(localStorage.getItem("expires_at"));
        return new Date().getTime() < expiresAt;
    }

    getProfile(){
        
        if(localStorage.getItem("id_token")){
            return jwtDecode(localStorage.getItem("id_token"));

        }else{
            return{};
        }
    }
}
