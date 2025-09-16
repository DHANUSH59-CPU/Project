import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

// Zod Schema (validations)
const signupScheme = z
  .object({
    firstName: z
      .string()
      .min(3, { message: "First name must be at least 3 characters" })
      .max(20, { message: "First name must be less than 20 characters" }),

    lastName: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters" })
      .max(20, { message: "Last name must be less than 20 characters" }),

    profile_img: z
      .string()
      .url({ message: "Profile image must be a valid URL" })
      .optional()
      .or(z.literal("")), // allow empty

    emailId: z.string().email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(100, { message: "Password too long" }),

    confirmPassword: z.string(),

    age: z
      .string()
      .regex(/^\d+$/, { message: "Age must be a number" })
      .transform((val) => Number(val))
      .refine((val) => val >= 6 && val <= 80, {
        message: "Age must be between 6 and 80",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupScheme),
  });

  // Submit Handler
  const onSubmit = async (data) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        profile_img: data.profile_img || null,
        emailId: data.emailId,
        password: data.password,
        age: data.age,
      };

      // const res = await axios.post("http://localhost:5000/api/signup", payload);

      alert("Signup successful!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Signup failed. Check console for details.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-scree">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col  gap-4 p-6 rounded-lg shadow-2xl w-96"
      >
        <h2 className="text-xl font-bold text-center">Sign Up</h2>

        <input
          {...register("firstName")}
          placeholder="First Name"
          className="input input-primary"
        />
        {errors.firstName && (
          <p className="text-red-400 text-sm">{errors.firstName.message}</p>
        )}

        <input
          {...register("lastName")}
          placeholder="Last Name"
          className="input input-primary"
        />
        {errors.lastName && (
          <p className="text-red-400 text-sm">{errors.lastName.message}</p>
        )}

        <input
          {...register("profile_img")}
          placeholder="Profile Image URL (optional)"
          className="input input-primary"
        />
        {errors.profile_img && (
          <p className="text-red-400 text-sm">{errors.profile_img.message}</p>
        )}

        <input
          {...register("emailId")}
          placeholder="Email Address"
          className="input input-primary"
        />
        {errors.emailId && (
          <p className="text-red-400 text-sm">{errors.emailId.message}</p>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="input input-primary"
        />
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password.message}</p>
        )}

        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm Password"
          className="input input-primary"
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        <input
          {...register("age")}
          placeholder="Age"
          className="input input-primary"
          type="number"
        />
        {errors.age && (
          <p className="text-red-400 text-sm">{errors.age.message}</p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn">
          {isSubmitting ? "Submitting..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
