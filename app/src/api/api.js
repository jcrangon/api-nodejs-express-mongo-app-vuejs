import apiConfig from './config'
import jwt_decode from "jwt-decode"

const api = {
    register: `${apiConfig.authBaseUrl}/register`,
    login: `${apiConfig.authBaseUrl}/login`,
    logout: `${apiConfig.authBaseUrl}/logout`,
    refreshToken: `${apiConfig.authBaseUrl}/refresh-token`,
    addPost: `${apiConfig.postBaseUrl}/add`,
}

const utils = {
  checkLogin: function() {
    const token = localStorage.getItem(apiConfig.tokenName)
    console.log('logged in: ', !(!token) )
    return !(!token);
  },

  truncateString: function(str, num) {
    if (str.length <= num) {
        return str
    }
    return str.slice(0, num) + '...'
  },

  formatDateTime: function(dateTime) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTime).toLocaleDateString('fr-FR', options);
  },

  decodeToken: function() {
    if(this.checkLogin()){
        const token = localStorage.getItem('myblogtoken')
        const decoded = jwt_decode(token)
        console.log(decoded);
        return decoded
    }
    return null
  },

  isMyPost(postUserId) {
    const decoded = this.decodeToken();
    console.log(decoded);
    if(decoded){
        if(postUserId === decoded.sub){
            return true
        }
    }
    return null;
  },
}

export { api, utils }