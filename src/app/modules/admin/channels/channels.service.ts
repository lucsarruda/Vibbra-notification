import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/core/types/user.types';
import { BehaviorSubject, map, Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ChannelsService
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

    get( idUser , channel :string): Observable<any>
    {   
        return this._httpClient.get<any>( `api/common/channels`  ,  { params : { idUser : idUser , channel : channel } }) ;
    }


    put( idUser  , channel , body ): Observable<any>
    {
        return this._httpClient.put<any>('api/common/channels' , body ,  { params : { idUser : idUser  , channel : channel } }) ;
    }
}
