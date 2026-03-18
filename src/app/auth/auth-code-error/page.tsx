import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Authentication Error</h1>
      <p>There was an error during the authentication process. Please try again.</p>
      <Link href="/">Go back to home</Link>
    </div>
  );
}
