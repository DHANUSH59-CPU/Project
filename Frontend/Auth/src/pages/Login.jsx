import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });
  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        className="card flex flex-col shadow-2xl rounded-lg w-96 h-[500px] p-6 gap-4"
      >
        <div>
          {" "}
          <h2 className="text-xl font-bold text-center">Login</h2>
        </div>

        <input
          {...register("emailId", { required: true })}
          className="input input-primary"
          placeholder="EmailId"
        />
        {errors.emailId && (
          <p className="text-red-400 text-sm">{errors.emailId.message}</p>
        )}
        <input
          {...register("password", { required: true })}
          className="input input-primary"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password.message}</p>
        )}
        <button className="btn">Submit</button>
      </form>
    </div>
  );
};

export default Login;
