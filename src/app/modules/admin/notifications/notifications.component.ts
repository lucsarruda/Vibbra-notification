import { HttpClientModule, } from '@angular/common/http';
import { MatPaginatorModule , MatPaginator} from '@angular/material/paginator';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatSortModule , MatSort } from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IconsService } from 'app/core/icons/icons.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from 'app/core/types/user.types';
import { AppsService } from 'app/modules/admin/apps/apps.service';
import {  MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { UserService } from 'app/core/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { AppsFormComponent} from '../apps/apps-form/apps-form.component';
import { NotService } from './notifications.service';
import { NotificationsFormsComponent } from './notifications-forms/notifications-forms.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports : [   MatIconModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    CommonModule,
    RouterLink,
  ],
  providers : [
  ]
})
export class NotificationsComponent {
  displayedColumns: string[] = ['app_name', 'type' , 'date_notification' , 'actions' ];
  dataSource = new MatTableDataSource<any>([]);
  user : User

  searchInputControl: UntypedFormControl = new UntypedFormControl();

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  dataCount: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( private _changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute : ActivatedRoute , 
    private _appsService : AppsService , 
    private _userService : UserService,
    private _router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    private _matDialog: MatDialog,
    private _notService : NotService  , 
    ){

  }

  ngOnInit() {

    this.user = this._activatedRoute.snapshot.data.user;

    this._notService.get( this.user.id ).subscribe({
        next: (not: any) => {
            this.dataCount = not.length
            this.dataSource =  new MatTableDataSource<any>(not);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this._changeDetectorRef.markForCheck();
        }
    })

  }


  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  addNotification(){
    //this._router.navigate(['./new'], {relativeTo: this._activatedRoute});
    const dialogRef = this._matDialog.open( NotificationsFormsComponent ,  { data: { isNew : true , user: this.user  }  } );

    dialogRef.afterClosed()
        .subscribe((result) =>
        {
          this.ngOnInit()
        });
  }

  viewNotification(id , type ){
    const dialogRef = this._matDialog.open(NotificationsFormsComponent , { data: { isNew : false , user: this.user , idNotification :id , type : type }  });

    dialogRef.afterClosed()
        .subscribe((result) =>
        {
          this.ngOnInit()
        });
  }

}