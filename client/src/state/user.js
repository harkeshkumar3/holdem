import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import {
  useAsyncEffect,
  useStoredState,
} from '../hooks';
import { Users } from '../api';
import { useError } from './error';

const Context = createContext(null);
const STORAGE_KEY = 'user-data';

function UserProvider({ children }) {
  const [data, setData] = useStoredState(STORAGE_KEY, {});
  const [token, setToken] = useState(null);

  const set = ({ token: nextToken, ...rest }) => {
    if (nextToken) {
      setToken(nextToken);
    }

    setData(rest);
  };

  const value = {
    ...data,
    token,
    set,
  };

  return (
    <Context.Provider value={value}>
      { children }
    </Context.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useUser() {
  const { set, ...data } = useContext(Context);
  return [data, set];
}

function useUserSync() {
  const [{
    id,
    name,
    avatarId,
    secret,
    token,
  }, setData] = useUser();
  const [, setError] = useError();

  useAsyncEffect(async (isValid) => {
    if (!token) {
      let nextData = null;

      if (id && secret) {
        const result = await Users.auth({ id, secret });

        nextData = {
          token: result.data.token,
        };
      } else {
        const s = uuid().replace(/-/g, '');
        const result = await Users.create({ secret: s });

        nextData = {
          id: result.data._id,
          token: result.data.token,
          secret: s,
        };
      }

      if (isValid()) {
        setData(nextData);
      }
    }
  }, [id, secret, token, setData]);

  useAsyncEffect(async (isValid) => {
    if (token && name && avatarId) {
      try {
        await Users.update({
          id,
          token,
          name,
          avatarId,
        });
      } catch (e) {
        if (isValid()) {
          setError(e);
        }
      }
    }
  }, [id, token, name, avatarId]);
}

export {
  UserProvider,
  useUser,
  useUserSync,
};
