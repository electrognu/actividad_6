import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UsersService } from './services/users.service';
import { Iuser } from './interfaces/iuser.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'A6_GMC';
  uServices = inject(UsersService);
  usersArray: Iuser[] = [];
  singleUser!: Iuser;
  deletedUser!: Iuser;

  async ngOnInit() {
    /// pedir datos con observable de mi servicio
    /// metodo observable.
    // this.uServices.getBasePage().subscribe((data: Ipages) => {
    //   console.log(data.total_pages);
    //   console.log(typeof (data));
    // })
    // try {
    //   this.usersArray = await this.uServices.getAllUsers();
    // } catch (error) {
    //   console.log(error);
    // }
    // try {
    //   this.singleUser = await this.uServices.getUserById('63740fede2c75d8744f80a4a');
    // } catch (error) {
    //   console.log(error);
    // }
    // try {
    //   const userToDelete = await this.uServices.getUserById('63740fede2c75d8744f80a4a');
    //   this.deletedUser = await this.uServices.deleteUserById('63740fede2c75d8744f80');
    //   console.log(`User ${this.deletedUser._id} deleted successfully`);
    // } catch (error) {
    //   console.log(error);
    // }



  }





}