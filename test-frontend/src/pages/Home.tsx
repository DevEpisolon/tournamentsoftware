import { auth } from "../utils/FirbaseConfig";

function Home() {
  return (
    <div>
      <p>Hello World</p>
      <button
        onClick={() => {
          auth.signOut();
        }}
      >
        Sign OUt
      </button>
    </div>
  );
}

export default Home;
