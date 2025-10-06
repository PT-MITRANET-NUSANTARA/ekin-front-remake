import { HttpStatusCode } from '@/constants';
import { AuthContext } from '@/context';
import { useLocalStorage, useService } from '@/hooks';
import { AuthService } from '@/services';
import env from '@/utils/env';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

/**
 * @typedef {{
 *  isSuccess: boolean;
 *  message: string;
 * }} Response
 */

/**
 * @type {React.Context<{
 *  login: (email: string, password: string) => Promise<Response>;
 *  logout: () => void;
 *  forgot: (email: string) => Promise<Response>;
 *  reset: (token: string, password: string) => Promise<Response>;
 *  token: string;
 *  user: import('@/models/User').default | null;
 *  isLoading: boolean;
 *  onUnauthorized: () => void;
 * }>}
 */

export default function AuthProvider({ children }) {
  const { execute: loginService, isLoading: loginIsLoading } = useService(AuthService.login);
  const { execute: getPhotoService, isLoading: getPhotoServiceLoading } = useService(AuthService.getPhoto);
  const { execute: forgotService, isLoading: forgotIsLoading } = useService(AuthService.forgot);
  const { execute: resetService, isLoading: resetIsLoading } = useService(AuthService.reset);
  const { execute: getUser, isLoading: getUserIsLoading } = useService(AuthService.me);
  const [token, setToken] = useLocalStorage('token', '');
  const [user, setUser] = useState(null);
  const [photoProfile, setPhotoProfile] = useState(null);

  env.dev(() => {
    window.token = token;
    window.user = user;
  });

  useEffect(() => {
    if (!token) {
      setUser(null);
      setPhotoProfile(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const { code, data: userData } = await getUser(token);
        if (code === HttpStatusCode.UNAUTHORIZED) {
          setToken(null);
          return;
        }
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        setToken(null);
      }
    };

    fetchUser();
  }, [getUser, setToken, token]);

  useEffect(() => {
    if (!token) {
      setPhotoProfile(null);
      return;
    }

    const controller = new AbortController();

    const fetchPhoto = async () => {
      try {
        const res = await getPhotoService(token, { signal: controller.signal });
        if (res?.data) {
          if (photoProfile) URL.revokeObjectURL(photoProfile);
          setPhotoProfile(res.data);
        }
      } catch (error) {
        if (error.name === 'CanceledError') return;
        console.error('Error fetching photo profile:', error);
      }
    };

    fetchPhoto();

    return () => {
      controller.abort();
    };
  }, [getPhotoService, photoProfile, token]);

  const login = useCallback(
    /**
     * @param {string} username
     * @param {string} password
     * @returns {Promise<Response>}
     */
    async (username, password) => {
      const { message, isSuccess, data: token } = await loginService(username, password);
      if (!isSuccess) return { message, isSuccess };

      setToken(token);
      return {
        isSuccess,
        message: 'Login berhasil'
      };
    },
    [loginService, setToken]
  );

  const forgot = useCallback(
    /**
     * @param {string} email
     * @returns {Promise<Response>}
     */
    async (email) => {
      const { message, isSuccess } = await forgotService(email);
      if (!isSuccess) return { message, isSuccess };

      return {
        isSuccess,
        message: 'Email reset kata sandi telah dikirim'
      };
    },
    [forgotService]
  );

  const reset = useCallback(
    /**
     * @param {string} token
     * @param {string} password
     * @param {string} confirmPassword
     * @returns {Promise<Response>}
     */
    async (token, password, confirmPassword) => {
      const { message, isSuccess } = await resetService(token, password, confirmPassword);
      if (!isSuccess) return { message, isSuccess };

      return {
        isSuccess,
        message: 'Kata Sandi berhasil direset'
      };
    },
    [resetService]
  );

  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const onUnauthorized = useCallback(() => logout(), [logout]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        forgot,
        reset,
        token,
        user,
        photoProfile,
        isLoading: loginIsLoading || getUserIsLoading || forgotIsLoading || resetIsLoading || getPhotoServiceLoading,
        onUnauthorized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
