
import React from "react";
import { CardFooter } from "@/components/ui/card";

const AuthFooter = () => {
  return (
    <CardFooter className="flex-col space-y-2">
      <div className="text-xs text-center text-gray-500 mt-2">
        By continuing, you agree to PrismWork, Inc.'s{" "}
        <a
          href="https://www.prismwork.com/terms-and-conditions"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="https://www.prismwork.com/terms-and-conditions"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
        .
      </div>
    </CardFooter>
  );
};

export default AuthFooter;
