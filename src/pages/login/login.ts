import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, Slides, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, 
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private _userProvider: UserProvider) {
  }

  ionViewDidLoad(){
    this.slides.paginationType = 'progress';
    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
  }

  mostrarInput(){

    this.alertCtrl
      .create({
        title: 'Ingrese el usuario',
        inputs:[{
          name: 'key',
          placeholder: 'Clave de usuario'
        }],
        buttons: [{
          text: 'Cancelar',
          role: 'cancel'
        },{
          text: 'Ingresar',
          handler: data => {
            // console.log(data.key);
            this.verifyUser( data.key );
          }
        }]
      })
      .present();
  }

  ingresar(){

    this.navCtrl.setRoot( HomePage );

  }

  verifyUser(key: string){

    let loading = this.loadingCtrl.create({
      content: 'Verificando'
    });
    
    loading.present();

    this._userProvider.verifyUser( key )
      .then(exist => {

        loading.dismiss();

        if( exist ){
          
          this.slides.lockSwipes( false );
          this.slides.freeMode = true;
          this.slides.slideNext();
          this.slides.lockSwipes(true);
          this.slides.freeMode = false;

        } else
          this.alertCtrl.create({
            title: 'Clave incorrecta',
            subTitle: 'Hable con el administrador o pruebe de nuevo',
            buttons: ['Aceptar']
          }).present();

      });

  }

}
