const apiUrl = import.meta.env.VITE_API_URL;

interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface SignInData {
  identifier: string;
  password: string;
}

interface SignInResponse {
  data: {
    token: string;
  };
  message?: string;
}

export const signInUser = async (
  signInData: SignInData
): Promise<SignInResponse> => {
  const response = await fetch(`${apiUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signInData),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Sign In Failed');
  }

  return data;
};

export const signUpUser = async (signUpData: SignUpData) => {
  const response = await fetch(`${apiUrl}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signUpData),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Sign Up Failed');
  }

  return data;
};
