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
  // indicates how many users we will serve on each demand of the service, defalut is 8 as asked in the exercice.
  private userPerPageList: number = 8;
  private httpClient = inject(HttpClient);


  /**
   * Sets the number of users that will be returned by the service for each call.
   * If the given number is less than 1, the service will not change the number of users per page.
   * The given number is the number of users that will be returned by the service for each call.
   * @param n number of users to return.
   */
  setUsersPerPage(n: number) {
    if (n > 1) {
      this.userPerPageList = n;
    }
  }

  getDBtotalUsers(): Promise<number> {
    return this.getDBPage(1).then((page: Ipages) => page.total);
  }
  /**
   * Returns a Promise that resolves to an array of Iuser objects.
   * The array is a page of users from the database.
   * The number of users in the array is given by the userPerPageList property of the service.
   * The page number is given by the parameter n.
   * The service ask the database for the page number nPageDB, that is the first page that contains at least one user of the page we want to return.
   * The service take the users from the page nPageDB, and if the number of users in that page is less than the userPerPageList, it ask for the next page and take the rest of users from it.
   * The service return a Promise that resolves to the array of users.
   * @param n number of the page of users to return.
   * @returns Promise that resolves to an array of Iuser objects.
   */
  async getPage(n: number): Promise<Iuser[]> {

    const firstPage = await this.getDBPage(1);
    const nUsersDBpage = firstPage.per_page;                // number of users per page in the database
    console.log('nUsersDBpage: ', nUsersDBpage);
    const nTotalPages = firstPage.total_pages;
    const nTotalUsers = firstPage.total;
    const nTotalVisualPages = nTotalUsers % this.userPerPageList === 0 ? nTotalUsers / this.userPerPageList : Math.trunc(nTotalUsers / this.userPerPageList) + 1;             // total of pages in the database
    console.log('nTotalPages: ', nTotalPages);
    // total of users in the database
    const iniArrL = 1 + (n - 1) * this.userPerPageList;    // iniArray, intermediate variable for calculus
    console.log('iniArrL: ', iniArrL);
    const user1L = (iniArrL % nUsersDBpage);
    console.log('user1L: ', user1L);
    const nPageDB = Math.trunc(iniArrL / nUsersDBpage) + 1; // number of the page we ask to the database.
    console.log('nPageDB: ', nPageDB);
    let nPageDB_Array = (await this.getDBPage(nPageDB)).results;
    console.log('nPageDB_Array: ', nPageDB_Array);
    const utilUsers = nPageDB_Array.length - user1L + 1;
    console.log('utilUsers: ', utilUsers);
    const firstIndex = user1L - 1;
    console.log('firstIndex: ', firstIndex);
    const lastIndex = firstIndex + this.userPerPageList;
    console.log('lastIndex: ', lastIndex);
    if (utilUsers >= this.userPerPageList) { // do we have enought users to return?             
      console.log('Entering first IF ---- so we have enought users to return');
      const ret = nPageDB_Array.slice(firstIndex, lastIndex);
      //console.log('return: ', ret);
      return ret;
    } else if (n <= nTotalVisualPages) {       // we don't have enought user to return, so the are more users in DB (pages)?
      console.log('Entering IF ELSE ----- so n<=nTotalVisualPages = true');
      const nextResults = (await this.getDBPage(nPageDB + 1)).results;
      console.log(nextResults);
      const ret = (nPageDB_Array.concat(nextResults)).slice(firstIndex, lastIndex);
      console.log('return: ', ret);

      return ret
      // take the next and return the array
    } else {
      console.log('Entering to the end of DB ---- n<=nTotalVisualPages = false');
      console.log('n =', n);
      console.log('nTotalVisualPages =', nTotalVisualPages);
      const ret = nPageDB_Array.slice(firstIndex);
      console.log('return: ', ret);
      return ret
    }

    // let usersList: Iuser[] = [];                            // Array a devolver por el mentodo getPage
    // let index_uList = 0;                                    // indice del array usersList para llenarlo con los usuarios de la DB
    // for (let i = (user1L - 1); i < long || i < this.userPerPageList; i++) {             // recorremos el array de la DB desde el primer usuario
    //   console.log(i);
    //   usersList[index_uList] = nPageDB_Array[i];
    //   index_uList++;
    // }
    // const usersLeft = this.userPerPageList - usersList.length;  // number of users felt to fill the array to return.
    // if (usersLeft > 0 && (nPageDB + 1) <= nTotalPages) {
    //   const secondPage = await this.getDBPage(nPageDB + 1);
    //   for (let i = 0; i < usersLeft; i++) {
    //     if (secondPage.results[i]) {
    //       usersList[index_uList] = secondPage.results[i];
    //       index_uList++;
    //     }
    //   }
    // }

    ///return usersList;

  }




  /**
   * Retrieves a page from the API.
   *
   * This function retrieves the n-th page from the API, with n being the parameter
   * passed to this function.
   *
   * @param n The number of the page to retrieve.
   * @returns A promise that resolves with the retrieved page.
   */
  private getDBPage(n: number): Promise<Ipages> {
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
    const firstpage = await this.getDBPage(1); // así nos aseguramos de que funciona si el numero de paginas cambia.
    for (let i = 1; i <= firstpage.total_pages; i++) {
      const page = await this.getDBPage(i);
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

