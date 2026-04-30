import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";

export function LoginPage() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <h1>Login Page</h1>
      <Button onClick={() => loginWithRedirect()}>Login</Button>
    </div>
  );
}