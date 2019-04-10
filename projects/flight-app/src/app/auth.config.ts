
import { AuthConfig } from 'angular-oauth2-oidc';
 
export const authConfig: AuthConfig = {

  // Wo wollen wir uns authentifizieren?
  issuer: 'https://steyer-identity-server.azurewebsites.net/identity',
 
  // Wer bin ich?
  redirectUri: window.location.origin + '/index.html',
  clientId: 'spa-demo',
 
  // Was will ich (der Client)
  scope: 'openid profile email voucher',
  //             Identity     | Access
  //             ID_Token     | Access_Token
  //             OIDC         | Custom


}