import { Routes } from '@angular/router';
import { UserLoggedResolver, initialDataResolver } from 'app/app.resolvers';
import { NotificationsComponent } from './notifications.component';

export default [
    {
        path     : '',
        component: NotificationsComponent,
        resolve: {
            user : UserLoggedResolver,
            initialData: initialDataResolver,
        }        
    },
] as Routes;
