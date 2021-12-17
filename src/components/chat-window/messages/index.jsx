import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database } from '../../../misc/firebase';
import { transformToArrayWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
  const [message, setMessage] = useState(null);
  const { chatId } = useParams();

  const isChatEmpty = message && message.length === 0;
  const canShowMessages = message && message.length > 0;

  useEffect(() => {
    const messagesRef = database.ref('/messages');

    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = transformToArrayWithId(snap.val());
        setMessage(data);
      });

    return () => {
      messagesRef.off('value');
    };
  }, [chatId]);

  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`rooms/${chatId}/admins`);
      let alertMsg;
      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = 'admin permission removed';
          } else {
            admins[uid] = true;
            alertMsg = 'admin permission granted';
          }
        }
        return admins;
      });

      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async msgId => {
    const { uid } = auth.currentUser;

    const msgRef = database.ref(`messages/${msgId}`);

    let alertMsg;
    await msgRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = 'like removed';
        } else {
          msg.likeCount += 1;

          if (!msg.likes) {
            msg.likes = {};
          }

          msg.likes[uid] = true;
          alertMsg = 'like added';
        }
      }
      return msg;
    });

    Alert.info(alertMsg, 4000);
  }, []);

  const handleDelete = useCallback(
    async msgId => {
      // eslint-disable-next-line no-alert
      if (!window.confirm('Delete this message?')) {
        return;
      }
      const isLast = message[message.length - 1].id === msgId;

      const updates = {};

      updates[`/messages/${msgId}`] = null;

      if (isLast && message.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...message[message.length - 2],
          msgId: message[message.length - 2].id,
        };
      }
      if (isLast && message.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }
      try {
        await database.ref().update(updates);

        Alert.success('messages has been deleted', 4000);
      } catch (err) {
        Alert.error(err.message, 4000);
      }
    },
    [chatId, message]
  );

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages Yet</li>}
      {canShowMessages &&
        message.map(msg => (
          <MessageItem
            key={msg.id}
            messages={msg}
            handleAdmin={handleAdmin}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))}
    </ul>
  );
};

export default Messages;
