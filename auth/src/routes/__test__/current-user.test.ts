import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  const cookie = await (global as any).signup();

  if (cookie) {
    const response = await request(app)
      .get("/api/users/currentuser")
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toEqual("test@test.com");
  } else {
    console.log("Cookie is undefined");
  }
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(response.body.currentUser).toBeNull();
});
