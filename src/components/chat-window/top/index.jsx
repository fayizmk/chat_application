import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Icon } from 'rsuite';
import { useCurrentRoom } from '../../../context/currentRoom.context';
import { useMediaQuery } from '../../../misc/custom-hooks';
import EditRoomBtnDrawer from './EditRoomBtnDrawer';
import RoomInfoBtnModel from './RoomInfoBtnModel';

const Top = () => {
  const name = useCurrentRoom(val => val.name);
  const isMobile = useMediaQuery('(max-width : 992px)');

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="text-disappear d-flex align-items-center">
          <Icon
            componentClass={Link}
            to="/"
            icon="arrow-circle-left"
            size="2x"
            className={
              isMobile
                ? 'd-inline-block p-0 mr-2 text-blue link-unstyled'
                : 'd-none'
            }
          />
          <span className="text-disappear">{name}</span>
        </h4>

        <ButtonToolbar className="ws-nowrap">
          <EditRoomBtnDrawer />
        </ButtonToolbar>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <span>todo</span>
        <RoomInfoBtnModel />
      </div>
    </div>
  );
};

export default memo(Top);
