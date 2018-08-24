import { Subscription } from 'rxjs/Subscription';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserProvider {

  key: string;
  user: any = {};

  doc: Subscription

  constructor(private afDB: AngularFirestore,
              private storage: Storage,
              private platform: Platform) {}

  verifyUser( key: string){

    key = key.toLocaleLowerCase();

    return new Promise( (resolve, reject) => {

      this.doc = this.afDB.doc(`/usuarios/${ key }`)
        .valueChanges().subscribe( data => {

          if( data ){ //correcto
            this.key = key;
            this.user = data;
            this.saveStorage();
            resolve( true );
          } else //incorrecto
            resolve( false );
        });

    });

  }

  saveStorage(){

    if( this.platform.is('cordova') )

      this.storage.set('key', this.key);

    else 

      localStorage.setItem('key', this.key);

  }

  loadStorage(){

    return new Promise( (resolve, reject) => {

      if( this.platform.is('cordova') ){

        this.storage.get('key')
          .then( data => {

            if ( data ){

              this.key = data;
              resolve( true );

            } else resolve( false );

          });

      } else 

        if ( localStorage.getItem('key') ){

          this.key = localStorage.getItem('key');
          resolve( true );

        } else resolve( false );

    });
  }

  deleteUser(){
    this.key = null;

    if( this.platform.is('cordova')) this.storage.remove('key');
    else localStorage.removeItem('key');

    this.doc.unsubscribe();
  }

}
