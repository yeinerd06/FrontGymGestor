import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  Container,
  Row,
  Col,
  CardBody,
  Media,
} from "reactstrap";
// core components
import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slider1 from "../../assets/img/carrusel/gym1.jpg";
import slider2 from "../../assets/img/carrusel/gym2.jpg";
import slider3 from "../../assets/img/carrusel/gym3.jpg";

const Carrusel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: "linear",
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      {/* Page content */}
     
        {/* Contenido */}
        
              <Slider className="custom-slider" {...settings}>
                <Media className="align-items-center">
                  <img src={slider1} className="w-100" alt="Slide 1" />
                </Media>
                <Media className="align-items-center">
                  <img src={slider2} className="w-100" alt="Slide 2" />
                </Media>
                <Media className="align-items-center">
                  <img src={slider3} className="w-100" alt="Slide 3" />
                </Media>
              </Slider>
           
        
    </>
  );
};

export default Carrusel;
