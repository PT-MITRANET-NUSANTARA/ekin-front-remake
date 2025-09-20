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
  const { execute: logoutService, isLoading: logoutIsLoading } = useService(AuthService.logout);
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
      return;
    }

    const fetchUserAndPhoto = async () => {
      try {
        const { code, data: userData } = await getUser(token);
        if (code === HttpStatusCode.UNAUTHORIZED) {
          setToken('');
          return;
        }

        setUser(userData);

        const res = await getPhotoService(token);
        if (res?.data) {
          setPhotoProfile(res.data);
        }
      } catch (error) {
        console.error('Error fetching user or photo:', error);
        setToken('');
      }
    };

    fetchUserAndPhoto();
  }, [getPhotoService, getUser, setToken, token]);

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
    setToken('');
    logoutService(token);
  }, [logoutService, setToken, token]);

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
        isLoading: loginIsLoading || logoutIsLoading || getUserIsLoading || forgotIsLoading || resetIsLoading || getPhotoServiceLoading,
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
