const supertest = require("supertest");

export const userAuth = (done: any, setToken: any) => {
  const req = supertest("http://localhost:3500");

  const userRegistrationModel = {
    firstName: "MathiSudhanan",
    lastName: "M",
    email: "mathi_mca@hotmail.com",
    password: "1234",
    isActive: true,
  };

  req
    .post("/users")
    .send(userRegistrationModel)
    .then((resp: any) => {
      const userData = {
        email: "mathi_mca@hotmail.com",
        password: "1234",
      };
      // setTimeout(() => {
      req
        .post("/signin")
        .send(userData)
        .end((err: any, res: any) => {
          if (err) throw err;
          console.log("Before all: ");
          setToken(res);
          done();
        });
    });
};
