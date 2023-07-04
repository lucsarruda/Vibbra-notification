import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/core/types/user.types';
import { BehaviorSubject, map, Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class NotService
{
    private _App : BehaviorSubject<any | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    get( idUser ): Observable<any>
    {   
        return this._httpClient.get<any>( `api/common/user/notifications`  ,  { params : { idUser : idUser  } }) ;
    }

    getTemplates( idUser ): Observable<any>
    {   
        return this._httpClient.get<any>( `api/common/channels/email/templates`  ,  { params : { idUser : idUser  } }) ;
    }

    getIdApp( idUser , idNotification ): Observable<any>
    {
        return this._httpClient.get<any>('api/common/user/notification' ,  { params : { idUser : idUser  , idNotification : idNotification } }) ;
    }

    post( idUser , notification ): Observable<any>
    {
        return this._httpClient.post<any>('api/common/user/notification' , notification ,  { params : { idUser : idUser  } }) ;
    }

}
