import { Routes } from '@angular/router';
import { AppsComponent } from './apps.component';
import { AppsFormComponent } from './apps-form/apps-form.component';
import { AppsListComponent } from './apps-list/apps-list.component';
import { UserLoggedResolver, initialDataResolver } from 'app/app.resolvers';

export default [
    {
        path     : '',
        component: AppsComponent,
        resolve: {
            user : UserLoggedResolver,
            initialData: initialDataResolver,
        },
        children:[
            {
                path     : '',
                component: AppsListComponent,
            }         
        ]
        
    },
] as Routes;
