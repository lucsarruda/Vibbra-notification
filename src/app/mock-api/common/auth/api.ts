import { Injectable } from '@angular/core';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { user as userData } from 'app/mock-api/common/user/data';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import { cloneDeep } from 'lodash-es';

@Injectable({providedIn: 'root'})
export class AuthMockApi
{
    private readonly _secret: any;
    private _users: any[] = userData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Set the mock-api
        this._secret = 'YOUR_VERY_CONFIDENTIAL_SECRET_FOR_SIGNING_JWT_TOKENS!!!';

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
        // @ Forgot password - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/forgot-password', 1000)
            .reply(() =>
                [
                    200,
                    true,
                ],
            );

        // -----------------------------------------------------------------------------------------------------
        // @ Reset password - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/reset-password', 1000)
            .reply(() =>
                [
                    200,
                    true,
                ],
            );

        // -----------------------------------------------------------------------------------------------------
        // @ Sign in - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/sign-in', 1500)
            .reply(({request}) =>
            {
                //autenticação via google
                if(request.body.googleSingUp){

                    const googleSingUp = request.body.googleSingUp
                    const users = cloneDeep(this._users);
    
                    // Find the user
                    const user = users.find(item => item.email === googleSingUp.email);

                    if(user){
                        delete user.password
                        return [
                            200,
                            {
                                user       : user,
                                accessToken: googleSingUp.idToken,
                                tokenType  : 'bearer',
                            },
                        ];
                    }else{ 

                        let newUser = this.buildingNewUser()

                        newUser.id = googleSingUp.id
                        newUser.name = googleSingUp.name
                        newUser.email = googleSingUp.email
                        newUser.isSingUpGoogle = true
                        newUser.avatarSingUpGoogle = googleSingUp.photoUrl

                        delete newUser.password

                        // Unshift the new user
                        this._users.unshift(newUser);

                        return [
                            200,
                            {
                                user       : newUser,
                                accessToken: googleSingUp.idToken,
                                tokenType  : 'bearer',
                            },
                        ];
                    }

                    /*
                    id: SocialUser.id,
                                    name : SocialUser.name,
                                    email : SocialUser.email,
                                    isSingUpGoogle : true,
                                    avatarSingUpGoogle : SocialUser.photoUrl,
                                    data_account: []
                    */
                }else{
                //autenticação normal

                    const emailUser = request.body.email
                     // Clone the users
                    const users = cloneDeep(this._users);
    
                    // Find the user
                    const user = users.find(item => item.email === emailUser);

                    // Sign in successful
                    if ( request.body.email === user.email && request.body.password === user.password)
                    {
                        delete user.password
                        return [
                            200,
                            {
                                user       : user,
                                accessToken: this._generateJWTToken(user.email),
                                tokenType  : 'bearer',
                            },
                        ];
                    }
                }

                // Invalid credentials
                return [
                    404,
                    false,
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Sign in using the access token - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/sign-in-with-token')
            .reply(({request}) =>
            {
                // Get the access token
                const accessToken = request.body.accessToken;

                const payloadToken = this._getPayladToken(accessToken)
                
                if(payloadToken.iss === "https://accounts.google.com" ){

                    let newUser = this.buildingNewUser()

                    newUser.id = payloadToken.sub
                    newUser.name = payloadToken.name
                    newUser.email = payloadToken.email
                    newUser.isSingUpGoogle = true
                    newUser.avatarSingUpGoogle = payloadToken.picture

                    delete newUser.password

                    return [
                        200,
                        {
                            user       : newUser,
                            accessToken: accessToken,
                            tokenType  : 'bearer',
                        },
                    ];
                }

                // Clone the users
                const users = cloneDeep(this._users);
 
                 // Find the user
                const user = users.find(item => item.email === payloadToken.email);
                
                // Verify the token
                if ( this._verifyJWTToken(accessToken) && user)
                {   
                    delete user.password
                    return [
                        200,
                        {
                            user       : user,
                            accessToken: this._generateJWTToken(user.email),
                            tokenType  : 'bearer',
                        },
                    ];
                }

                // Invalid token
                return [
                    401,
                    {
                        error: 'Invalid token',
                    },
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Sign up - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/sign-up', 1500)
            .reply((requests : any) =>{

                    const request = requests.request
                    // Generate a new user

                    let newUser = this.buildingNewUser()

                    newUser.id   = FuseMockApiUtils.guid(),
                    newUser.name  = request.body.name
                    newUser.email = request.body.email
                    newUser.password = request.body.password
                    newUser.company_name = request.body.company_name
                    newUser.phone_number = request.body.phone_number
                    newUser.company_address =  request.body.company_address

                    // Unshift the new user
                    this._users.unshift(newUser);

                    // Return the response
                    return [200, newUser];
                        
                }
            );

        // -----------------------------------------------------------------------------------------------------
        // @ Unlock session - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/unlock-session', 1500)
            .reply(({request}) =>
            {
                const emailUser = request.body.email

                 // Clone the users
                const users = cloneDeep(this._users);
 
                 // Find the user
                const user = users.find(item => item.email === emailUser);

                // Sign in successful
                if ( request.body.email === user.email && request.body.password === user.password)
                {
                    return [
                        200,
                        {
                            user       : cloneDeep(this._users),
                            accessToken: this._generateJWTToken(user.email),
                            tokenType  : 'bearer',
                        },
                    ];
                }

                // Invalid credentials
                return [
                    404,
                    false,
                ];
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Return base64 encoded version of the given string
     *
     * @param source
     * @private
     */
    private _base64url(source: any): string
    {
        // Encode in classical base64
        let encodedSource = Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        // Return the base64 encoded string
        return encodedSource;
    }

    /**
     * Generates a JWT token using CryptoJS library.
     *
     * This generator is for mocking purposes only and it is NOT
     * safe to use it in production frontend applications!
     *
     * @private
     */
    private _generateJWTToken( emailUser :string ): string
    {
        // Define token header
        const header = {
            alg: 'HS256',
            typ: 'JWT',
        };

        // Calculate the issued at and expiration dates
        const date = new Date();
        const iat = Math.floor(date.getTime() / 1000);
        const exp = Math.floor((date.setDate(date.getDate() + 7)) / 1000);

        // Define token payload
        const payload = {
            iat: iat,
            iss: 'APP1612',
            email : emailUser,
            exp: exp,
        };

        // Stringify and encode the header
        const stringifiedHeader = Utf8.parse(JSON.stringify(header));
        const encodedHeader = this._base64url(stringifiedHeader);

        // Stringify and encode the payload
        const stringifiedPayload = Utf8.parse(JSON.stringify(payload));
        const encodedPayload = this._base64url(stringifiedPayload);

        // Sign the encoded header and mock-api
        let signature: any = encodedHeader + '.' + encodedPayload;
        signature = HmacSHA256(signature, this._secret);
        signature = this._base64url(signature);

        // Build and return the token
        return encodedHeader + '.' + encodedPayload + '.' + signature;
    }

    /**
     * Verify the given token
     *
     * @param token
     * @private
     */
    private _verifyJWTToken(token: string): boolean
    {
        // Split the token into parts
        const parts = token.split('.');
        const header = parts[0];
        const payload = parts[1];
        const signature = parts[2];

        // Re-sign and encode the header and payload using the secret
        const signatureCheck = this._base64url(HmacSHA256(header + '.' + payload, this._secret));

        // Verify that the resulting signature is valid
        return (signature === signatureCheck);
    }

    private _getPayladToken(token: string)
    {
        // Split the token into parts
        const parts = token.split('.');
        const payload = parts[1];

        return JSON.parse(atob(payload))

    }

    private buildingNewUser(){
        return {
            id    : '' ,
            name  : '',
            email : '',
            password : '',
            company_name : '',
            phone_number : '',
            company_address : '',
            isSingUpGoogle : false,
            avatarSingUpGoogle : '',
            data_account: {
                apps: [],
                channels: {
                    webpush: {
                        active: false,
                        site: {
                            name: '',
                            address: '',
                            url_icon: ''
                        },
                        allow_notification: {
                            message_text: '',
                            allow_button_text: '',
                            deny_button_text: ''
                        },
                        welcome_notification: {
                            message_title: '',
                            message_text: '',
                            enable_url_redirect: true,
                            url_redirect: ''
                        }
                    },
                    email: {
                        active: false,
                        sever: {
                            smtp_name: '',
                            smpt_port: '',
                            user_login: '',
                            user_password: ''
                        },
                        sender: {
                            name: '',
                            email: ''
                        },
                        email_templates: []
    
                    },
                    sms: {
                        active: false,
                        sms_provider: {
                            name: '',
                            login: '',
                            password: ''
                        }
                    }
                },
                notifications: []
            }
        }
    }
}
