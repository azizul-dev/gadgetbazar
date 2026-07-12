const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// .env থেকে ম্যানুয়ালি এনভায়রনমেন্ট ভ্যারিয়েবল লোড করা
const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim().replace(/^["']|["']$/g, "");
    process.env[key] = value;
  }
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI পাওয়া যায়নি .env এ");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

const GadgetSchema = new mongoose.Schema(
  {
    title: String,
    category: {
      type: String,
      enum: ["phone", "laptop", "camera", "audio", "gaming", "other"],
    },
    price: Number,
    condition: { type: String, enum: ["new", "used", "refurbished"] },
    shortDescription: String,
    fullDescription: String,
    images: [String],
    location: String,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["available", "sold"], default: "available" },
  },
  { timestamps: true },
);
const TestimonialSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    text: String,
    rating: { type: Number, min: 1, max: 5, default: 5 },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Gadget = mongoose.models.Gadget || mongoose.model("Gadget", GadgetSchema);
const Testimonial =
  mongoose.models.Testimonial ||
  mongoose.model("Testimonial", TestimonialSchema);

const img = (keyword, lock) =>
  `https://loremflickr.com/500/375/${keyword}?lock=${lock}`;

const locations = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Rangpur",
  "Barishal",
  "Comilla",
  "Mymensingh",
  "Narayanganj",
];
const loc = (i) => locations[i % locations.length];
const testimonials = [
  {
    name: "Rafiul Islam",
    role: "Verified Buyer • Dhaka",
    text: "I sold my old MacBook within just two days. The entire process was smooth, secure, and incredibly simple.",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    role: "Verified Seller • Chattogram",
    text: "Listing my gadget took less than five minutes. I quickly connected with genuine buyers without any hassle.",
    rating: 5,
  },
  {
    name: "Tanvir Ahmed",
    role: "Verified Buyer • Sylhet",
    text: "I found exactly what I was looking for at a great price. The seller was trustworthy and the experience was excellent.",
    rating: 5,
  },
  {
    name: "Farzana Akter",
    role: "Verified Seller • Khulna",
    text: "Great platform to sell unused gadgets. Payment and communication with the buyer were both hassle-free.",
    rating: 4,
  },
];

const gadgets = [
  // ---- Phones ----
  {
    title: "iPhone 13 Pro 128GB",
    category: "phone",
    price: 65000,
    condition: "used",
    shortDescription:
      "Excellent condition iPhone 13 Pro, all accessories included.",
    fullDescription:
      "iPhone 13 Pro 128GB, Sierra Blue color. Battery health 89%. No scratches, always used with case and glass protector. Original box and charger included.",
    images: [img("iphone", 1)],
  },
  {
    title: "Samsung Galaxy S22 Ultra",
    category: "phone",
    price: 78000,
    condition: "used",
    shortDescription: "Galaxy S22 Ultra with S-Pen, 256GB storage.",
    fullDescription:
      "Samsung Galaxy S22 Ultra 256GB Phantom Black. S-Pen included. Minor scratch on back panel, screen is flawless. Selling due to upgrade.",
    images: [img("samsung-phone", 2)],
  },
  {
    title: "iPhone 14 128GB",
    category: "phone",
    price: 92000,
    condition: "refurbished",
    shortDescription: "Certified refurbished iPhone 14, like new.",
    fullDescription:
      "Refurbished iPhone 14 128GB, Midnight color. Passed 40-point quality check. New battery installed. 3 months seller warranty.",
    images: [img("iphone14", 3)],
  },
  {
    title: "Xiaomi Redmi Note 12",
    category: "phone",
    price: 18000,
    condition: "new",
    shortDescription: "Brand new, sealed box, official warranty.",
    fullDescription:
      "Redmi Note 12 6/128GB. Sealed box, unopened. Official Xiaomi Bangladesh warranty card included.",
    images: [img("xiaomi-phone", 4)],
  },
  {
    title: "OnePlus 11 5G",
    category: "phone",
    price: 55000,
    condition: "used",
    shortDescription: "OnePlus 11, Hasselblad camera, 16GB RAM.",
    fullDescription:
      "OnePlus 11 16/256GB Titan Black. Used carefully for 6 months. Fast charger and cover included.",
    images: [img("oneplus", 5)],
  },
  {
    title: "Google Pixel 7",
    category: "phone",
    price: 60000,
    condition: "used",
    shortDescription: "Clean Android experience, great camera.",
    fullDescription:
      "Google Pixel 7 128GB, imported. Excellent camera performance, stock Android. Minor wear on frame only.",
    images: [img("google-pixel", 6)],
  },

  // ---- Laptops ----
  {
    title: "MacBook Air M1 2020",
    category: "laptop",
    price: 85000,
    condition: "refurbished",
    shortDescription: "MacBook Air M1, 8GB/256GB, battery cycle low.",
    fullDescription:
      "MacBook Air M1 2020, 8GB RAM/256GB SSD. Battery cycle count 120. Refurbished by authorized service center, 6 months warranty.",
    images: [img("macbook", 7)],
  },
  {
    title: "Dell XPS 13",
    category: "laptop",
    price: 72000,
    condition: "used",
    shortDescription: "Dell XPS 13, i7 11th gen, 16GB RAM.",
    fullDescription:
      "Dell XPS 13 9310, Core i7 11th Gen, 16GB RAM, 512GB SSD. InfinityEdge display, minor scuff on lid.",
    images: [img("dell-laptop", 8)],
  },
  {
    title: "HP Pavilion 15",
    category: "laptop",
    price: 45000,
    condition: "used",
    shortDescription: "HP Pavilion 15, Ryzen 5, good for students.",
    fullDescription:
      "HP Pavilion 15, AMD Ryzen 5, 8GB RAM, 512GB SSD. Ideal for office/study work. Charger included.",
    images: [img("hp-laptop", 9)],
  },
  {
    title: "Lenovo ThinkPad X1 Carbon",
    category: "laptop",
    price: 95000,
    condition: "used",
    shortDescription: "Business ultrabook, i7, 16GB, lightweight.",
    fullDescription:
      "ThinkPad X1 Carbon Gen 9, Core i7, 16GB RAM, 1TB SSD. Business grade build, excellent keyboard, light travel weight.",
    images: [img("thinkpad", 10)],
  },
  {
    title: "ASUS ROG Zephyrus G14",
    category: "laptop",
    price: 110000,
    condition: "used",
    shortDescription: "Gaming laptop, RTX graphics, Ryzen 9.",
    fullDescription:
      "ASUS ROG Zephyrus G14, Ryzen 9, RTX 3060, 16GB RAM, 1TB SSD. Great for gaming and editing. Original box included.",
    images: [img("gaming-laptop", 11)],
  },
  {
    title: "MacBook Pro 13 M2",
    category: "laptop",
    price: 145000,
    condition: "new",
    shortDescription: "Sealed MacBook Pro M2, official warranty.",
    fullDescription:
      "MacBook Pro 13 M2 chip, 8GB/256GB. Brand new sealed box with Apple Bangladesh official warranty.",
    images: [img("macbook-pro", 12)],
  },

  // ---- Cameras ----
  {
    title: "Canon EOS 200D",
    category: "camera",
    price: 42000,
    condition: "used",
    shortDescription: "Canon 200D with 18-55mm kit lens.",
    fullDescription:
      "Canon EOS 200D DSLR with 18-55mm kit lens. Shutter count under 8000. Great for beginners and vlogging.",
    images: [img("canon-camera", 13)],
  },
  {
    title: "Sony Alpha A6400",
    category: "camera",
    price: 68000,
    condition: "used",
    shortDescription: "Mirrorless camera, excellent autofocus.",
    fullDescription:
      "Sony A6400 body with 16-50mm lens. Fast autofocus, great for photography and video. Well maintained.",
    images: [img("sony-camera", 14)],
  },
  {
    title: "Nikon D5600",
    category: "camera",
    price: 38000,
    condition: "used",
    shortDescription: "Nikon DSLR with 18-140mm lens.",
    fullDescription:
      "Nikon D5600 with 18-140mm VR lens. Vari-angle touchscreen, ideal for travel photography.",
    images: [img("nikon-camera", 15)],
  },
  {
    title: "GoPro Hero 10",
    category: "camera",
    price: 25000,
    condition: "refurbished",
    shortDescription: "Action camera, 5.3K video, waterproof.",
    fullDescription:
      "GoPro Hero 10 Black, refurbished with accessories kit. 5.3K60 video, waterproof up to 10m.",
    images: [img("gopro", 16)],
  },
  {
    title: "Fujifilm X-T30",
    category: "camera",
    price: 58000,
    condition: "new",
    shortDescription: "Mirrorless camera, classic film simulation.",
    fullDescription:
      "Fujifilm X-T30 with 15-45mm lens, sealed box. Famous for Fuji color film simulations.",
    images: [img("fujifilm-camera", 17)],
  },

  // ---- Audio ----
  {
    title: "Sony WH-1000XM4",
    category: "audio",
    price: 22000,
    condition: "new",
    shortDescription: "Industry leading noise cancelling headphones.",
    fullDescription:
      "Sony WH-1000XM4 wireless headphones, sealed box. Best-in-class ANC, 30 hour battery life.",
    images: [img("sony-headphones", 18)],
  },
  {
    title: "Bose QuietComfort 45",
    category: "audio",
    price: 26000,
    condition: "used",
    shortDescription: "Premium comfort, great noise cancellation.",
    fullDescription:
      "Bose QC45, lightly used, comes with original case and cable. Excellent for travel and office.",
    images: [img("bose-headphones", 19)],
  },
  {
    title: "JBL Flip 6 Speaker",
    category: "audio",
    price: 8000,
    condition: "new",
    shortDescription: "Portable waterproof Bluetooth speaker.",
    fullDescription:
      "JBL Flip 6, sealed box, IP67 waterproof rating, 12 hours playtime.",
    images: [img("bluetooth-speaker", 20)],
  },
  {
    title: "AirPods Pro 2nd Gen",
    category: "audio",
    price: 19000,
    condition: "used",
    shortDescription: "Active noise cancellation, USB-C case.",
    fullDescription:
      "AirPods Pro 2, used for 3 months, comes with MagSafe charging case. Ear tips sanitized.",
    images: [img("airpods", 21)],
  },
  {
    title: "Marshall Major IV",
    category: "audio",
    price: 12000,
    condition: "new",
    shortDescription: "Classic design, wireless charging headphones.",
    fullDescription:
      "Marshall Major IV on-ear headphones, sealed box. 80+ hours battery, wireless charging pad compatible.",
    images: [img("marshall-headphones", 22)],
  },

  // ---- Gaming ----
  {
    title: "PlayStation 5",
    category: "gaming",
    price: 58000,
    condition: "used",
    shortDescription: "PS5 disc edition with 2 controllers.",
    fullDescription:
      "PlayStation 5 disc edition, comes with 2 DualSense controllers and 3 games installed. Excellent condition.",
    images: [img("playstation", 23)],
  },
  {
    title: "Xbox Series X",
    category: "gaming",
    price: 52000,
    condition: "used",
    shortDescription: "1TB storage, 4K gaming console.",
    fullDescription:
      "Xbox Series X 1TB, includes controller and HDMI cable. Runs games in native 4K smoothly.",
    images: [img("xbox", 24)],
  },
  {
    title: "Nintendo Switch OLED",
    category: "gaming",
    price: 32000,
    condition: "new",
    shortDescription: "OLED model, sealed box, white joycon.",
    fullDescription:
      "Nintendo Switch OLED model, white Joy-Con, sealed retail box with official warranty.",
    images: [img("nintendo-switch", 25)],
  },
  {
    title: "Mechanical Gaming Keyboard",
    category: "gaming",
    price: 6500,
    condition: "new",
    shortDescription: "RGB backlit mechanical keyboard, blue switches.",
    fullDescription:
      "RGB mechanical gaming keyboard with blue switches, anti-ghosting keys, sealed box.",
    images: [img("mechanical-keyboard", 26)],
  },

  // ---- Other / Accessories ----
  {
    title: "Apple Watch Series 8",
    category: "other",
    price: 35000,
    condition: "used",
    shortDescription: "GPS 45mm, health tracking features.",
    fullDescription:
      "Apple Watch Series 8 GPS 45mm, minor scratches on band, screen flawless. Comes with charger.",
    images: [img("apple-watch", 27)],
  },
  {
    title: "iPad Air 5th Gen",
    category: "other",
    price: 62000,
    condition: "used",
    shortDescription: "M1 chip, 64GB, great for note-taking.",
    fullDescription:
      "iPad Air 5th Gen with M1 chip, 64GB WiFi. Used with case since day one, no scratches.",
    images: [img("ipad-tablet", 28)],
  },
  {
    title: "Anker Power Bank 20000mAh",
    category: "other",
    price: 2500,
    condition: "new",
    shortDescription: "Fast charging power bank, dual USB output.",
    fullDescription:
      "Anker 20000mAh power bank, PD fast charging, sealed box with cable included.",
    images: [img("power-bank", 29)],
  },
  {
    title: "Logitech MX Master 3",
    category: "other",
    price: 7000,
    condition: "new",
    shortDescription: "Wireless ergonomic mouse for productivity.",
    fullDescription:
      "Logitech MX Master 3 wireless mouse, sealed box, multi-device Bluetooth pairing support.",
    images: [img("wireless-mouse", 30)],
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  let seller = await User.findOne({ email: "demoseller@gadgetbazar.com" });
  if (!seller) {
    const hashedPassword = await bcrypt.hash("demo1234", 10);
    seller = await User.create({
      name: "Demo Seller",
      email: "demoseller@gadgetbazar.com",
      password: hashedPassword,
      role: "user",
    });
    console.log("✅ Demo seller created:", seller.email);
  } else {
    console.log("ℹ️  Existing demo seller ব্যবহার হচ্ছে:", seller.email);
  }

  const existingCount = await Gadget.countDocuments({ sellerId: seller._id });
  if (existingCount > 0) {
    console.log(
      `⚠️  Demo seller-এর অধীনে ইতিমধ্যে ${existingCount}টা গ্যাজেট আছে। ডুপ্লিকেট এড়াতে স্কিপ করা হলো।`,
    );
    console.log(
      "নতুন করে সিড করতে চাইলে আগে ম্যানুয়ালি ডিলিট করুন অথবা scripts/clear-seed.js বানিয়ে বলুন।",
    );
  } else {
    const withSellerAndLoc = gadgets.map((g, i) => ({
      ...g,
      location: loc(i),
      sellerId: seller._id,
      status: "available",
    }));
    const inserted = await Gadget.insertMany(withSellerAndLoc);
    console.log(`✅ ${inserted.length}টা গ্যাজেট সফলভাবে যোগ হয়েছে!`);
  }
  const existingTestimonials = await Testimonial.countDocuments();
  if (existingTestimonials > 0) {
    console.log(`ℹ️  ইতিমধ্যে ${existingTestimonials}টা testimonial আছে, স্কিপ করা হলো।`);
  } else {
    const insertedTestimonials = await Testimonial.insertMany(testimonials);
    console.log(`✅ ${insertedTestimonials.length}টা testimonial সফলভাবে যোগ হয়েছে!`);
  }

  await mongoose.disconnect();
  console.log("✅ Done");
}

main().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
