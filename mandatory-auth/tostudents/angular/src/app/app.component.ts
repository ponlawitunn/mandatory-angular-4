import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import {observable} from "rxjs/symbol/observable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //activeUser: string;
  credentialsFail = false;
  credentials = {
    username: '',
    password: ''
  };
  myFriends;

  constructor(private authService: AuthService) {
    //this.activeUser = this.authService._user ? this.authService._user.name : 'N/A';
  }
  login() {
    // login user using authService.
    //console.log(this.credentials);
    this.authService.login(this.credentials).subscribe(() => {
      console.log('component: ', this.credentials);
    }, (error) => {
      this.credentialsFail = true;
    });

  }
  validForm(){
    return this.credentials.username.length > 3 && this.credentials.password.length > 3;
  }

  logout() {
    this.authService.logout();
    this.myFriends = null;
    // logout user using authService.
  }

  testApi() {
    this.authService.getResource('/friends').subscribe((res: any) => {
      this.myFriends = res;
      console.log(this.myFriends);

    }, (err) => {
      console.error('Got error back', err);
    });
    console.log('got friends', this.myFriends);
    return this.myFriends;
    // test API access by invoking getResource on authService.
  }
}
