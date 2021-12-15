import React, { memo } from 'react';
import { useCurrentRoom } from '../../../context/currentRoom.context';

const Top = () => {
  const name = useCurrentRoom(val => val.name);

  return <div>{name}</div>;
};

export default memo(Top);
