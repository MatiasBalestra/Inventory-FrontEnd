import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';
import { NewProductComponent } from '../new-product/new-product.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(private productService: ProductService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getProducts();
  }


  displayColums: string[] = ['id', 'name', 'price', 'account', 'category', 'picture', 'actions'];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  getProducts() {
    this.productService.getProducts().subscribe((data:any) => {
      console.log("respuesta de productos: ", data);
      this.processProductResponse(data);
    }, (error:any) => {
      console.log("error al obtener respuesta ", error)
    })
  }

  processProductResponse(resp:any) {
    const dateProduct: ProductElement []= [];

    if(resp.metadata[0].code == "00") {
      const listProduct = resp.product.products;

      listProduct.forEach((element: ProductElement) => {
        //element.category = element.category.name;
        element.picture = 'data:image/jpeg;base64, ' +element.picture;
        dateProduct.push(element);
      });


      //set the data source

      this.dataSource.data = dateProduct;
      this.dataSource.paginator = this.paginator;

    }
  }

  openProductDialog() {

    const dialogRef = this.dialog.open( NewProductComponent ,
      {
       width: '450px'
      });

     dialogRef.afterClosed().subscribe((result:any) => {

       if(result == 1){
         this.openSnackBar("Producto Agregado", "Exitosa");
         this.getProducts();
       }else if (result == 2) {
         this.openSnackBar("Error al guardar producto", "Error");
       }

     })

  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    })

  }

  edit(id:number, name:string, price:number, account:number, category: any) {


    const dialogRef = this.dialog.open( NewProductComponent ,
      {
       width: '450px',
       data: {id: id, name: name, price: price, account: account, category: category }
      });

     dialogRef.afterClosed().subscribe((result:any) => {

       if(result == 1){
         this.openSnackBar("Producto Editado", "Exitosa");
         this.getProducts();
       }else if (result == 2) {
         this.openSnackBar("Error al editar producto", "Error");
       }

     })

  }

  delete(id:any) {
    const dialogRef = this.dialog.open( ConfirmComponent ,
      {
       width: '450px',
       data: {id: id, module: "product" }
      });

     dialogRef.afterClosed().subscribe((result:any) => {

       if(result == 1){
         this.openSnackBar("Producto Eliminado", "Exitosa");
         this.getProducts();
       }else if (result == 2) {
         this.openSnackBar("Error al elimar producto", "Error");
       }

     })
  }

  buscar(nombre: any ) {
    if (nombre.length == 0) {
      return this.getProducts();
    }

    this.productService.getProductByName(nombre)
    .subscribe((resp:any) => {
      this.processProductResponse(resp);
    })

  }


}





export interface ProductElement {
  id:number;
  name: string;
  price: number;
  account: number;
  category: any;
  picture: any;
}
