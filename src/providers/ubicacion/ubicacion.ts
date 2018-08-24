import { UserProvider } from './../user/user';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class UbicacionProvider {

  driver: AngularFirestoreDocument<any>;
  private watch: Subscription;

  constructor(private geolocation: Geolocation, 
              private afDB: AngularFirestore,
              private _userProvider: UserProvider) {}

  initDriver(){
    this.driver = this.afDB.doc(`/usuarios/${ this._userProvider.key }`);
  }

  initGeolocation(){

    this.geolocation.getCurrentPosition()
      .then( (resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
  
        this.driver.update({
          lat: resp.coords.latitude,
          lng: resp.coords.longitude,
          key: this._userProvider.key
        });

        this.watch = this.geolocation.watchPosition()
          .subscribe((data) => {

          this.driver.update({
            lat: data.coords.latitude,
            lng: data.coords.longitude,
            key: this._userProvider.key
          });

        });
      })
      .catch( (error) => {
        console.log('Error getting location', error);
      });

  }

  stopGeolocation(){
    
    try{
      this.watch.unsubscribe();
    } catch ( e ) {
      console.error(JSON.stringify( e ));
    }

  }
}
