import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SchengenInfo } from './schengen-info/schengen-info';

export const routes: Routes = [

    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'home', component: Home
    },
    {
        path: 'shengen-info', component : SchengenInfo 
    }

];
