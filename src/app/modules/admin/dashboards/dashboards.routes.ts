import { Routes } from '@angular/router';
import { UserLoggedResolver, initialDataResolver } from 'app/app.resolvers';
import { DashboardsComponent } from 'app/modules/admin/dashboards/dashboards.component';

export default [
    {
        path     : '',
        component: DashboardsComponent,
        resolve: {
            initialData: initialDataResolver,
            user : UserLoggedResolver
        },
    },
] as Routes;
