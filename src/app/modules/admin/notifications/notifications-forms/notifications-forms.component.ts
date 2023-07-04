
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { MatRadioModule } from '@angular/material/radio';
import { AppsService } from '../../apps/apps.service'; 
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NotService } from '../notifications.service';
import { user as userData } from 'app/mock-api/common/user/data';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-notifications-forms',
  templateUrl: './notifications-forms.component.html',
  styleUrls: ['./notifications-forms.component.scss'],
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
    MatRadioModule,
    MatOptionModule,
    MatSelectModule,
    TextFieldModule, 
    NgIf, 
    NgFor
  ],
})
export class NotificationsFormsComponent {

  Form: UntypedFormGroup;

  title : string
  isnew : boolean
  user 
  apps = [{}]
  templates = [{}]

  private _users: any = userData;

  /**
   * Constructor
   */
  constructor(
      public matDialogRef: MatDialogRef<any>,
      private _formBuilder: UntypedFormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _activatedRoute : ActivatedRoute , 
      private _appsService : AppsService ,
      private _snackBar: MatSnackBar,
      private _fuseConfirmationService: FuseConfirmationService,
      private _router: Router, 
      private _notService  : NotService,
      private _changeDetectorRef: ChangeDetectorRef,
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
      this.title = "Nova Notificação"
    
    if ( !this.isnew) 
      this.title = "Detalhes de Envio "

    // Create the form
    this.Form = this._formBuilder.group({
        app            : ['', [Validators.required]],
        channel        : ['webpush', [Validators.required]],
        webpush_audiencia        : this._formBuilder.array([]),
        webpush_title        : [''],
        webpush_mensagem       : [''],
        webpush_icone          : [''],
        webpush_destino        : [''],
        sms_telefones          : this._formBuilder.array([]),
        sms_mensagem           : [''],
        email_destinatarios    : this._formBuilder.array([]),
        email_template    : [''],
    });


    this._notService.getTemplates( this.data.user.id ).subscribe({
      next: (templates: any) => {
          this.templates = templates
          this._changeDetectorRef.markForCheck();
      }
    })

    this._appsService.get( this.data.user.id ).subscribe({
      next: (apps: any) => {
          if(apps.length == 0){            
              const confirmation = this._fuseConfirmationService.open({
                title  : 'Nenhum Aplicativo Cadastrado',
                message: 'Não foram encontrados nenhum aplicativo cadastro. Deseja cadastrar um novo aplicativo?',
                actions: {
                    confirm: {
                        label: 'Cadastrar',
                    },
                },
            });
            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) =>
            {
                // If the confirm button pressed...
                if ( result === 'confirmed' )
                {
                  this._router.navigate(['/apps'])
                }
                this.matDialogRef.close();
            });
          }
          if(this.isnew){
            this.apps = apps.filter(item => item.app_active === true);
          }else{
            this.apps = apps
          }

          this._changeDetectorRef.markForCheck();
          
      }
    })

    if ( !this.isnew){

      this._notService.getIdApp( this.data.user.id , this.data.idNotification ).subscribe({
        next: (notification: any) => {
            this.Form.get('app').patchValue(notification.id_app)
            this.Form.get('channel').setValue(this.data.type)
            if(this.data.type === 'webpush'){

              this.Form.get('webpush_title').setValue(notification.data_notification.message_title)
              this.Form.get('webpush_mensagem').setValue(notification.data_notification.message_text)
              this.Form.get('webpush_icone').setValue(notification.data_notification.icon_url)
              this.Form.get('webpush_destino').setValue(notification.data_notification.redirect_url)

              notification.data_notification.audience_segments.forEach((element) =>
              {
                  const ArrayFormGroup = this._formBuilder.group({
                      name   : [element],
                  });
                  (this.Form.get('webpush_audiencia') as UntypedFormArray).push(ArrayFormGroup);
              });
        
            }
            if(this.data.type === 'sms'){

              notification.data_notification.phone_number.forEach((element) =>
              {
                  const ArrayFormGroup = this._formBuilder.group({
                      name   : [element],
                  });
                  (this.Form.get('sms_telefones') as UntypedFormArray).push(ArrayFormGroup);
              });
              this.Form.get('sms_mensagem').setValue(notification.data_notification.sms_mensagem)

            }
            if(this.data.type === 'email'){

              notification.data_notification.receiver_email.forEach((element) =>
              {
                  const ArrayFormGroup = this._formBuilder.group({
                      name   : [element],
                  });
                  (this.Form.get('email_destinatarios') as UntypedFormArray).push(ArrayFormGroup);
              });
              this.Form.get('email_template').setValue(notification.data_notification.email_template_name)

            }

            this._changeDetectorRef.markForCheck();
            
            this.Form.disable();
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

      // Clone the users
      const users = cloneDeep(this._users);

      // Find the user
      const user = users.find(item => item.id === this.data.user.id);

      const App = user.data_account.apps.find(item => item.app_id === this.Form.get('app').value);

      let notification : any = { 
        id_app : this.Form.get('app').value ,
        app_name : App.app_name, 
        type: this.Form.get('channel').value,
      }

      if(this.Form.get('channel').value == 'webpush'){

        let ArrayFormValue = []
        this.Form.get('webpush_audiencia').value.forEach(( element)=>{ ArrayFormValue.push(element.name)}) 

        notification.data_notification = { 
          audience_segments: ArrayFormValue,
          message_title: this.Form.get('webpush_title').value,
          message_text: this.Form.get('webpush_mensagem').value,
          icon_url: this.Form.get('webpush_icone').value,
          redirect_url: this.Form.get('webpush_destino').value,
          received: true,
          opened: true,
        }
      }

      if(this.Form.get('channel').value == 'sms'){
        let ArrayFormValue = []
        this.Form.get('sms_telefones').value.forEach(( element)=>{ ArrayFormValue.push(element.name)}) 

        notification.data_notification = { 
          phone_number: ArrayFormValue,
          sms_mensagem : this.Form.get('sms_mensagem').value
        }
      }

      if(this.Form.get('channel').value == 'email'){
        let ArrayFormValue = []
        this.Form.get('email_destinatarios').value.forEach(( element)=>{ ArrayFormValue.push(element.name)}) 
        notification.data_notification = { 
          receiver_email: ArrayFormValue,
          email_template_name : this.Form.get('email_template').value
        }
      }

      this._notService.post( this.data.user.id , notification ).subscribe({
          next: (apps: any) => {
              //this.appsUserLogado = apps
              this._snackBar.open('Sucesso! Mensagem enviada!', 'Fechar' , { duration: 3000  , panelClass: [ 'success'] })
              this.matDialogRef.close();
          }
      })

    }
    
  }

  deleteLine(Index: number , nameFormsArray ) {
    this.retFormArray(nameFormsArray).removeAt(Index);
  }


  retFormArray(nameFormsArray): FormArray {
    return this.Form.get(nameFormsArray) as FormArray;
  }

  addLineForms(nameFormsArray) {
    this.retFormArray(nameFormsArray).push(this.newFormGroup(nameFormsArray));
  }

  newFormGroup(nameFormsArray): FormGroup {
    return this._formBuilder.group({
      name: '',
    });
  }
}