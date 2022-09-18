import cookie from "cookie";

const handler = (req, res) => {
  if (req.method === "POST") {
  const {adminMatch} = req.body;
    if (
        adminMatch === true
    ) {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", process.env.TOKEN, {
          maxAge: 60 * 60 * 24,
          sameSite: "strict",
          path: "/",
        })
      );
      res.status(200).json("Succesfull");
    } else {
      res.status(400).json("Wrong Credentials!");
    }
  }
};

export default handler;


