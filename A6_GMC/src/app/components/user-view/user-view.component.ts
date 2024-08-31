import { Component, inject } from '@angular/core';
import { Iuser } from '../../interfaces/iuser.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';


@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent {
  user: Iuser | null = null;
  // Vamos a capturar la ruta 
  activatedRoute = inject(ActivatedRoute);
  userService = inject(UsersService);

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      let id = params.id;
      this.user = await this.userService.getUserById(id);
      console.log(this.user)
    })
  }

  async delete(id: string) {
    // Comprobar si es vacia o no !!
    let del = confirm('Seguro que quieres Borrar el empleado cuyo id es :' + id);
    if (del) {
      //lamo al servicio y hago el borrado.
      try {
        const response = await this.userService.deleteUserById(id);
      } catch (error) {
        console.log(error);
      }
    }
  }

}
