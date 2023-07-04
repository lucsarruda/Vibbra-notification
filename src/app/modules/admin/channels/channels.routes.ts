import { Routes } from '@angular/router';
import { UserLoggedResolver, initialDataResolver } from 'app/app.resolvers';
import { ChannelsComponent } from './channels.component';

export default [
    {
        path     : '',
        component: ChannelsComponent,
        resolve: {
            user : UserLoggedResolver,
            initialData: initialDataResolver,
        }        
    },
] as Routes;
