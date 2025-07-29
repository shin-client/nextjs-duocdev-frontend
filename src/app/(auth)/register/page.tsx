import RegisterForm from "./register-form";

const RegisterPage = () => {
  return (
    <div>
      <h1 className="text-center text-2xl font-semibold">Đăng ký</h1>
      <div className="flex justify-center">
        <RegisterForm />
      </div>
    </div>
  );
};
export default RegisterPage;
