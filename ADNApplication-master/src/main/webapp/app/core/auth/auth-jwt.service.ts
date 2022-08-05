import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { ApplicationConfigService } from '../config/application-config.service';
import { Login } from 'app/login/login.model';

type JwtToken = {
  id_token: string;
};

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private applicationConfigService: ApplicationConfigService
  ) {}

  getToken(): string {
    const tokenInLocalStorage: string | null = this.localStorageService.retrieve('authenticationToken');
    const tokenInSessionStorage: string | null = this.sessionStorageService.retrieve('authenticationToken');
    return tokenInLocalStorage ?? tokenInSessionStorage ?? '';
  }

  logIntoPlateform(body: any, url: string): void {
    this.http.post(url, body, { observe: 'response' }).subscribe(response => {
      console.log('****Resp***', String(response.headers.get('authorization')).split(' ')[1]);
      localStorage.removeItem('PlatformAPIToken');
      localStorage.setItem('PlatformAPIToken', String(response.headers.get('authorization')));
    });
  }

  login(credentials: Login): Observable<void> {
    // this.logIntoPlateform({username: "nlarguech", password: "larnourhene29057969-11941100", rememberMe: false}, 'https://test.actiaadn.com/public/v1/auth/')
    this.logIntoPlateform({ credentials }, 'https://test.actiaadn.com/public/v1/auth/');
    return this.http
      .post<JwtToken>(this.applicationConfigService.getEndpointFor('api/authenticate'), credentials)
      .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe)));
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      this.localStorageService.clear('authenticationToken');
      this.sessionStorageService.clear('authenticationToken');
      observer.complete();
    });
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    console.log(response.id_token);
    const jwt = response.id_token;
    localStorage.removeItem('authenticationToken');
    localStorage.setItem('authenticationToken', jwt);

    if (rememberMe) {
      this.localStorageService.store('authenticationToken', jwt);
      this.sessionStorageService.clear('authenticationToken');
    } else {
      this.sessionStorageService.store('authenticationToken', jwt);
      this.localStorageService.clear('authenticationToken');
    }
  }
}
