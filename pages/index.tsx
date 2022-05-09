import Layout from '../components/layout';

export default function IndexPage() {
  return (
    <Layout>
      <h1>NEAR University Certified Programs</h1>

      <p>Enroll in a program for free in just 3 steps:</p>
      <ol>
        <li>Confirm your email address.</li>
        <li>Tell us more about yourself.</li>
        <li>Choose a program.</li>
      </ol>
      <a href="/auth/signin" className="btn btn-lg btn-success">
        Get Started ➔
      </a>
    </Layout>
  );
}
