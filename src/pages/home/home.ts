import { UserProvider } from './../../providers/user/user';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UbicacionProvider } from '../../providers/ubicacion/ubicacion';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user:any = {};

  constructor(public navCtrl: NavController,
              private _ubicacionProvider: UbicacionProvider,
              private _userProvider: UserProvider) {

    _ubicacionProvider.initDriver();
    _ubicacionProvider.initGeolocation();

    _ubicacionProvider.driver.valueChanges()
      .subscribe( data => {

        this.user = data;

      })
  }

  salir(){

    this._ubicacionProvider.stopGeolocation();
    this._userProvider.deleteUser();
    this.navCtrl.setRoot( LoginPage );
  }

}
