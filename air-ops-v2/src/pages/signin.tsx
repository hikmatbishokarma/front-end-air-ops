// 'use client';
// import * as React from 'react';
// import Alert from '@mui/material/Alert';
// import LinearProgress from '@mui/material/LinearProgress';
// import { SignInPage } from '@toolpad/core/SignInPage';
// import { Navigate, useNavigate } from 'react-router';
// import { useSession, type Session } from '../SessionContext';
// import { signInWithCredentials } from '../firebase/auth';


// export default function SignIn() {
//   const { session, setSession, loading } = useSession();
//   const navigate = useNavigate();

//   if (loading) {
//     return <LinearProgress />;
//   }

//   if (session) {
//     return <Navigate to="/" />;
//   }

//   return (
//     <SignInPage
//       providers={[{ id: 'credentials', name: 'Credentials' }]}
//       signIn={async (provider, formData, callbackUrl) => {
//         let result;
//         try {
          
          
//           if (provider.id === 'credentials') {
//             const email = formData?.get('email') as string;
//             const password = formData?.get('password') as string;

//             if (!email || !password) {
//               return { error: 'Email and password are required' };
//             }

//             result = await signInWithCredentials(email, password);
//           }

//           if (result?.success && result?.user) {
//             const userSession: Session = {
//               user: {
//                 name: result.user.displayName || '',
//                 email: result.user.email || '',
//                 image: result.user.photoURL || '',
//               },
//             };
//             setSession(userSession);
//             navigate(callbackUrl || '/', { replace: true });
//             return {};
//           }
//           return { error: result?.error || 'Failed to sign in' };
//         } catch (error) {
//           return { error: error instanceof Error ? error.message : 'An error occurred' };
//         }
//       }}
        
//     />
//   );
// }
// janedoe@gmail.com
// password


'use client';
import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import type { Session } from '@toolpad/core/AppProvider';
import { useNavigate } from 'react-router';
import { useSession } from '../SessionContext';

const fakeAsyncGetSession = async (formData: any): Promise<Session> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (formData.get('password') === 'password') {
        resolve({
          user: {
            name: 'Bharat Kashyap',
            email: formData.get('email') || '',
            image: 'https://avatars.githubusercontent.com/u/19550456',
          },
        });
      }
      reject(new Error('Incorrect credentials.'));
    }, 1000);
  });
};

export default function SignIn() {
  const { setSession } = useSession();
  const navigate = useNavigate();
  return (
    <SignInPage
      providers={[{ id: 'credentials', name: 'Credentials' }]}
      signIn={async (provider, formData, callbackUrl) => {
        // Demo session
        try {
          const session = await fakeAsyncGetSession(formData);
          if (session) {
            setSession(session);
            navigate(callbackUrl || '/', { replace: true });
            return {};
          }
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'An error occurred' };
        }
        return {};
      }}
    />
  );
}