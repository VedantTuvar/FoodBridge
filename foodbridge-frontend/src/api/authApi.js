import api from './axios';

export const authApi = {
  sendOTP: (phoneNumber) => 
    api.post('/auth/otp/send/', { phone_number: phoneNumber }),
    
  verifyOTP: (phoneNumber, otpCode) => 
    api.post('/auth/otp/verify/', { phone_number: phoneNumber, otp_code: otpCode }),
    
  loginWithEmailPassword: (identity, password) => 
    api.post('/auth/login/', { identity, password }),
    
  register: (data) => 
    api.post('/auth/register/', data),
    
  forgotPassword: (identity) => 
    api.post('/auth/forgot-password/', { identity }),
    
  resetPassword: (token, newPassword) => 
    api.post('/auth/reset-password/', { token, new_password: newPassword }),
    
  verifyEmail: (token) => 
    api.post('/auth/verify-email/', { token }),
    
  logout: (refreshToken) => 
    api.post('/auth/logout/', { refresh_token: refreshToken }),
    
  getCurrentUser: () => 
    api.get('/auth/me/'),
};
