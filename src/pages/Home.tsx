import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold mb-4">
        Redirect to stock list page{" "}
        <Link className="text-green-500" to="/stock-list">
          click here
        </Link>
      </h1>
      <p className="text-xl text-gray-700">
        Delivering top-notch services with a focus on excellence.
      </p>
    </div>
  );
};

export default Home;
