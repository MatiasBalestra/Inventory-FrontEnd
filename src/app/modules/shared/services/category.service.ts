import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  /**
   *
   * @returns get all categories
   */

  getCategories() {

    const endpoint= `${base_url}/categories`;
    return this.http.get(endpoint);

  }

/**
 * save the categories
 */

saveCategories(body: any) {
  const endpoint = `${base_url}/categories`;
  return this.http.post(endpoint, body);
}


/**
 * update category
 */

updateCategories(body:any, id: any) {
  const endpoint = `${base_url}/categories/${id}` ;
  return this.http.put(endpoint, body);
}

/**
 * delete category
 */

deleteCategory(id:any) {
  const endpoint = `${base_url}/categories/${id}` ;
  return this.http.delete(endpoint, id);
}


/**
 * get categorie by id
 */

getCategoryById(id:any) {
  const endpoint = `${base_url}/categories/${id}` ;
  return this.http.get(endpoint, id);
}

/***
 * export categories
 */

exportCategories() {
  const endpoint = `${base_url}/categories/export/excel` ;
  return this.http.get(endpoint, {
    responseType: 'blob'
  });
}

}

