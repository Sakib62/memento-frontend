const apiUrl = import.meta.env.VITE_API_URL;

interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  identifier: string;
  password: string;
}

interface LoginResponse {
  data: {
    token: string;
  };
  message?: string;
}

export const loginUser = async (
  loginData: LoginData
): Promise<LoginResponse> => {
  const response = await fetch(`${apiUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

export const registerUser = async (registerData: RegisterData) => {
  const response = await fetch(`${apiUrl}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerData),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
};
