import React from 'react'
import ReactDOM from 'react-dom'
import { Box, Item } from 'react-polymer-layout'
import Skrollr from 'skrollr'
import Snap from 'snapsvg'
import {Link} from 'react-router'

const initSkrollr = function() {
    window.Skrollr = Skrollr.init({
        smoothScrolling: false,
        mobileDeceleration: 0.004,
    });
};

const setTranslateX = function(node, amount) {
    node.style.webkitTransform =
    node.style.MozTransform =
    node.style.msTransform =
    node.style.transform = "translateX(" + Math.round(amount) + "px)";
};

let latestTilt,
    disableTilt,
    centerOffset,
    viewPort,
    imgAspectRatio,
    tiltBarWidth,
    tiltBarIndicatorWidth,
    tiltCenterOffset;

const NewList = React.createClass({
    getInitialState() {
      return {
        imagePosition: '',
        imgUrl: ' ',
        imageOpen: false,
        imageTran: false,
        textShow: false,
        imgNode: '',
        imgData: '',
        barNode: '',
        maxTilt: 20,
        imgTransform: '',
      };
    },

    componentDidMount() {
        initSkrollr();
    },

    handleImage(e) {
        // let parent = e.target.parentNode.previousSibling;
        // window.Skrollr.animateTo(window.Skrollr.relativeToAbsolute(parent, 'top', 'center'),{duration:200});
        this.setState({
            imgTransform: e.target.style.transform,
            imgUrl: e.target.src,
            imagePosition: e.target.parentNode,
            imageOpen: true,
        });
        setTimeout(_ => {
            this.setState({
               imageTran: true,
               textShow: true,
           });
        },100);
        this.setState({
            test: true,
        });
    },

    startImage() {
        this.setState({
            textShow: false,
        });
        this.initMath();
        this.startAnimat();
        this.addEventListeners();
    },

    closeImage() {
        this.setState({
            imageTran: false,
        });
        setTimeout(_ => {
            this.setState({
               imageOpen: false,
               textShow: false,
           });
        },400);
    },

    initMath() {
        this.state.imgNode = ReactDOM.findDOMNode(this.refs.overImage);
        this.state.barNode = ReactDOM.findDOMNode(this.refs.overBar);
        viewPort = {
            winHeight: parseInt(window.innerHeight, 10),
            winWidth: parseInt(window.innerWidth, 10),
        };
        this.state.imgData = this.state.imgNode.getBoundingClientRect();
        imgAspectRatio = this.state.imgData.width / this.state.imgData.height; 
    },

    startAnimat() {
        let tiltBarPadding = 20;
        centerOffset = (this.state.imgData.width - viewPort.winWidth) / 2;
        tiltBarWidth = viewPort.winWidth - tiltBarPadding;

        tiltBarIndicatorWidth = (viewPort.winWidth * tiltBarWidth) / this.state.imgData.width;
        this.state.barNode.style.width = tiltBarIndicatorWidth + 'px';

        tiltCenterOffset = ((tiltBarWidth / 2) - (tiltBarIndicatorWidth / 2));

        if (tiltCenterOffset > 0) {
            disableTilt = false;
        } else {
            disableTilt = true;
            latestTilt = 0;
        }

        this.photoTilt();
    },

    addEventListeners() {
        if (window.DeviceOrientationEvent) {

            let averageGamma = [];

            window.addEventListener('deviceorientation', function(eventData) {

                if (!disableTilt) {

                    if (averageGamma.length > 8) {
                        averageGamma.shift();
                    }

                    averageGamma.push(eventData.gamma);

                    latestTilt = averageGamma.reduce(function(a, b) { return a+b; }) / averageGamma.length;

                }

            }, false);

            window.requestAnimationFrame(this.photoTilt);

        }
    },

    photoTilt() {
        let tilt = latestTilt;
        let pxToMove;

        if (tilt > 0) {
            tilt = Math.min(tilt, this.state.maxTilt);
        } else {
            tilt = Math.max(tilt, this.state.maxTilt * -1);
        }

        pxToMove = (tilt * centerOffset) / this.state.maxTilt;

        this.updateImgPosition((centerOffset + pxToMove) * -1);

        this.updateTiltBar(tilt);

        window.requestAnimationFrame(this.photoTilt);
    },

    updateTiltBar(tilt) {
        let pxToMove = (tilt * ((tiltBarWidth - tiltBarIndicatorWidth) / 2)) / this.state.maxTilt;
        setTranslateX(this.state.barNode, (tiltCenterOffset + pxToMove) );
    },

    updateImgPosition(pxToMove) {
        setTranslateX(this.state.imgNode, pxToMove);
    },

    handleHref() {
        // window.location.href = '/list';
        let apple = document.querySelector('.link-to');
        apple.click() 
    },

    render() {
        let imagePos = this.state.imagePosition? this.state.imagePosition.getBoundingClientRect() : '';
        let dy = this.state.imageTran ? -1 * imagePos.top : 0;
        let cy = this.state.textShow ?  '40vh' : '100vh';
        let contentStyle = {
            height: this.state.imageTran ? '100vh' : imagePos.height,
            width: this.state.imageTran ? '100vw' : imagePos.width,
            top: imagePos.top,
            left: 0,
            opacity: this.state.imageOpen? 1 : 0,
            transform: 'translate3d( 0, ' + dy + 'px, 0 )',
            WebkitTransform: 'translate3d( 0, ' + dy + 'px, 0 )',
        };
        let imageStyle = {
            transform: this.state.imgTransform,
        };
        let textStyle = {
            transform: 'translate3d( 0, ' + cy + ', 0 )',
            WebkitTransform: 'translate3d( 0, ' + cy + ', 0 )',
        };
        return (
            <div className="li-main">
                <Box id="skrollr-body" center vertical className="li-body">
                    <div className="li-box">
                    </div>
                    <div id="skrollrs" className="li-box">
                        <img ref="image" onClick={e => this.handleImage(e)} className="li-box-img" src={'./images/treats2.jpg'} 
                             data-bottom-top="transform: translate3d(0, -30%, 0px);" 
                             data-top-bottom="transform: translate3d(0, 0%, 0px);"/>
                    </div>
                    <div onClick={e => this.handleImage(e)} className={"li-box"}>
                        <img className="li-box-img" src={'./images/green-goddess-sandwiches-31.jpg'} 
                             data-bottom-top="transform: translate3d(-35%, -30%, 0px);" 
                             data-top-bottom="transform: translate3d(-35%, 0%, 0px);" />
                    </div>
                    <div className="li-box" onClick={this.handleHref}></div>
                    <div className="li-box">
                        <Link className="link-to" to="/list">About</Link>
                    </div>
                    <div className="li-box"></div>
                    <div className="li-box"></div>
                </Box>
                <div className={ this.state.imageTran ? "li-overlay show-content" : "li-overlay"}>
                    <div className= "li-over-content" style={contentStyle}>
                        <img onClick={this.startImage} ref="overImage" style={imageStyle} className="li-over-image" src={this.state.imgUrl} />
                        <div className="li-over-bar">
                            <div ref="overBar" className="li-bar-indicoter"></div>
                        </div>
                    </div>
                    <div onClick={this.closeImage} className="li-over-text" style={textStyle}>
                        
                    </div>
                </div>
            </div>
        );
    },
});

module.exports = NewList;