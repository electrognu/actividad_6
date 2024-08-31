import { Component, Input } from '@angular/core';
import { Iuser } from '../../../interfaces/iuser.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  @Input('userOnCard') user: Iuser | null = null;


  deleteuser(id: string) {
    let borrador = confirm('deseas borrar el empleado con id:' + id)
    console.log("Borrando Usuario");

  }


}
