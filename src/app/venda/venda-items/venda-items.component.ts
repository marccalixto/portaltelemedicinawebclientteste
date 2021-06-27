import { Produto } from '@/_models/produto';
import { ProdutoService } from '@/_services/produto.service';
import { validateVerticalPosition } from '@angular/cdk/overlay';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { OrderItem } from 'src/app/shared/order-item.model';
// import { ItemService } from 'src/app/shared/item.service';
// import { Item } from 'src/app/shared/item.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { OrderService } from 'src/app/shared/order.service';

@Component({ templateUrl: 'venda-items.component.html' })
export class VendaItemsComponent implements OnInit {
  itemForm: FormGroup;
  produtoList: Produto[];
  isValid: boolean = true;
  submitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<VendaItemsComponent>,
    private formBuilder: FormBuilder,
    private produtoService: ProdutoService
  ) { }

  ngOnInit() {
    this.getAllProdutos();
    this.itemForm = this.formBuilder.group({
      orderItemId: [null],
      orderId: [this.data.orderId],
      itemId: [0, [Validators.required, Validators.min(1)]],
      itemName: [''],
      produto: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      total: [0, [Validators.required, Validators.min(0.01)]]
    });

    if (this.data.orderItemIndex != null) {
      this.itemForm.patchValue({
        orderItemId: this.data.produtosDaVenda[this.data.orderItemIndex].orderItemId,
        orderId: this.data.produtosDaVenda[this.data.orderItemIndex].orderId,
        itemId: this.data.produtosDaVenda[this.data.orderItemIndex].produto.id,
        itemName: this.data.produtosDaVenda[this.data.orderItemIndex].itemName,
        produto: this.data.produtosDaVenda[this.data.orderItemIndex].produto,
        price: this.data.produtosDaVenda[this.data.orderItemIndex].price,
        quantity: this.data.produtosDaVenda[this.data.orderItemIndex].quantity,
      });
      this.updateTotal();
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.itemForm.controls; }

  getAllProdutos() {
    this.produtoService.getAll().subscribe({
      next: produtos => {
        this.produtoList = produtos;
      },
      error: err => console.log('Error', err)
    })
  }

  updatePrice(ctrl) {
    this.itemForm.patchValue({
      price: ctrl.selectedIndex == 0 ? 0 : this.produtoList[ctrl.selectedIndex - 1].price,
      itemName: ctrl.selectedIndex == 0 ? '' : this.produtoList[ctrl.selectedIndex - 1].name,
      produto: ctrl.selectedIndex == 0 ? [] : this.produtoList[ctrl.selectedIndex - 1]
    });
    this.updateTotal();
  }

  updateTotal() {
    let valor = parseFloat((this.itemForm.get("quantity").value * this.itemForm.get("price").value).toFixed(2));
    this.itemForm.patchValue({
      total: valor
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.itemForm.invalid) {
      return;
    }

    if (this.data.orderItemIndex == null)
      this.data.produtosDaVenda.push(this.itemForm.value)
    else
      this.data.produtosDaVenda[this.data.orderItemIndex] = this.itemForm.value;

    this.dialogRef.close({ data: this.data });
  }
}
