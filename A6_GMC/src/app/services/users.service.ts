import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Ipages } from '../interfaces/ipages.interface';
import { Iuser } from '../interfaces/iuser.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl: string = 'https://peticiones.online/api/users/';

  ///Inyectando httpClient
  private httpClient = inject(HttpClient);


  /**
   * Retrieves a page from the API.
   *
   * This function retrieves the n-th page from the API, with n being the parameter
   * passed to this function.
   *
   * @param n The number of the page to retrieve.
   * @returns A promise that resolves with the retrieved page.
   */
  private getPage(n: number): Promise<Ipages> {
    return firstValueFrom(this.httpClient.get<Ipages>(`${this.apiUrl}?page=${n}`));
  }

  /**
   * Retrieves all users from the API. But we will not need it ...
   *
   * This function retrieves all the users from the API, by getting the first page,
   * and then iterating over the total number of pages, and getting each page.
   *
   * @returns A promise that resolves with an array of all the users.
   */
  async getAllUsers(): Promise<Iuser[]> {
    let users: Iuser[] = [];
    const firstpage = await this.getPage(1); // así nos aseguramos de que funciona si el numero de paginas cambia.
    for (let i = 1; i <= firstpage.total_pages; i++) {
      const page = await this.getPage(i);
      users = users.concat(page.results);
    }
    return users;
  }

  /**
   * Inserts a user into the API.
   *
   * @param bodyuser The user to be inserted.
   * @returns The promise that resolves with the inserted user.
   */
  async insert(bodyuser: Iuser): Promise<Iuser> {
    return firstValueFrom(this.httpClient.post<Iuser>(this.apiUrl, bodyuser));
  }

  /**
   * Updates a user in the API.
   *
   * @param bodyuser The user to be updated. The _id property is removed before
   * sending the request.
   * @returns A promise that resolves with the updated user.
   */
  async update(bodyuser: Iuser): Promise<Iuser> {
    let id = bodyuser._id;
    delete bodyuser._id;
    return firstValueFrom(this.httpClient.put<Iuser>(this.apiUrl + id, bodyuser));
  }

  /**
   * Gets a user by its id.
   * @param id The id of the user to retrieve.
   * @returns A promise that resolves with the retrieved user.
   */
  getUserById(id: string): Promise<Iuser> {
    return firstValueFrom(this.httpClient.get<Iuser>(this.apiUrl + id));
  }

  /**
   * Deletes a user by its id.
   * @param id The id of the user to delete.
   * @returns A promise that resolves with the deleted user.
   */
  deleteUserById(id: string): Promise<Iuser> {
    return firstValueFrom(this.httpClient.delete<Iuser>(this.apiUrl + id));
  }


}














// getTotalPages(): number {
//   let total_pages = 4
//   const firstPage = this.getBasePage().subscribe((data: Ipages) => {
//     total_pages = Number(data.total_pages);
//     console.log(total_pages);
//   });

//   return total_pages;
// }

