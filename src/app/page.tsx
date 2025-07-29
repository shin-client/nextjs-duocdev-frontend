import ButtonRedirect from "./components/ButtonRedirect";

export default function Home() {
  console.log("home page");
  return (
    <div>
      <ButtonRedirect url="/login" label="Login" />
      <ButtonRedirect url="/register" label="Register" />
    </div>
  );
}
