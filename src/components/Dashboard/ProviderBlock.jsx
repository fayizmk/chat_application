import React, { useState } from 'react';
import { Alert, Button, Icon, Tag } from 'rsuite';
import firebase from 'firebase/app';
import { auth } from '../../misc/firebase';

const ProviderBlock = () => {
  const [isConnected, setIsConnected] = useState({
    'google.com': auth.currentUser.providerData.some(
      data => data.providerId === 'google.com'
    ),
    'facebook.com': auth.currentUser.providerData.some(
      data => data.providerId === 'facebook.com'
    ),
  });

  const updateIsConnected = (providerId, value) => {
    setIsConnected(p => {
      return {
        ...p,
        [providerId]: value,
      };
    });
  };

  const unlink = async providerId => {
    try {
      if (auth.currentUser.providerData.length === 1) {
        throw new Error(`you cannot disconnect from ${providerId}`);
      }

      await auth.currentUser.unlink(providerId);
      updateIsConnected(providerId, false);
      Alert.info(`disconnected from ${providerId},4000 `);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };

  const unlinkGoogle = () => {
    unlink('google.com');
  };
  const unlinkFb = () => {
    unlink('facebook.com');
  };

  const link = async provider => {
    // console.log(auth.currentUser.linkWithPopup(provider));
    try {
      await auth.currentUser.linkWithPopup(provider);

      Alert.info(`linked to ${provider.providerId}`, 4000);
      updateIsConnected(provider.providerId, true);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };

  const linkGoogle = () => {
    link(new firebase.auth.GoogleAuthProvider());
  };
  const linkFb = () => {
    link(new firebase.auth.FacebookAuthProvider());
  };

  return (
    <div>
      {isConnected['google.com'] && (
        <Tag color="green" closable onClose={unlinkGoogle}>
          <Icon icon="google" /> connected
        </Tag>
      )}
      {isConnected['facebook.com'] && (
        <Tag color="blue" closable onClose={unlinkFb}>
          <Icon icon="facebook" /> connected
        </Tag>
      )}

      <div className="mt-2">
        {!isConnected['google.com'] && (
          <Button block color="green" onClick={linkGoogle}>
            <Icon icon="google" />
            connect to google
          </Button>
        )}
        {!isConnected['facebook.com'] && (
          <Button block color="blue" onClick={linkFb}>
            <Icon icon="facebook" />
            connect to facebook
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderBlock;
