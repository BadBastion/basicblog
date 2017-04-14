const fs = require('fs');
var Lazy = require('../other_modules/lazy.js');
//Lazy is a standard Stream API (like low-dash, just with Lazy evaluation)

const all = function(){
  const unparsedPosts = fs.readFileSync("models/posts.json");
  return JSON.parse(unparsedPosts);
};

const recent = function(){
  return ( //Recent posts first
    Lazy(all().posts)
      .sort((a, b) => b.id >= a.id)
      .toArray()
  );
};

const get = function(id){
  return (
  Lazy(all().posts)
      .filter(post => {
      console.log(post.id, id);
        return post.id == id;
      })
      .take(1)
      .get(0)
  );
};

const add = function(post){
  post.id = all().increment;

  const json = JSON.stringify({
    "increment": all().increment + 1,
    "posts": all().posts.concat(post)
  });

  fs.writeFileSync("models/posts.json", json);
  return this;
};


const remove = function(id){
  id = parseInt(id);
  const filtered = (
    Lazy(all().posts)
      .filter(post =>  post.id !== id)
      .toArray()
  );

  const json = JSON.stringify({
    "increment": all().increment,
    "posts": filtered
  });

  fs.writeFileSync("models/posts.json", json);
  return recent();
};

const edit = function(updatedPost){
  updatedPost.created = get(parseInt(updatedPost.id)).created;
  remove(updatedPost.id);

  const json = JSON.stringify({
    "increment": all().increment,
    "posts": all().posts.concat(updatedPost)
  });

  fs.writeFileSync("models/posts.json", json);
  return this;
};

exports.all = all;
exports.recent = recent;
exports.get = get;
exports.add = add;
exports.remove = remove;
exports.edit = edit;
