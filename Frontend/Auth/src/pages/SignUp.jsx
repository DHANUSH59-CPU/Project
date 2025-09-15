import React from "react";
import { useForm } from "react-hook-form";
import FloatingShape from "../ui/FloatingShape";
import { motion } from "framer-motion";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <motion.div>
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative">
        <form onSubmit={handleSubmit((data) => console.log(data))}>
          <input {...register("firstName")} />
          <input {...register("lastName")} />
          {errors.lastName && <p>Last name is required.</p>}
          <input {...register("age", { pattern: /\d+/ })} />
          {errors.age && <p>Please enter number for age.</p>}
          <button className="btn">Submit</button>
        </form>
      </div>
    </motion.div>
  );
};

export default SignUp;
