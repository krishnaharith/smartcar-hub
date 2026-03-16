import mongoose from "mongoose";
import Service from "./models/service.js";

const services = [
  { name: "PPF Protection", category: "Protection", price: 1500, description: "Paint Protection Film to guard your vehicle against scratches, chips, and stains." },
  { name: "Denting & Painting", category: "Bodywork", price: 500, description: "Professional dent removal and exact color-match painting for a flawless finish." },
  { name: "Ceramic Coating", category: "Protection", price: 899, description: "Long-lasting specialized ceramic coating for ultimate gloss and weather resistance." },
  { name: "Car Tint & Wraps", category: "Exterior", price: 1200, description: "Custom vinyl wraps and premium window tinting for style and privacy." },
  { name: "Premium Car Wash & Detailing", category: "Maintenance", price: 150, description: "Intensive interior deep clean and exterior wash to maintain your car's hygiene and shine." },
  { name: "Car Accessories Installation", category: "Interior", price: 200, description: "Professional installation of premium aftermarket accessories." },
  { name: "Sound System Upgrades", category: "Audio", price: 1100, description: "High-fidelity audio upgrades including speakers, subwoofers, and amplifiers." },
  { name: "Car Tuning / ECU Remap", category: "Performance", price: 850, description: "Custom ECU tuning to unlock additional horsepower and improve fuel efficiency." },
  { name: "Down Pipe", category: "Performance", price: 650, description: "High-flow exhaust downpipe installation for improved engine breathing." },
  { name: "Alloy Wheels", category: "Exterior", price: 1400, description: "Premium alloy rim replacements to elevate your vehicle's stance." },
  { name: "Door Damping", category: "Audio", price: 350, description: "Acoustic door damping to reduce road noise and improve cabin sound quality." },
  { name: "Headlight & Taillight Upgrades", category: "Exterior", price: 450, description: "Custom LED/HID lighting retrofits and styling upgrades." },
  { name: "Body Kits", category: "Exterior", price: 2500, description: "Aerodynamic body kits including bumpers, side skirts, and spoilers." },
  { name: "Full Car Restoration", category: "Restoration", price: 5000, description: "Comprehensive restoration service to bring classic or damaged vehicles back to life." }
];



mongoose.connect("mongodb+srv://:@cluster0.64xfaci.mongodb.net/smartcar?appName=Cluster0")
  .then(async () => {
    console.log("Connected to MongoDB.");

    // Clear existing
    await Service.deleteMany({});
    console.log("Cleared existing services.");

    // Insert new
    await Service.insertMany(services);
    console.log("Successfully seeded", services.length, "services!");

    process.exit(0);
  }).catch(console.error);
