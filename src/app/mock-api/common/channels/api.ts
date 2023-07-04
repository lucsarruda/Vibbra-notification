import { Injectable } from '@angular/core';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { user as userData } from 'app/mock-api/common/user/data';
import { assign, cloneDeep } from 'lodash-es';

@Injectable({providedIn: 'root'})
export class ChannelsMockApi
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
        // @ APPs - GET channel
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/channels', 300)
            .reply(({request}) => {

                // Get the id from the params
                const idUser = request.params.get('idUser');
                const channel = request.params.get('channel');

                // Clone the users
                const users = cloneDeep(this._users);

                // Find the user
                const user = users.find(item => item.id === idUser);
                
                let channelData = {}
                if(user){
                    channelData = eval('user.data_account.channels.' + channel)
                }
            
                // Return the response
                return [200, channelData ];

            });
        
        // -----------------------------------------------------------------------------------------------------
        // @ APPs - GET template
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
        .onGet('api/common/channels/email/templates', 300)
        .reply(({request}) => {

            // Get the id from the params
            const idUser = request.params.get('idUser');

            // Clone the users
            const users = cloneDeep(this._users);

            // Find the user
            const user = users.find(item => item.id === idUser);
            
            let templates = []
            if(user){
                templates = user.data_account.channels.email.email_templates
            }
        
            // Return the response
            return [200, templates ];

        });

        // -----------------------------------------------------------------------------------------------------
        // @ APPs - PUT APP
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
        .onPut('api/common/channels', 300)
        .reply(({request}) => {

            // Get the id from the params
            const body = request.body

            // Get the id
            const idUser = request.params.get('idUser');
            const channel = request.params.get('channel');

            // Get the id
            const idApp = request.params.get('idApp');


            this._users.forEach((item, index , users) => {

                if ( item.id === idUser )
                {   
                    // Update the chat
                    eval(' this._users[index].data_account.channels.' + channel + ' = body ') 
                    //data  = body //assign({}, body);
      
                    // Return the response
                    return [200, eval(' this._users[index].data_account.channels.' + channel ) ];     
                }
            });

            // Return the response
            return [200, {} ];

        
        });

    }
}
