import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


// ...
interface AuthResponse {
  token: string;
}

interface User {
  sub: string;
  name: string;
}
interface Friends {
  name: string,
  myDesc: string;
}

// ...
@Injectable()
export class AuthService {

  // the decoded token if the user has been authenticated, carrying information about the user.
  _user: User;
  _friends: Friends;
  token;
  // inject the HttpClient service.
  constructor(private http: HttpClient, private router: Router) {
    if (localStorage.getItem('user')){
      this.token = localStorage.getItem('user');
      this._user = jwt_decode(this.token);
      console.log(this._user);
    }
    // perform any logic upon application startup here...
  }

  // ...
  // The following computed properties may come in handy in the markup in your template...
  get user() {
    return this._user;
  }

  get authenticated() {
    return this._user !== undefined;
  }

  // use this method to catch http errors.
  handleError(error: HttpErrorResponse) {
    return Observable.throw({
      error: error.error
    });
  }

  login(credentials) {
    // invoke the relevant API route for authenticating the user with the given credentials and return an observable
    // of a User object (= decoded token).
    console.log('log from auth service: ', credentials);
    const ob = this.http.post("/login", credentials);
    ob.subscribe((result: any) => {
      this.token = result.token;
      const decoded = jwt_decode(this.token);
      this._user = decoded;
      localStorage.setItem('user', this.token);
      this.router.navigate(['/friends']);
    }, (error) => {
      console.error('Failed to login', error);
    });
    console.log(status);
    // Make sure to handle a successful authentication by storing and also decoding the returned token, as well as
    // catching http errors.
    // return ...
    return ob;
  }

  logout() {
    this._user = null;
    localStorage.removeItem('user');
    this.router.navigate(['/']);
    this._friends = null;
    // logout the current user by removing the corresponding token.
  }

  getFriends(friends){
    const ob = this.http.get("/friends", friends);
    ob.subscribe((result: any) => {
      this._friends = result.friends;
    });
    console.log('service friends', this._friends);
    return ob;
  };

  getResource(resource): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    };
    const ob = this.http.get<any>(resource, options);
    ob.subscribe((res) => {
      this._friends = res;
    });
    // invoke a protected API route by including the Authorization header and return an Observable.
    // If e.g. invoking /api/friends, the 'resource' parameter should equal 'friends'.
    // return ...
    return ob;
  }
}


/*
const ob = this.http.get("/friends", resource);
    ob.subscribe((result: any) => {
      let friends: any[];
      friends = Array.of(result.json());
      console.log(friends);
    }, (error) => {
      console.log(error);
    });
    console.log(status);
    console.log(ob);
    return ob;
* */
