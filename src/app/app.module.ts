import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// // used to create fake backend
// import { fakeBackendProvider } from './_helpers';

import { appRoutingModule } from './app.routing';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AlertComponent } from './_components';
import { ProdutoListComponent } from './produto';
import { ProdutoInfoComponent } from './produto/produto-info';
import { DialogConfirmService } from './_services/dialogconfirm.service';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { VendaListComponent } from './venda';
import { VendaInfoComponent } from './venda/venda-info';
import { MatDialogModule } from '@angular/material/dialog';
import { VendaItemsComponent } from './venda/venda-items';
import { MaterialModule } from './_modules/material.module';
import { MAT_DATE_LOCALE } from '@angular/material';

registerLocaleData(localePt, 'pt');

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule,
        MatDialogModule,
        MaterialModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        AlertComponent,
        ProdutoListComponent,
        ProdutoInfoComponent,
        VendaListComponent,
        VendaInfoComponent,
        VendaItemsComponent
    ],
    entryComponents: [VendaItemsComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },

        DialogConfirmService
        // provider used to create fake backend
        // fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };