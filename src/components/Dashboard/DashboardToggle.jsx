import React, { useCallback } from 'react';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import Dashboard from '.';
import { isOfflineForFirestore } from '../../context/profile.context';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks';
import { auth, database } from '../../misc/firebase';

const DashboardToggle = () => {
  const { isOpen, close, open } = useModalState();
  const isMobile = useMediaQuery('(max-width: 992px)');

  const onSignOut = useCallback(() => {
    database
      .ref(`status/${auth.currentUser.uid}`)
      .set(isOfflineForFirestore)
      .then(() => {
        auth.signOut();
        Alert.info('signed out', 4000);
      })
      .catch(err => {
        Alert.error(err.message, 4000);
      });

    close();
  }, [close]);

  return (
    <>
      <Button block color="blue" onClick={open}>
        <Icon icon="dashboard" /> Dashboard
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
        <Dashboard onSignOut={onSignOut} />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
