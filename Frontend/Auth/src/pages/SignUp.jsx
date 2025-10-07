import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/authSlice";
import GoogleLoginButton from "../components/GoogleLoginButton";

// Zod Schema (validations)
const signupScheme = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" })
    .max(20, { message: "First name must be less than 20 characters" }),

  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" })
    .max(20, { message: "Last name must be less than 20 characters" }),

  emailId: z.string().email({ message: "Invalid email address" }),

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

  // confirmPassword: z.string(),
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.authSlice
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupScheme),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  // Submit Handler
  const onSubmit = async (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">SignUp Now!</h1>
          <p className="py-6">
            Join AlgoMaster to practice coding, compete with peers, and elevate your
            problem-solving abilities to new heights.
          </p>
        </div>
        <form
          className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="card-body">
            <fieldset className="fieldset">
              <label className="label">FirstName</label>

              <input
                {...register("firstName")}
                placeholder="First Name"
                className="input input-primary"
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm">
                  {errors.firstName.message}
                </p>
              )}

              <label className="label">lastName</label>

              <input
                {...register("lastName")}
                placeholder="Last Name"
                className="input input-primary"
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm">
                  {errors.lastName.message}
                </p>
              )}

              <label className="label">Email</label>

              <input
                {...register("emailId")}
                placeholder="Email Address"
                className="input input-primary"
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
                <a
                  className="link link-hover"
                  onClick={() => navigate("/login")}
                >
                  Alredy Registered?? Sign in
                </a>
              </div>
              <button
                type="submit"
                className="btn btn-neutral mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "submitting" : "Sign Up"}
              </button>
              
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

export default SignUp;
