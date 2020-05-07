const BookmarksService = {
  getAllBookmarks(db) {
    return db("bookmark_table").select("*");
  },
  insertBookmark(db, article) {
    return db
      .into("bookmark_table")
      .insert(article)
      .returning("*")
      .then((rows) => rows[0]);
  },
  getById(db, id) {
    return db("bookmark_table").select("*").where("id", id).first();
  },
  deleteBookmark(db, id) {
    return db("bookmark_table").where({ id }).delete();
  },
  updateBookmark(db, id, newData) {
    return db("bookmark_table").where({ id }).update(newData);
  },
};

module.exports = BookmarksService;
