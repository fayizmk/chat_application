import React, { memo } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Drawer } from 'rsuite';
import { useCurrentRoom } from '../../../context/currentRoom.context';
import { useMediaQuery, useModalState } from '../../../misc/custom-hooks';
import { database } from '../../../misc/firebase';
import EditableInput from '../../Dashboard/EditableInput';

const EditRoomBtnDrawer = () => {
  const { isOpen, open, close } = useModalState();
  const { chatId } = useParams();
  const name = useCurrentRoom(v => v.name);
  const description = useCurrentRoom(v => v.description);
  const isMobile = useMediaQuery('(max-width: 992px)');

  const updateData = (key, value) => {
    database
      .ref(`roooms/${chatId}`)
      .child(key)
      .set(value)
      .then(() => {
        Alert.success('successfully updated', 4000);
      })
      .catch(err => {
        Alert.error(err.message, 4000);
      });
  };

  const onNameSave = newName => {
    updateData('name', newName);
  };
  const onDsave = newD => {
    updateData('description', newD);
  };

  return (
    <div>
      <Button className="br-circle" size="sm" color="red" onClick={open}>
        A
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close} placement="right">
        <Drawer.Header>
          <Drawer.Title>Edit room</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <EditableInput
            initialValue={name}
            onSave={onNameSave}
            label={<h6 className="mb-2">Name</h6>}
            emptyMsg="Name cannot be empty"
          />

          <EditableInput
            componentClass="textarea"
            rows={5}
            initialValue={description}
            onSave={onDsave}
            emptyMsg="Description cannot be empty"
            wrapperClassName="mt-3"
          />
        </Drawer.Body>
        <Drawer.Footer>
          <Button block onClick={close}>
            close
          </Button>
        </Drawer.Footer>
      </Drawer>
    </div>
  );
};

export default memo(EditRoomBtnDrawer);
