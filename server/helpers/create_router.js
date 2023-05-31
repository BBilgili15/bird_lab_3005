const express = require('express');
const ObjectID = require('mongodb').ObjectID;

const createRouter = function (collection) {

  const router = express.Router();

  router.get('/', (req, res) => {
    collection
      .find()
      .toArray()
      .then((docs) => res.json(docs)) 
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  router.get('/:id', (req, res) => {
    const id = req.params.id;
    collection
      .findOne({ _id: ObjectID(id) })
      .then((doc) => res.json(doc))
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  router.post('/', (req, res) => {
    const newBirdData = req.body
    collection.insertOne(newBirdData)
    .then((result) => {
      res.json(result.ops[0])
    }) // .ops[0] returns the first item in the array. Which is the thing we've added (index 0)
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json({ status: 500, error: err });
    });
  })

  router.delete('/:id', (req, res) => {
    const id = req.params.id;
    collection.deleteOne({_id: ObjectID(id)})
    .then(() => collection.find().toArray())
    // once we've deleted, we're getting the state of things back. Find() does it gradually. ToArray bangs them all in a list 
    // ToArray not good code if we have massive data. Find() would be useful 
    .then((result) => res.json(result)) 
    .catch((err) => {
      console.error(err);
      res.status(500);
      res.json({ status: 500, error: err });
    });
  })


  // best to have specific error codes in future rather than just 'err 500'

  return router;
};

module.exports = createRouter;
