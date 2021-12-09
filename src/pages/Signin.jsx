import React from 'react';
import firebase from 'firebase/app';
import { Button, Col, Container, Grid, Icon, Panel, Row, Alert } from 'rsuite';
import { auth, database } from '../misc/firebase';

const Signin = () => {
  const signInWithProvider = async provider => {
    const cra = await auth.signInWithPopup(provider);
    console.log('result', cra);

    try {
      const [additionalUserInfo, user] = auth.signInWithPopup(provider);

      if (additionalUserInfo.isNewUser) {
        await database.ref(`/profiles/${user.id}`).set({
          name: user.displayName,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      Alert.success('signed in', 4000);
    } catch (err) {
      Alert.info(err.message, 4000);
    }
  };

  const onFacebookSignin = () => {
    signInWithProvider(new firebase.auth.FacebookAuthProvider());
  };
  const onGoogleSignin = () => {
    signInWithProvider(new firebase.auth.GoogleAuthProvider());
  };

  return (
    <Container>
      <Grid className="mt-page">
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
            <Panel>
              <div className="text-center">
                <h2>Welcome to chat</h2>
                <p>Progressive chat platform </p>
              </div>
              <div className="mt-3">
                <Button block color="blue" onClick={onFacebookSignin}>
                  <Icon icon="facebook" />
                  continue with facebook
                </Button>
                <Button block color="green" onClick={onGoogleSignin}>
                  <Icon icon="google" />
                  continue with google
                </Button>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default Signin;
