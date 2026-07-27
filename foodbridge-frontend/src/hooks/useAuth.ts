import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout as logoutAction } from '../store/authSlice';
import { User } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    user: user as User | null,
    token,
    isAuthenticated,
    role: user?.role,
    isVerified: user?.is_verified,
    logout,
  };
};
