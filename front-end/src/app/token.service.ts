import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import CryptoJS from 'crypto-js';
import randomString from 'random-string';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  wsseToken: string;

  constructor(private cookieService: CookieService) { }

  hasAuthorization(): Boolean {
    let hasUsername = new Boolean(this.cookieService.get('WSSE-Username'));
    let hasCreated = new Boolean(this.cookieService.get('WSSE-CreatedAt'));
    let hasSecret = new Boolean(this.cookieService.get('WSSE-Secret'));

    return hasUsername && hasCreated && hasSecret;
  }

  getAuthorization(): { username: string, created: string, secret: string } {
    // Generate a new token with new nonce each time otherwise it's a replay attack
    let username = this.cookieService.get('WSSE-Username');
    let created = this.cookieService.get('WSSE-CreatedAt');
    let secret = this.cookieService.get('WSSE-Secret');

    return { username, created, secret };
  }

  getAuthorizationToken(): string | null {
    // Generate a new token with new nonce each time otherwise it's a replay attack
    let username = this.cookieService.get('WSSE-Username');
    let created = this.cookieService.get('WSSE-CreatedAt');
    let secret = this.cookieService.get('WSSE-Secret');

    if (!username || !created || !secret) {
      return null;
    }

    return this.generateWSSEToken(username, created, secret);
  }

  setAuthorizationToken(username: string, created: string, secret: string) {
    // Save static parts of the token
    this.cookieService.set('WSSE-Username', username);
    this.cookieService.set('WSSE-CreatedAt', created);
    this.cookieService.set('WSSE-Secret', secret);
  }

  cleanAuthorizationToken() {
    // Clean token informations
    this.cookieService.delete('WSSE-Username');
    this.cookieService.delete('WSSE-CreatedAt');
    this.cookieService.delete('WSSE-Secret');
  }

  formatDate(d: Date): string {
    // Padding for date creation
    let pad = function (num: number): string {
      return ("0" + num).slice(-2);
    };

    return [
      d.getUTCFullYear(),
      pad(d.getUTCMonth() + 1),
      pad(d.getUTCDate())].join("-") + "T" +
      [pad(d.getUTCHours()),
      pad(d.getUTCMinutes()),
      pad(d.getUTCSeconds())].join(":") + "Z";
  }

  generateWSSEToken(username: string, created: string, secret: string): string {
    if (!username || !created || !secret) {
      throw new Error('missing secret');
    }

    // Should store username and created and secret in localStorage in order to regenerate token
    this.setAuthorizationToken(username, created, secret);

    // Generate nonce
    let nonce = randomString({
      length: 30,
      numeric: true,
      letters: true,
    });


    // Generating digest from secret, creation and nonce
    let hash = CryptoJS.SHA1(nonce + created + secret);
    let digest = hash.toString(CryptoJS.enc.Base64);

    // Base64 Encode digest
    let b64nonce = CryptoJS.enc.Utf8.parse(nonce).toString(CryptoJS.enc.Base64);

    // Return generated token
    return `UsernameToken Username="${username}", PasswordDigest="${digest}", Nonce="${b64nonce}", Created="${created}"`;
  }
}