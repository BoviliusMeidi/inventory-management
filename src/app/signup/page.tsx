import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="flex flex-row items-center justify-around h-screen">
      <Image src="/logo-BM.svg" width={300} height={200} alt="Logo BM" />
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Image src="/logo-BM.svg" width={60} height={30} alt="Logo BM" />
        <h1 className="font-bold text-4xl">Create an account</h1>
        <p className="opacity-70">Start your 30-day free trial.</p>
        <form action="" className="flex flex-col gap-4 w-100">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-800 font-semibold">
              Name
            </label>
            <input
              id="name"
              type="username"
              className="border border-gray-600 outline-none rounded-md p-2 focus:ring-1 focus:ring-gray-600 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-800 font-semibold">
            Email
            </label>
            <input
              id="email"
              type="email"
              className="border border-gray-600 outline-none rounded-md p-2 focus:ring-1 focus:ring-gray-600 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-800 font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="border border-gray-600 outline-none rounded-md p-2 focus:ring-1 focus:ring-gray-600 focus:outline-none"
              placeholder="Enter your password"
            />
            <p className="text-gray-600">
              Must be at least 8 characters.
            </p>
          </div>
          <button className="cursor-pointer rounded-md p-1 bg-blue-600 text-white">
            Get Started
          </button>
          <button className="cursor-pointer border border-gray-400 outline-none rounded-md p-1 focus:ring-1 focus:ring-gray-600 focus:outline-none flex justify-center items-center gap-2">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              width={20}
              height={20}
              alt="google-logo"
            />
            Sign Up with Google
          </button>
        </form>
        <div className="flex gap-2">
          <p className="opacity-70">Already have an account?</p>
          <p>
            <a href="/login" className="text-blue-700">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
