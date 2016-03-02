/** @jsx React.DOM */

var Router        = ReactRouter;
var DefaultRoute  = Router.DefaultRoute;
var Link          = Router.Link;
var Route         = Router.Route;
var RouteHandler  = Router.RouteHandler;
var Redirect      = Router.Redirect;


/**
 *  App holder
 */

var App   = React.createClass({
  render: function() {
    return (
      <div className='row'>
        <div className='col-md-2'>
          <h4>Images</h4>
          <ImagesComponent render="sidebar" />
        </div>
        <RouteHandler />
      </div>
    );
  }
});


/**
 *  Component: Images
 */

var ImagesComponent = React.createClass({
  getDefaultProps: function() {
    return {
      source: "https://api.github.com/search/repositories?q=user:azukiapp+user:azuki-images+fork:true+docker-+in:name",
    };
  },
  getInitialState: function() {
    return {images: []};
  },
  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      if (this.isMounted()) {
        var filteredDockerImages = this.filterDockerImages(result.items);
        var imagesSortedByName = _.sortBy(filteredDockerImages, 'name');
        this.setState({
          images: imagesSortedByName
        });
      }
    }.bind(this));
  },
  render: function() {
    return (this.props.render == "sidebar")   ? <ImagesSidebar images={this.state.images} />
                                              : <ImagesTable images={this.state.images} />;
  },

  /**
   * Utils
   */
  filterDockerImages: function(images) {
    var black_list        = ['docker-registry-downloader'];
    var regex_filter      = new RegExp(/^docker-/);
    var filteredProjects  = _.filter(images, function(project) {
      return !_.contains(black_list, project.name) && project.name.match(regex_filter) ;
    });
    return _.map(filteredProjects, function(project){
      return {
        id: project.full_name.replace(/docker-/, ''),
        name: project.name.replace(/docker-/, '').replace(/-/, ' '),
        full_name: project.full_name.replace(/docker-/, ''),
        description: project.description
      }
    });
  }
});


/**
 *  Component: Images - sidebar render
 */

var ImagesSidebar = React.createClass({
  render: function() {
    return (
      <div id="images-sidebar">
        <ul className="list-group">
          {this.props.images.map(function(image){
            return (
              <a key={image.id} className="list-group-item" href={'/#/' + image.id}>
                {image.name}
              </a>
            )
          })}
        </ul>
      </div>
    );
  }
});


/**
 *  Component: Images - index render
 */

var ImagesTable = React.createClass({
  render: function() {
    return (
      <table className="table table-condensed table-hover">
        <tbody>
          {this.props.images.map(function(image){
            return (
              <tr key={image.id}>
                <td><a href={'/#/' + image.id }><strong>{ image.full_name }</strong></a></td>
                <td>{ image.description }</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    );
  }
});
