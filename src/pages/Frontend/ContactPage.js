import React, { useState } from "react";
import "../../assets/css/contactpage.css";


const initialState = { name: "", email: "", website: "", message: "" };

const ContactSection = () => {
 


  return (
    <div className="container contactForm">
      <div className="row">
        <div className="col-md-6 mt-3">
          <h1 style={{ fontFamily: "Playfair-Display", fontSize: "35px" }}>How To Find Us</h1>
          <p className="mt-4" style={{ color: "#767676" }}>
          Get in touch to explore how we can support your learning journey. Whether you have questions about our programs, just want to learn more, feel free to give us a call, send us an email, or fill out the contact form — we’re here to help.
          </p>
          <p style={{ color: "#000000" }}>
            <a href="tel:3075501821" style={{ textDecoration: "none" }}>
              0333-4082706
            </a>
          </p>
          <p className="mt-2" style={{ color: "#000000" }}>
            Main shop Jia Musa Shahdara Lahore, Pakistan , 54950
          </p>
          <p>
            <a href="mailto:theambitious.edu@gmail.com" style={{ textDecoration: "underline", color: "#AE845F" }}>
              theambitious.edu@gmail.com
            </a>
          </p>
        </div>
        <div className="col-md-6 mt-3">
          <h1 style={{ fontFamily: "Playfair-Display", fontSize: "35px" }}>Contact Us</h1>
          <p className="mt-4" style={{ color: "#767676" }}>
            Your email address will not be published. Required fields are marked *
          </p>
          <form  className="contactform">
            <div className="row">
              <div className="form-group col-md-6 mb-1">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Your Name *"
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Your Email *"
                  required
                />
              </div>
            </div>
            <div className="form-group mt-1 ">
              <input
                type="text"
                name="website"
                className="form-control"
                placeholder="Your Website"
               
              />
            </div>
            <div className="form-group mt-3">
              <textarea
                name="message"
                className="form-control"
                rows="4"
                placeholder="Message..."
               
                required
              ></textarea>
            </div>
            <div className="btn-container mt-3">
              <button className="btn4" type="submit">Get In Touch</button>
            </div>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default ContactSection;
