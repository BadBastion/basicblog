
//PostsList.js
const PostsList = function(props){
  return (
    <div>
      {props.posts
        .map(post =>
          <div className="listpost">

            <div className="float-left padded-left">
              {post.title}
            </div>

            <div className="float-right padded-right">
              Post #: {post.id+1}
            </div>
          </div>)
      }
    </div>
  )
};

//PostsView.js
const PostsView = function(props){
  return (
    <div id="posts-view" className="float-right">

      <div id="search">
        <form>
          Search By Title :
          <input type="text" name="search"
                 onChange={event => props.filter(event.target.value)} />
        </form>
      </div>

      {props.posts
        .map(post =>
          <div className="post" key={post.id}>

            <div className="header centered">
              {post.title}
            </div>

            <div className="date centered">
              Created : {post.created}
            </div>

            <div className="content">
              {post.content}
            </div>

            <div className="buttons">

              <div className="float-right padded-right">
                <button onClick={e => props.remove(post.id)}>
                  remove
                </button>
              </div>

              <div className="float-right padded-right">
                <button onClick={_ => location.href = "/posts/edit/"+post.id }>
                  Edit
                </button>
              </div>

            </div>

          </div>)
      }

    </div>
  );
};

//ContentElement.js
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}



class ContentElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };

    //I really dislike this about react >.<
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.filter = this.filter.bind(this);
    this.debouncedFilter = this.filter.bind(this);

    this.update();
  }

  update(){
    $.get("/api/posts/", (posts) => {
      this.setState({posts: posts});
    })
  }

  filter(term){
    if(!term){
      this.update();
    }else {
      $.get("/api/posts/filter/" + (term || " "), (posts) => {
        this.setState({posts: posts});
      })
    }
  }

  debouncedFilter(term){
    //avoid spamming get requests
    debounce(event => this.filter(term), 500, true)
  }

  remove(id) {
    $.get("/api/posts/remove/"+id, (posts) => {
      this.setState({posts: posts});
    })
  }

  render() {
    return (
      <div id="content">
        <div id="posts-list" className="float-left">
          <div className="header centered">-- Past Posts --</div>
          <PostsList posts={this.state.posts}/>
        </div>
        <PostsView
          posts={this.state.posts}
          remove={this.remove}
          filter={this.debouncedFilter}
          />
      </div>
    );
  }

}

ReactDOM.render(
  <ContentElement />,
  document.getElementById('content-element')
);
