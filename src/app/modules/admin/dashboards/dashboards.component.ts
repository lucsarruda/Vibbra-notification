import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/core/types/user.types';
import { Subject, takeUntil } from 'rxjs';
import {MatSnackBar, MatSnackBarRef, MatSnackBarModule} from '@angular/material/snack-bar';
import { NotService } from '../notifications/notifications.service';


@Component({
    selector     : 'dashboards',
    standalone   : true,
    templateUrl  : './dashboards.component.html',
    encapsulation: ViewEncapsulation.None,
    imports:  [CommonModule, MatButtonModule , MatSnackBarModule] 
})
export class DashboardsComponent
{   
    user : User
    appsUserLogado 
    totalEnviado : number = 0   
    totalWebPush : number = 0   
    totalEmail : number = 0 
    totalSms : number = 0   


    private _unsubscribeAll: Subject<any> = new Subject<any>();abstract
    /**
     * Constructor
     */
    constructor(  private _activatedRoute : ActivatedRoute , private _notService  : NotService,
        private _changeDetectorRef: ChangeDetectorRef,  )
    {
    }

    ngOnInit(): void {

        this.user = this._activatedRoute.snapshot.data.user;

        this._notService.get(this.user.id).subscribe({
            next: (notification: any) => {

                this.totalEnviado = notification.length;
                this.totalWebPush = notification.filter(x => x.type == 'webpush').length;
                this.totalEmail = notification.filter(x => x.type == 'email').length;
                this.totalSms = notification.filter(x => x.type == 'sms').length;

                this._changeDetectorRef.markForCheck();
            }
          })


    }

}
