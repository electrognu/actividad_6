import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Iuser } from '../../interfaces/iuser.interface';
import { UserCardComponent } from './user-card/user-card.component';

@Component({
  selector: 'app-list-view',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './listView.component.html',
  styleUrl: './listView.component.css'
})



export class ListViewComponent {
  uServices = inject(UsersService);
  usersArray: Iuser[] = [];
  async ngOnInit() {
    try {
      this.usersArray = await this.uServices.getAllUsers();
    } catch (error) {
      console.log(error);
    }

  }

}