import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { MatRadioModule } from '@angular/material/radio';
import { AppsService } from '../apps.service';

@Component({
  selector: 'app-apps-form',
  templateUrl: './apps-form.component.html',
  styleUrls: ['./apps-form.component.scss'] ,
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
    QuillEditorComponent,
    MatCheckboxModule,
    MatRadioModule
  ],
})
export class AppsFormComponent {
  
  Form: UntypedFormGroup;

  title : string
  isnew : boolean
  user 

  /**
   * Constructor
   */
  constructor(
      public matDialogRef: MatDialogRef<any>,
      private _formBuilder: UntypedFormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _activatedRoute : ActivatedRoute , 
      private _appsService : AppsService ,
      private _snackBar: MatSnackBar
  )
  {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
    this.isnew = this.data.isNew

    if ( this.isnew) 
      this.title = "Novo Aplicativo"
    
    if ( !this.isnew) 
      this.title = "Editar Aplicativo"

    // Create the form
    this.Form = this._formBuilder.group({
        app_name            : ['', [Validators.required]],
        app_token            : [{value : '', disabled: true }, []],
        app_active          : [true, [Validators.required]],
        app_active_webpush  : [true, [Validators.required]],
        app_active_email    : [true, [Validators.required]],
        app_active_sms      : [true, [Validators.required]],
    });

    if ( !this.isnew){
      this._appsService.getIdApp( this.data.user.id , this.data.idApp ).subscribe({
        next: (app: any) => {
            this.Form.get('app_name').setValue(app.app_name)
            this.Form.get('app_token').setValue(app.app_token)
            this.Form.get('app_active').setValue(app.app_active)
            this.Form.get('app_active_webpush').setValue(app.app_active_channels.webpush)
            this.Form.get('app_active_email').setValue(app.app_active_channels.email)
            this.Form.get('app_active_sms').setValue(app.app_active_channels.sms)
            
        }
      })
    }
      
  }

  /**
   * Discard the message
   */
  discard(): void
  {
    this.matDialogRef.close();
  }

  /**
   * Send the message
   */
  salve(): void
  { 
    if(this.isnew){
      
      const app = {
          app_name: this.Form.get('app_name').value,
          app_active: this.Form.get('app_active').value,
          app_active_channels: {
              webpush: this.Form.get('app_active_webpush').value,
              email: this.Form.get('app_active_email').value,
              sms: this.Form.get('app_active_sms').value
          }
      }

      this._appsService.post( this.data.user.id , app ).subscribe({
          next: (apps: any) => {
              //this.appsUserLogado = apps
              this._snackBar.open('Sucesso! Aplicativo criado.', 'Fechar' , { duration: 3000  , panelClass: [ 'success'] })
              this.matDialogRef.close();
          }
      })

    }else{

      const app = {
          app_name: this.Form.get('app_name').value,
          app_active: this.Form.get('app_active').value,
          app_active_channels: {
              webpush: this.Form.get('app_active_webpush').value,
              email: this.Form.get('app_active_email').value,
              sms: this.Form.get('app_active_sms').value
          }
      }

      this._appsService.put( this.data.user.id ,this.data.idApp ,app ).subscribe({
          next: (apps: any) => {
              //this.appsUserLogado = apps
              this._snackBar.open('Sucesso! Aplicativo alterado.', 'Fechar' , { duration: 3000  , panelClass: [ 'success'] })
              this.matDialogRef.close();
          }
      })

    }
    
  }
}