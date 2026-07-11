import { ShieldCheck, Users, Recycle, Award } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Active Listings", value: "500+" },
    { label: "Verified Sellers", value: "1,200+" },
    { label: "Happy Buyers", value: "3,000+" },
    { label: "Cities Covered", value: "8" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Trust & Safety",
      description:
        "Every listing goes through our review process, and sellers are verified account holders — not anonymous posts.",
    },
    {
      icon: Recycle,
      title: "Sustainability",
      description:
        "Giving old gadgets a second life reduces e-waste and helps more people access technology at fair prices.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "We built GadgetBazar for everyday people in Bangladesh who want a simple, honest way to buy and sell gadgets.",
    },
    {
      icon: Award,
      title: "Fair Pricing",
      description:
        "No hidden fees, no bidding wars. Sellers set their price, buyers browse transparently.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-block rounded-full bg-blue-50 text-blue-600 text-sm font-medium px-4 py-1.5 mb-4">
          About Us
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Bangladesh's Trusted Marketplace for Second-Hand Gadgets
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
          GadgetBazar started with a simple idea: buying and selling used
          phones, laptops, cameras, and headphones shouldn't feel risky or
          confusing. We connect verified sellers with buyers looking for
          quality gadgets at honest prices.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center rounded-2xl border border-gray-100 bg-white shadow-sm py-6 px-3"
          >
            <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            Every year, thousands of perfectly usable phones, laptops, and
            cameras sit unused in drawers across Bangladesh — replaced by
            newer models but never sold, because the process felt too
            complicated or unsafe. At the same time, many buyers struggle to
            find affordable, trustworthy gadgets from local Facebook groups
            or classifieds with no accountability.
          </p>
          <p>
            GadgetBazar was built to close that gap. We give sellers a
            dedicated platform with a real profile, structured listings, and
            direct communication with buyers. We give buyers a searchable,
            filterable marketplace where every listing includes real photos,
            honest condition details, and a verified seller behind it.
          </p>
        </div>
      </div>

      {/* Values */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          What We Stand For
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                <Icon size={20} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
