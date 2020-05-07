/* eslint-disable quotes */
const app = require("../src/app");
const knex = require("knex");
const BookmarksService = require("../src/bookmarks-service");

describe("Bookmark endpoints", () => {
  let db;
  const dummyData = [
    {
      id: 1,
      title: "lotr1",
      url: "https://url.com",
      description: "one of 3",
      rating: 3,
    },
    {
      id: 2,
      title: "lotr2",
      url: "https://url.com",
      description: "one of 3",
      rating: 4,
    },
  ];
  const authTokenTest = "Bearer my-secret";
  before("copy the bookmarks", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });

  after("restore the bookmarks", () => {
    return db.destroy();
  });

  before("cleanup", () => {
    return db("bookmark_table").truncate();
  });

  afterEach("cleanup", () => {
    return db("bookmark_table").truncate();
  });

  // it('should return 200 "Hello world!"', () => {
  //   return supertest(app)
  //     .get("/")

  //     .expect(200, { message: "Hello world!" });
  // });

  //positive tests
  //200 on the three endpoints
  describe("GET all bookmarks", () => {
    context("GET all bookmarks happy path", () => {
      beforeEach("put some dummy data in the store", () => {
        return db.into("bookmark_table").insert(dummyData);
      });

      it("gets the bookmarks from the store", () => {
        return BookmarksService.getAllBookmarks(db).then((data) => {
          expect(data).to.eql(dummyData);
        });
      });

      it("should get a particular book by ID from store", () => {
        let id = 1;
        const expected = dummyData[0];
        return BookmarksService.getById(db, id).then((data) => {
          expect(data).to.eql(expected);
        });
      });

      it.skip("posts a bookmark to the store", () => {
        const postValues = {
          title: "test-title",
          url: "http://some.thing.com",
          rating: "1",
        };
        console.log(postValues);
        return supertest(app)
          .post("/bookmarks")
          .send(postValues)
          .set("Authorization", authTokenTest)
          .expect(201)
          .expect((res) => {
            expect(res.body.title).to.equal(postValues.title);
            expect(res.body.url).to.equal(postValues.url);
          });
      });
    });

    describe.skip("GET all bookmarks unhappy path", () => {
      it("should delete the bookmark specified by id", () => {
        return supertest(app)
          .delete("/bookmarks/0123")
          .set("Authorization", authTokenTest)
          .expect(201)
          .expect(store.filter((x) => x.id == "0123"))
          .to.equal("undefined");
      });
    });
  });

  //  .delete((req, res) => {
  //   const { id } = req.params;
  //   let delBm = data.findIndex((bm) => bm.id === id);

  //   if (delBm === -1) {
  //     logger.error(`Failed to delete : Bookmark ${delBm.title} `);
  //     return res.status(404).send(`Bookmark with id ${id} was not found`);
  //   }

  //   data.splice(delBm, 1);
  //   logger.info(
  //     `Successful delete : Bookmark ${delBm.title} was deleted with id: ${delBm.id}`
  //   );
  //   res.status(201).send(`Bookmark with id ${id} was deleted`);
  // });

  // describe();

  //negative tests
  //400 on all the expected endpoints

  //proper token passes
  //junk token fails

  //missing bearer fails
  //having bearer passes
});
