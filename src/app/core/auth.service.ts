import { Injectable } from '@angular/core';

import { auth, firestore } from 'firebase';
import { AngularFireAuth} from 'angularfire2/auth';
import {  AngularFirestore,
          AngularFirestoreCollection,
          AngularFirestoreDocument } from 'angularfire2/firestore';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { switchMap, first} from 'rxjs/operators';

interface User {
  uid: String;
  email: String;
  displayName?: String;
  photoURL?: String;
  company?: String;
}
interface Message {
  uid: String;
  user: String;
  company?: String;
  message: String;
  timestamp: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User>;
  message$: Observable<Message[]>;
  userData: User;
  noUserData: Boolean;
  inputCompany: Boolean = false;
  company: String = '';
  message: String = '';

  userDocRef: AngularFirestoreDocument<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) {

    this.user = this.afAuth.authState.pipe(
      switchMap( user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
    }));
    this.message$ = this.afs.collection<Message>('publicMessages', ref => {
        return ref.orderBy('timestamp', 'desc');
      }).valueChanges();
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.checkDoc('users', credential.user.uid).then(() => {
          this.updateUserData(credential.user);
          this.user.subscribe( ref => {
            this.userDocRef = this.afs.doc(`users/${ref.uid}`);
          });
        });
      });
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      console.log('userOnine on logout');
    });
  }

  private updateUserData(user) {

    this.userDocRef = this.afs.doc(`users/${user.uid}`);
    return this.userDocRef.set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }, {merge: true});
  }

  UpdateCompany() {
    return this.userDocRef.update({company: this.company})
            .then( () => {
              this.inputCompany = false;
            });
  }

  private checkDoc(col: string, docId: string) {
    return new Promise( (resolve, reject) => {
      // Check id doc exist for inputCompany
      const docRef = this.afs.collection(col).doc(docId);
      docRef.ref.get().then(doc => {
          if (doc.exists) {
            console.log('doc' + doc.exists);
            this.inputCompany = false;
          } else {
            console.log('doc' + doc.exists);
            this.inputCompany = true;
          }
          resolve('Success!');
      }).catch( err => {
        reject('checkDoc Failed');
      });
    });
  }

  sendMessage() {
    const messagePubliCollection = this.afs.collection<Message>('publicMessages');

    this.user.subscribe( ref => {
      if (ref) {
        return messagePubliCollection.add({
          uid: ref.uid,
          user: ref.displayName,
          company: ref.company,
          message: this.message,
          timestamp: firestore.FieldValue.serverTimestamp()
        });
      }
    });
  }
}
