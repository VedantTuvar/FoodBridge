import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    user,
    token,
    isAuthenticated,
    role: user?.role,
    isVerified: user?.is_verified,
    logout,
  };
};
