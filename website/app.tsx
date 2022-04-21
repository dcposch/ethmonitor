import * as React from "react";
import ReactDOM from "react-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Signup from "./components/Signup";
import Summary from "./components/Summary";

ReactDOM.render(<App />, document.querySelector("#root"));

function App() {
  return (
    <main>
      <Header />
      <Summary />
      <Signup />
      <br />
      <br />
      <br />
      <Footer />
    </main>
  );
}
