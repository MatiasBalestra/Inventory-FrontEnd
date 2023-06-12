import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  constructor(private categoryService: CategoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getCategories();
  }

  displayColums: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  getCategories() {
    this.categoryService.getCategories()
    .subscribe( (data: any) => {
      console.log( "respuesta categories: ", data)
      this.processCategoriesResponse(data);
    }, (error: any) => {
      console.log("error ", error);
    })
  }

  processCategoriesResponse(resp: any) {
    const dataCategory: CategoryElement[] = [];

    if (resp.metadata[0].code = "00") {

      let listCategory = resp.categoryResponse.category;

      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource.data = dataCategory;
    }

  }

  openCategoryDialog()  {
    const dialogRef = this.dialog.open( NewCategoryComponent ,
       {
        width: '450px'
       });

      dialogRef.afterClosed().subscribe((result:any) => {

        if(result == 1){
          this.openSnackBar("Categoria Agregada", "Exitosa");
          this.getCategories();
        }else if (result == 2) {
          this.openSnackBar("Error al guardar categoria", "Error");
        }

      })

  }

    onEdit(id:number, name:string, description:string) {
      console.log('click')
      const dialogRef = this.dialog.open( NewCategoryComponent ,
        {
         data: {id: id, name:name, description:description},
         width: '450px'
        });

       dialogRef.afterClosed().subscribe((result:any) => {

         if(result == 1){
           this.openSnackBar("Categoria Actualizada", "Exitosa");
           this.getCategories();
         }else if (result == 2) {
           this.openSnackBar("Error al actualizar categoria", "Error");
         }

       })
    }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    })

  }

}

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
