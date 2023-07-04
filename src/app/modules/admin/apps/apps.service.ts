import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/core/types/user.types';
import { BehaviorSubject, map, Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AppsService
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
        return this._httpClient.get<any>( `api/common/apps/all`  ,  { params : { idUser : idUser  } }) ;
    }

    getIdApp( idUser , idApp ): Observable<any>
    {
        return this._httpClient.get<any>('api/common/apps' ,  { params : { idUser : idUser  , idApp : idApp } }) ;
    }

    post( idUser , app ): Observable<any>
    {
        return this._httpClient.post<any>('api/common/apps' , app ,  { params : { idUser : idUser  } }) ;
    }

    put( idUser  , idApp , app ): Observable<any>
    {
        return this._httpClient.put<any>('api/common/apps' , app ,  { params : { idUser : idUser  , idApp : idApp } }) ;
    }

    delete( idUser  , idApp ): Observable<any>
    {
        return this._httpClient.delete<any>('api/common/apps' ,  { params : { idUser : idUser  , idApp : idApp } }) ;
    }
}
