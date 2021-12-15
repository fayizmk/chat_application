import React, { memo } from 'react';
import { Button, Modal } from 'rsuite';
import { useCurrentRoom } from '../../../context/currentRoom.context';
import { useModalState } from '../../../misc/custom-hooks';

const RoomInfoBtnModel = () => {
  const { isOpen, close, open } = useModalState();

  const description = useCurrentRoom(val => val.description);
  const name = useCurrentRoom(val => val.name);

  return (
    <>
      <Button appearance="link" className="px-0" onClick={open}>
        Room info
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>About {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="mb-1">Description</h6>
          <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button block onClick={close}>
            close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(RoomInfoBtnModel);
