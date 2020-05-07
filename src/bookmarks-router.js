const express = require("express");
const data = require("./store");
const { v4: uuid } = require("uuid");
const logger = require("./logger");
const BookmarksService = require('./bookmarks-service');

const bmRouter = express.Router();
const dataParser = express.json();

bmRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookmarksService.getAllBookmarks(knexInstance)
      .then(articles => {
        res.json(articles)
      })
      .catch(next);
  })
  .post(dataParser, (req, res) => {
    const { title, rating, url, description } = req.body;
    const id = uuid();

    if (!title || !url) {
      logger.error("Failed post : User didn't supply title or URL");
      res.status(400).json({ error: "Title and URL are required" });
    }

    const newBm = {
      id,
      title,
      rating,
      url,
      description,
    };

    data.push(newBm);
    logger.info(`Successful post : Bookmark ${title} was added with id: ${id}`);
    res.status(201).json(newBm);
  });

bmRouter
  .route("/:id")
  .get((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get('db');
    // let userBm = knexInstance('bookmark_table').where('id', id);

    BookmarksService.getById(knexInstance, id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`No bookmark exists!`);
          return res.status(404).json({error: `Bookmark was not found`});
        }
    
        logger.info(
          `Successful get : Bookmark ${bookmark.title} was retrieved with id: ${bookmark.id}`
        );

        res.json(bookmark)
      })
      .catch(next);
  })
  .delete((req, res) => {
    const { id } = req.params;
    let delBm = data.findIndex((bm) => bm.id === id);

    if (delBm === -1) {
      logger.error(`Failed to delete : Bookmark ${delBm.title} `);
      return res.status(404).send(`Bookmark with id ${id} was not found`);
    }

    data.splice(delBm, 1);
    logger.info(
      `Successful delete : Bookmark ${delBm.title} was deleted with id: ${delBm.id}`
    );
    res.status(201).send(`Bookmark with id ${id} was deleted`);
  });

module.exports = bmRouter;
