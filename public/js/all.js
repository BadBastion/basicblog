"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//PostsList.js
var PostsList = function PostsList(props) {
  return React.createElement(
    "div",
    null,
    props.posts.map(function (post) {
      return React.createElement(
        "div",
        { className: "listpost" },
        React.createElement(
          "div",
          { className: "float-left padded-left" },
          post.title
        ),
        React.createElement(
          "div",
          { className: "float-right padded-right" },
          "Post #: ",
          post.id + 1
        )
      );
    })
  );
};

//PostsView.js
var PostsView = function PostsView(props) {
  return React.createElement(
    "div",
    { id: "posts-view", className: "float-right" },
    React.createElement(
      "div",
      { id: "search" },
      React.createElement(
        "form",
        null,
        "Search By Title :",
        React.createElement("input", { type: "text", name: "search",
          onChange: function onChange(event) {
            return props.filter(event.target.value);
          } })
      )
    ),
    props.posts.map(function (post) {
      return React.createElement(
        "div",
        { className: "post", key: post.id },
        React.createElement(
          "div",
          { className: "header centered" },
          post.title
        ),
        React.createElement(
          "div",
          { className: "date centered" },
          "Created : ",
          post.created
        ),
        React.createElement(
          "div",
          { className: "content" },
          post.content
        ),
        React.createElement(
          "div",
          { className: "buttons" },
          React.createElement(
            "div",
            { className: "float-right padded-right" },
            React.createElement(
              "button",
              { onClick: function onClick(e) {
                  return props.remove(post.id);
                } },
              "remove"
            )
          ),
          React.createElement(
            "div",
            { className: "float-right padded-right" },
            React.createElement(
              "button",
              { onClick: function onClick(_) {
                  return location.href = "/posts/edit/" + post.id;
                } },
              "Edit"
            )
          )
        )
      );
    })
  );
};

//ContentElement.js
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

var ContentElement = function (_React$Component) {
  _inherits(ContentElement, _React$Component);

  function ContentElement(props) {
    _classCallCheck(this, ContentElement);

    var _this = _possibleConstructorReturn(this, (ContentElement.__proto__ || Object.getPrototypeOf(ContentElement)).call(this, props));

    _this.state = {
      posts: []
    };

    //I really dislike this about react >.<
    _this.update = _this.update.bind(_this);
    _this.remove = _this.remove.bind(_this);
    _this.filter = _this.filter.bind(_this);
    _this.debouncedFilter = _this.filter.bind(_this);

    _this.update();
    return _this;
  }

  _createClass(ContentElement, [{
    key: "update",
    value: function update() {
      var _this2 = this;

      $.get("/api/posts/", function (posts) {
        _this2.setState({ posts: posts });
      });
    }
  }, {
    key: "filter",
    value: function filter(term) {
      var _this3 = this;

      if (!term) {
        this.update();
      } else {
        $.get("/api/posts/filter/" + (term || " "), function (posts) {
          _this3.setState({ posts: posts });
        });
      }
    }
  }, {
    key: "debouncedFilter",
    value: function debouncedFilter(term) {
      var _this4 = this;

      //avoid spamming get requests
      debounce(function (event) {
        return _this4.filter(term);
      }, 500, true);
    }
  }, {
    key: "remove",
    value: function remove(id) {
      var _this5 = this;

      $.get("/api/posts/remove/" + id, function (posts) {
        _this5.setState({ posts: posts });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { id: "content" },
        React.createElement(
          "div",
          { id: "posts-list", className: "float-left" },
          React.createElement(
            "div",
            { className: "header centered" },
            "-- Past Posts --"
          ),
          React.createElement(PostsList, { posts: this.state.posts })
        ),
        React.createElement(PostsView, {
          posts: this.state.posts,
          remove: this.remove,
          filter: this.debouncedFilter
        })
      );
    }
  }]);

  return ContentElement;
}(React.Component);

ReactDOM.render(React.createElement(ContentElement, null), document.getElementById('content-element'));
//# sourceMappingURL=all.js.map
