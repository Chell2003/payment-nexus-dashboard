import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          switch (error.message) {
            case "Invalid login credentials":
              return "Invalid email or password. Please check your credentials and try again.";
            case "Email not confirmed":
              return "Please verify your email address before signing in.";
            case "Invalid Refresh Token: Refresh Token Not Found":
              return "Your session has expired. Please sign in again.";
            default:
              return error.message;
          }
        case 422:
          return "Invalid email format. Please check your email address.";
        case 429:
          return "Too many login attempts. Please try again later.";
        default:
          return "An authentication error occurred. Please try again.";
      }
    }
    return error.message;
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(getErrorMessage(sessionError));
          return;
        }
        if (session) {
          navigate("/");
        }
      } catch (err) {
        console.error('Auth error:', err);
        if (err instanceof AuthError) {
          setError(getErrorMessage(err));
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast.success('Successfully signed in!');
        navigate("/");
      }
      if (event === 'SIGNED_OUT') {
        setError(null);
      }
      if (event === 'USER_UPDATED') {
        checkSession();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ACS Manager Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in with your email and password
          </p>
        </div>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
            }}
            theme="light"
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;