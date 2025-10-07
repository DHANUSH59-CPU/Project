import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import GoogleLoginButton from "../components/GoogleLoginButton";

const loginSchema = z.object({
  emailId: z.string().email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&#]/, {
      message: "Password must contain at least one special character",
    }),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.authSlice
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const submitted = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Join AlgoMaster to practice coding, compete with peers, and elevate your
            problem-solving abilities to new heights.
          </p>
        </div>
        <form
          className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl"
          onSubmit={handleSubmit(submitted)}
        >
          <div className="card-body">
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input
                {...register("emailId")}
                type="email"
                className="input input-primary"
                placeholder="Email"
              />
              {errors.emailId && (
                <p className="text-red-400 text-sm">{errors.emailId.message}</p>
              )}

              <label className="label">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="input input-primary"
              />
              {errors.password && (
                <p className="text-red-400 text-sm">
                  {errors.password.message}
                </p>
              )}
              <div>
                <p
                  className="link link-hover"
                  onClick={() => navigate("/signup")}
                >
                  Don't have an account? SignUp
                </p>
                {error && error != "Unauthorized - no token provided" && (
                  <p className="text-red-900 mt-4">{error}</p>
                )}
              </div>
              <button className="btn btn-neutral mt-4">Login</button>

              {/* Divider */}
              <div className="divider">OR</div>

              {/* Google Login Button */}
              <GoogleLoginButton className="w-full" />
            </fieldset>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

//  <div className="bg-gray-900/70  backdrop-blur-lg p-8 rounded-2xl shadow-xl max-w-md mx-auto border border-gray-700 hover:border-indigo-500 transition mt-20">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="flex flex-col  gap-4 p-6 rounded-lg shadow-2xl w-96"
//       >
//         <h2 className="text-xl font-bold text-center">Sign Up</h2>

// <input
//   {...register("firstName")}
//   placeholder="First Name"
//   className="input input-primary"
// />
// {errors.firstName && (
//   <p className="text-red-400 text-sm">{errors.firstName.message}</p>
// )}
//
// <input
//   {...register("lastName")}
//   placeholder="Last Name"
//   className="input input-primary"
// />
// {errors.lastName && (
//   <p className="text-red-400 text-sm">{errors.lastName.message}</p>
// )}

// <input
//   {...register("emailId")}
//   placeholder="Email Address"
//   className="input input-primary"
// />
// {errors.emailId && (
//   <p className="text-red-400 text-sm">{errors.emailId.message}</p>
// )}

// <input
//   {...register("password")}
//   type="password"
//   placeholder="Password"
//   className="input input-primary"
// />
// {errors.password && (
//   <p className="text-red-400 text-sm">{errors.password.message}</p>
// )}

//         <input
//           {...register("confirmPassword")}
//           type="password"
//           placeholder="Confirm Password"
//           className="input input-primary"
//         />
//         {errors.confirmPassword && (
//           <p className="text-red-400 text-sm">
//             {errors.confirmPassword.message}
//           </p>
//         )}

//         <button type="submit" disabled={isSubmitting} className="btn">
//           {isSubmitting ? "Submitting..." : "Sign Up"}
//         </button>
//       </form>
//     </div>
//   );
// };
