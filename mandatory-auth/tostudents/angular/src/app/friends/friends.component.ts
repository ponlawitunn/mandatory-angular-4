import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  myFriends;

  constructor(private authService: AuthService) { }



  ngOnInit() {
    this.authService.getFriends(this.myFriends).subscribe((result) => {
      this.myFriends = result;
      console.log('Friends', this.myFriends);
    });
  }

}
