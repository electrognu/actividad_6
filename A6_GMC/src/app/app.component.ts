import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersService } from './services/users.service';
import { Iuser } from './interfaces/iuser.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'A6_GMC';
  uServices = inject(UsersService);
  usersArray: Iuser[] = [];

  async ngOnInit() {
    /// pedir datos con observable de mi servicio
    /// metodo observable.
    // this.uServices.getBasePage().subscribe((data: Ipages) => {
    //   console.log(data.total_pages);
    //   console.log(typeof (data));
    // })
    try {
      this.usersArray = await this.uServices.getAllUsers();
    } catch (error) {
      console.log(error);
    }
  }





}