import React from "react";
import AboutUs from "../components/AboutUs";
import FAQS from "../components/FAQS";
import FeaturedPartners from "../components/FeaturedPartners";
import Footer from "../components/Footer";
// import Header from "../components/Header";
import Hero from "../components/Hero";
import HowWeWorks from "../components/HowWrWorks";
import NumericalsComponent from "../components/NumericalsComponent";
import RealTimeSearch from "../components/RealTimeSearch";
import Testimonials from "../components/Testimonials";
import WhyChooseUs from "../components/WhyChooseUs";

function Home() {
  return (
    <div>
      {/* <Header /> */}
      <Hero />
      <RealTimeSearch />
      <HowWeWorks />
      <NumericalsComponent />
      <FeaturedPartners />
      <WhyChooseUs />
      <Testimonials />
      <AboutUs />
      <FAQS />
      <Footer />
    </div>
  );
}

export default Home;
