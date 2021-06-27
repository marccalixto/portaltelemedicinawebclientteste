import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { ProdutoInfoComponent } from './produto/produto-info';
import { ProdutoListComponent } from './produto/produto-list.component';
import { RegisterComponent } from './register';
import { VendaListComponent } from './venda';
import { VendaInfoComponent } from './venda/venda-info';
import { AuthGuard } from './_helpers';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'produtos', component: ProdutoListComponent, canActivate: [AuthGuard] },
    { path: 'produtos/info/:id', component: ProdutoInfoComponent, canActivate: [AuthGuard] },
    { path: 'vendas', component: VendaListComponent, canActivate: [AuthGuard] },
    { path: 'vendas/info/:id/:detalhe', component: VendaInfoComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);