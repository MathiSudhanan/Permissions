import { userAuth } from "./setup";

require("jest");
require("mocha");
const supertest = require("supertest");
const {
  categoriesList,
  statsList,
  companyList,
  userGroupList,
} = require("../data/data");
const timeout = 60000;
let token = "";
const req = supertest("http://localhost:3500");

describe("Sample Test category", () => {
  categoriesList.forEach((element: any) => {
    test(
      "should test that true === true",
      (done) => {
        req
          .post("/category")
          .send(element)
          .set("Authorization", "Bearer " + token)
          .end((err: any, res: any) => {
            if (err) throw err;
            expect(res.status).toBe(201);
            done();
          });
      },
      timeout
    );
  });
});

describe("Sample Test Stats", () => {
  jest.setTimeout(timeout);

  statsList.forEach((element: any) => {
    test(
      "should test that true === true",
      (done) => {
        req
          .post("/stat")
          .send(element)
          .set("Authorization", "Bearer " + token)
          .end((err: any, res: any) => {
            if (err) throw err;
            expect(res.status).toBe(201);
            done();
          });
      },
      timeout
    );
  });
});

describe("Sample Test Company", () => {
  jest.setTimeout(timeout);

  companyList.forEach((element: any) => {
    test(
      "should test that true === true",
      (done) => {
        req
          .post("/company")
          .send(element)
          .set("Authorization", "Bearer " + token)
          .end((err: any, res: any) => {
            if (err) throw err;
            expect(res.status).toBe(201);
            done();
          });
      },
      timeout
    );
  });
});

describe("Sample Test User Group", () => {
  jest.setTimeout(timeout);

  userGroupList.forEach((element: any) => {
    test(
      "should test that true === true",
      (done) => {
        req
          .post("/userGroup")
          .send(element)
          .set("Authorization", "Bearer " + token)
          .end((err: any, res: any) => {
            if (err) throw err;
            expect(res.status).toBe(201);
            done();
          });
      },
      timeout
    );
  });
});

beforeAll((done) => {
  userAuth(done, (res: any) => {
    token = res.body.token;
  });
});
