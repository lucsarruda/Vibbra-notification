import { Injectable } from '@angular/core';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { user as userData } from 'app/mock-api/common/user/data';
import { assign, cloneDeep } from 'lodash-es';

@Injectable({providedIn: 'root'})
export class UserMockApi
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
        // @ Users - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/users', 300)
            .reply(({request}) => {

                // Get available queries
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'name';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('size') ?? '10', 10);

                // Clone the users
                let users: any[] | null = cloneDeep(this._users);

                // Sort the users
                if ( sort === 'userType' || sort === 'name' )
                {
                    users.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
                    });
                }
                else
                {
                    users.sort((a, b) => order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]);
                }

                // If search exists...
                if ( search )
                {
                    // Filter the users
                    users = users.filter(contact => contact.name && contact.name.toLowerCase().includes(search.toLowerCase()));
                }

                // Paginate - Start
                const usersLength = users.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min((size * (page + 1)), usersLength);
                const lastPage = Math.max(Math.ceil(usersLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // users but also send the last possible page so
                // the app can navigate to there
                if ( page > lastPage )
                {
                    users = null;
                    pagination = {
                        lastPage
                    };
                }
                else
                {
                    // Paginate the results by size
                    users = users.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length    : usersLength,
                        size      : size,
                        page      : page,
                        lastPage  : lastPage,
                        startIndex: begin,
                        endIndex  : end - 1
                    };
                }

                // Return the response
                return [
                    200,
                    {
                        users,
                        pagination
                    }
                ];
            });


        // -----------------------------------------------------------------------------------------------------
        // @ User - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/user')
            .reply(({request}) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the users
                const users = cloneDeep(this._users);

                // Find the user
                const user = users.find(item => item.id === id);

                // Return the response
                return [200, user];
            });



        // -----------------------------------------------------------------------------------------------------
        // @ User - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
        .onPost('api/common/user')
        .reply((request : any) => {

            // Generate a new user
            const newUser = {
                id    :  FuseMockApiUtils.guid(),
                name  : request.body.name,
                email : request.body.email,
                password : request.body.password,
                company_name : request.body.company_name,
                phone_number : request.body.phone_number,
                company_address : request.body.company_address
            }

            // Unshift the new user
            this._users.unshift(newUser);

            // Return the response
            return [200, newUser];
        });

        // -----------------------------------------------------------------------------------------------------
        // @ User - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/common/user')
            .reply(({request}) => {

                // Get the id and user
                const id = request.body.id;
                const user = cloneDeep(request.body.user);

                // Prepare the updated user
                let updatedUser = null;

                // Find the user and update it
                this._users.forEach((item, index, users) => {

                    if ( item.id === id )
                    {
                        // Update the user
                        users[index] = assign({}, users[index], user);

                        // Store the updated user
                        updatedUser = users[index];
                    }
                });

                // Return the response
                return [200, updatedUser];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ User - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/common/user')
            .reply(({request}) => {

                // Get the id
                const id = request.params.get('id');

                // Find the user and delete it
                this._users.forEach((item, index) => {

                    if ( item.id === id )
                    {
                        this._users.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });


        // -----------------------------------------------------------------------------------------------------
        // @ notifications - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/user/notifications')
            .reply(({request}) => {

                // Get the id from the params
                const id = request.params.get('idUser');

                // Clone the users
                const users = cloneDeep(this._users);

                // Find the user
                const user = users.find(item => item.id === id);

                let notifications = []
                if(user)
                    notifications = user.data_account.notifications

                // Return the response
                return [200, notifications];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ notifications - GET ID
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/user/notification')
            .reply(({request}) => {

                // Get the id from the params
                const idUser = request.params.get('idUser');
                const idNotification = request.params.get('idNotification');

                // Clone the users
                const users = cloneDeep(this._users);

                // Find the user
                const user = users.find(item => item.id === idUser);

                const notification = user.data_account.notifications.find(item => item.id_notification === idNotification);

                // Return the response
                return [200, notification ];
            });

            this._fuseMockApiService
                .onPost('api/common/user/notification')
                .reply(({request}) => {

                    // Get the id from the params
                    const body = request.body
    
                    // Get the id
                    const idUser = request.params.get('idUser');
    
                    this._users.forEach((item, index) => {
    
                        if ( item.id === idUser )
                        {

                            // Generate a new
                            let newNot = request.body
                            newNot.id_notification = FuseMockApiUtils.guid(),
                            newNot.date_notification = new Date()
    
                            // Unshift the new user
                            this._users[index].data_account.notifications.unshift(newNot);
                            // Return the response
                            return [200, newNot ];
                        }
                    });
    
                    // Return the response
                    return [200, {} ];
                    
                });


    }
}
