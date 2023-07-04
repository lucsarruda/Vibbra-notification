import { Injectable } from '@angular/core';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { user as userData } from 'app/mock-api/common/user/data';
import { assign, cloneDeep } from 'lodash-es';

@Injectable({providedIn: 'root'})
export class AppsMockApi
{
    private _users: any = userData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {

        // -----------------------------------------------------------------------------------------------------
        // @ APPs - GET APPS
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/apps/all', 300)
            .reply(({request}) => {

                // Get the id from the params
                const idUser = request.params.get('idUser');

                // Clone the users
                const users = cloneDeep(this._users);

                // Find the user
                const user = users.find(item => item.id === idUser);

                // Return the response
                if(!user)
                    return [200, {} ];

                return [200, user.data_account.apps ? user.data_account.apps : {} ];

            });

        // -----------------------------------------------------------------------------------------------------
        // @ APPs - GET APP
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/apps', 300)
            .reply(({request}) => {

                // Get the id from the params
                const idUser = request.params.get('idUser');
                const idApp = request.params.get('idApp');

                // Clone the users
                const users = cloneDeep(this._users);

                // Find the user
                const user = users.find(item => item.id === idUser);

                const App = user.data_account.apps.find(item => item.app_id === idApp);

                // Return the response
                return [200, App ];

            });

        // -----------------------------------------------------------------------------------------------------
        // @ APPs - POST APP
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/common/apps', 300)
            .reply(({request}) => {

                // Get the id from the params
                const body = request.body

                // Get the id
                const idUser = request.params.get('idUser');

                this._users.forEach((item, index) => {

                    if ( item.id === idUser )
                    {
                        // Generate a new app
                        const newAPP = body

                        newAPP.app_id =  FuseMockApiUtils.guid()
                        newAPP.app_token =  FuseMockApiUtils.guid()

                        // Unshift the new user
                        this._users[index].data_account.apps.unshift(newAPP);
                        // Return the response
                        return [200, newAPP ];
                    }
                });

                // Return the response
                return [200, {} ];

            
            });

        // -----------------------------------------------------------------------------------------------------
        // @ APPs - PUT APP
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
        .onPut('api/common/apps', 300)
        .reply(({request}) => {

            // Get the id from the params
            const body = request.body

            // Get the id
            const idUser = request.params.get('idUser');

            // Get the id
            const idApp = request.params.get('idApp');

            this._users.forEach((item, index) => {

                if ( item.id === idUser )
                {   

                    this._users[index].data_account.apps.forEach((item, indexApp) => {

                        if ( item.app_id === idApp )
                        {   
                            this._users[index].data_account.apps[indexApp].app_name = body.app_name
                            this._users[index].data_account.apps[indexApp].app_active = body.app_active
                            this._users[index].data_account.apps[indexApp].app_active_channels.webpush = body.app_active_channels.webpush
                            this._users[index].data_account.apps[indexApp].app_active_channels.email = body.app_active_channels.email
                            this._users[index].data_account.apps[indexApp].app_active_channels.sms = body.app_active_channels.sms
                            
                            // Return the response
                            return [200, this._users[index].data_account.apps[indexApp] ];
                        }

                    })

                    
                }
            });

            // Return the response
            return [200, {} ];

        
        });

         // -----------------------------------------------------------------------------------------------------
        // @ APP - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/common/apps')
            .reply(({request}) =>
            {
                
                 // Get the id from the params
                const body = request.body

                // Get the id
                const idUser = request.params.get('idUser');

                // Get the id
                const idApp = request.params.get('idApp');

                this._users.forEach((item, index) => {

                    if ( item.id === idUser )
                    {   

                        this._users[index].data_account.apps.forEach((item, indexApp) => {

                            if ( item.app_id === idApp )
                            {   
                                this._users[index].data_account.apps.splice(indexApp, 1);
                            }

                        })

                        
                    }
                });

                return [
                    200,
                    true,
                ];
            });
    }
}
