import { useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login() {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error(e);
      setError("Login failed. Check the browser console.");
    }
  }

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h1>Admin dashboard</h1>
      {user ? (
        <>
          <p>Signed in as {user.email}</p>
          <button onClick={() => signOut(auth)}>Sign out</button>
          <p>Dashboard coming in the next step.</p>
        </>
      ) : (
        <>
          <button style={{ fontSize: 20, padding: "12px 24px" }} onClick={login}>
            Sign in with Google
          </button>
          {error && <p>{error}</p>}
        </>
      )}
      <p><a href="#">← Back to app</a></p>
    </div>
  );
}