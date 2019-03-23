import React, { Component } from 'react';

class Slider extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoadingImageNames: true,
      isLoading: true,
      imagenames: [],
      totalimages: 0,
      images: [],

      activeIndex: 1,
      left: 0,

      error: null
    };

    this.prevSlide = this.prevSlide.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.clickIndicator = this.clickIndicator.bind(this);
  }


  async fetchImages() {
    const response = await
    fetch(`https://screeningtest.vdocipher.com/api/image/`,{
          headers: new Headers({
         'Authorization': 'Bearer fc1be0ce7f79cfe74502163bbc76613e',
         'Content-Type': 'application/x-www-form-urlencoded'
       }),
    });
    const json = await response.json();
    this.setState({
      imagenames: json,
      totalimages: json.length,
      isLoadingImageNames: false,
    })

    this.fetchImageUrls();
  }

  async fetchImageUrls(){
    for(var i = 0 ; i<this.state.totalimages; i++){
      const response1 = await
      fetch(`https://screeningtest.vdocipher.com/api/image/${this.state.imagenames[i].id}`,{
            method: 'post',
            headers: new Headers({
           'Authorization': 'Bearer fc1be0ce7f79cfe74502163bbc76613e',
           'Content-Type': 'application/json'
         }),
      });
      const json1 = await response1.json();
      this.state.images.push(json1);
    }
    this.setState({
      isLoading: false,
    })
    console.log(this.state.images);
  }


  componentWillMount() {
    this.fetchImages();
  }

  componentDidMount() {
    setInterval(() => this.nextSlide(), 1000)
  }

  prevSlide() {
    this.setState({
      activeIndex: this.state.activeIndex - 1,
      left: this.state.left + 400
    })
    if (this.state.activeIndex === 1) {
      this.setState({
        activeIndex: this.state.activeIndex + this.state.totalimages - 1,
        left: this.state.left - this.props.sliderWidth * (this.state.totalimages - 1)
      })
    }
  }

  nextSlide() {
    this.setState({
      activeIndex: this.state.activeIndex + 1,
      left: this.state.left - this.props.sliderWidth
    })
    if (this.state.activeIndex === this.state.totalimages+1) {
      this.setState({
        activeIndex: 1,
        left: 0
      })
    }
  }

  clickIndicator(e) {
    e.preventDefault();
    this.setState({
      activeIndex: parseInt(e.target.textContent),
      left: this.props.sliderWidth - parseInt(e.target.textContent) * this.props.sliderWidth
    })
  }

  render() {
    const { isLoading } = this.state;
    var style = {
      left: this.state.left,
      width: this.props.sliderWidth,
      height: this.props.sliderHeight
    };
    return (
      <div>
        {!isLoading ? (

        <div id="app">
          <h1> Avengers Avenue </h1>
          <br />
          <div  className="slider-wrapper">
            <ul className="slider">
              {this.state.images.map(function(item,index) {
                return (
                <li key={index} style={style} className={index+1 === this.state.activeIndex ? 'slider-item' : 'hide'}>
                <img src={item.url} width="400px" height="250px" alt={item.id}/>
                </li>
                )
              },this)
              }
            </ul>
          </div>
          <div className="buttons-wrapper">
          <button className="prev-button" onClick={this.prevSlide}></button>
          <button className="next-button" onClick={this.nextSlide}></button>
          </div>
          <div className="indicators-wrapper">
            <ul className="indicators">
              {this.state.images.map((item,index)=> {
                return (
                  <li key={index} className={index+1 === this.state.activeIndex ? 'active-indicator' : ''}onClick={this.clickIndicator}>{index+1}</li>
                )
                },this)
              }
            </ul>
          </div>
        </div>

        ) : (
          <h3>Loading...</h3>
        )}
      </div>
    );
  }
}

export default Slider;
