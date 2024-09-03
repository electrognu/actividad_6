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
  usersPerPage: number = 8; // CHANGING THIS VALUE WILL CHANGE THE NUMBER OF USERS VISUALIZED PER PAGE
  actualPage: number = 1;
  DB_total_users = 1;
  listView_total_pages = 1;


  async ngOnInit() {
    this.uServices.setUsersPerPage(this.usersPerPage);

    try {
      this.DB_total_users = await this.uServices.getDBtotalUsers();
    } catch (error) {
      console.log(error);
    }
    this.listView_total_pages = this.DB_total_users % this.usersPerPage === 0 ? (this.DB_total_users / this.usersPerPage) : Math.trunc(this.DB_total_users / this.usersPerPage) + 1;
    console.log("Numero maxim de pagines:", this.listView_total_pages);
    this.loadPage();
  }



  async loadPage() {
    try {
      this.usersArray = await this.uServices.getPage(this.actualPage);
    }
    catch (error) { console.log(error); }
  }
  nextPage() {
    if (this.actualPage < this.listView_total_pages) {
      this.actualPage++;
      this.loadPage();
    }
  }

  previousPage() {
    if (this.actualPage > 1) {
      this.actualPage--;
      this.loadPage();
    }
  }

}