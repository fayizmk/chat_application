import React, { createContext, useContext, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { auth, database } from '../misc/firebase';

export const isOfflineForFirestore = {
  state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForFirestore = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    let userStatusFirestoreRef;

    const unSub = auth.onAuthStateChanged(authObj => {
      if (authObj) {
        userStatusFirestoreRef = database.ref(`/status/${authObj.uid}`);
        userRef = database.ref(`/profiles/${authObj.uid}`);

        console.log(userRef);

        userRef.on('value', snap => {
          const { name, createdAt, avatar } = snap.val();

          const data = {
            name,
            avatar,
            createdAt,
            uid: authObj.uid,
            email: authObj.email,
          };

          setProfile(data);
          setIsLoading(false);
        });

        database.ref('.info/connected').on('value', snapshot => {
          if (snapshot.val() === false) {
            return;
          }

          userStatusFirestoreRef
            .onDisconnect()
            .set(isOfflineForFirestore)
            .then(() => {
              userStatusFirestoreRef.set(isOnlineForFirestore);
            });
        });
      } else {
        if (userRef) {
          userRef.off();
        }

        if (userStatusFirestoreRef) {
          userStatusFirestoreRef.off();
        }
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      if (userRef) {
        userRef.off();
      }
      if (userStatusFirestoreRef) {
        userStatusFirestoreRef.off();
      }

      unSub();
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
